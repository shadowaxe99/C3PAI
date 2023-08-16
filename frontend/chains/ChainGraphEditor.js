import React, { useState, useRef, useCallback } from "react";
import { v4 as uuid4 } from "uuid";
import { Box, Input, useToast } from "@chakra-ui/react";
import ReactFlow, {
  addEdge,
  updateEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import ConfigNode from "chains/flow/ConfigNode";
import { useChainEditorAPI } from "chains/hooks/useChainEditorAPI";
import { useNavigate } from "react-router-dom";

import "reactflow/dist/style.css";
import "./styles.css";
import { ChainEditorAPIContext } from "chains/editor/ChainEditorAPIContext";
import {
  getEdgeStyle,
  toReactFlowNode,
  useGraphForReactFlow,
} from "chains/hooks/useGraphForReactFlow";
import { useColorMode } from "@chakra-ui/color-mode";
import { RootNode } from "chains/flow/RootNode";
import { getDefaults } from "chains/flow/TypeAutoFields";
import { useDebounce } from "utils/hooks/useDebounce";
import { useAxios } from "utils/hooks/useAxios";

// Nodes are either a single node or a group of nodes
// ConfigNode renders class_path specific content
const nodeTypes = {
  node: ConfigNode,
  list: ConfigNode,
  root: RootNode,
};

const ChainGraphEditor = ({ graph }) => {
  const reactFlowWrapper = useRef(null);
  const edgeUpdate = useRef(true);
  const [chainRef, setChainRef] = useState(graph?.chain);
  const [chainLoaded, setChainLoaded] = useState(graph?.chain !== undefined);
  const { call: loadChain } = useAxios();

  const reactFlowGraph = useGraphForReactFlow(graph);
  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowGraph.edges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const navigate = useNavigate();

  const onAPIError = useCallback((err) => {
    toast({
      title: "Error",
      description: `Failed to save chain. ${err.message}`,
      status: "error",
      duration: 10000,
      isClosable: true,
    });
  }, []);

  const api = useChainEditorAPI({
    chain: chainRef,
    onError: onAPIError,
    reactFlowInstance,
  });

  // handle dragging a node onto the graph
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeSaved = useCallback(
    (response) => {
      // first node creates the new chain
      // redirect to the correct URL
      if (!chainLoaded) {
        navigate(`/chains/${response.data.chain_id}`, { replace: true });
        loadChain(`/api/chains/${response.data.chain_id}`, {
          onSuccess: (response) => {
            setChainRef(response.data);
            setChainLoaded(true);
          },
        });
      }
    },
    [chainRef?.id, chainLoaded]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeType = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      // check if the dropped element is valid
      if (typeof nodeType.type === "undefined" || !nodeType.type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // create data object instead of waiting for graphql
      const data = {
        id: uuid4(),
        chain_id: chainRef?.id || null,
        class_path: nodeType.class_path,
        position: position,
        config: getDefaults(nodeType),
      };

      // create ReactFlow node
      const flowNode = toReactFlowNode(data, nodeType);

      // add to API and ReactFlow
      api.addNode(data, { onSuccess: onNodeSaved });
      setNodes((nds) => nds.concat(flowNode));
    },
    [reactFlowInstance, chainRef?.id]
  );

  const onFilteredNodesChange = useCallback(
    (flowNodes) => {
      // root node can't be moved.
      if (flowNodes[0].id === "root") {
        return;
      }
      return onNodesChange(flowNodes);
    },
    [onNodesChange]
  );

  const onNodeDragStop = useCallback((event, node) => {
    // update node with new position
    api.updateNodePosition(node.id, node.position);
  }, []);

  // new edges
  const onConnect = useCallback(
    (params) => {
      // create reactflow edge
      const id = uuid4();
      const source = reactFlowInstance.getNode(params.source);
      const flowNodeType =
        source.id === "root" ? "root" : source.data.type.type;
      const style = getEdgeStyle(colorMode, flowNodeType);
      setEdges((els) => addEdge({ ...params, data: { id }, style }, els));

      // save via API
      if (source.id === "root") {
        // link from root node uses setRoot since it's not stored as an edge
        api.setRoot(chainRef.id, { node_id: params.target });
      } else {
        // normal link and prop edges
        const data = {
          id,
          source_id: params.source,
          target_id: params.target,
          key: params.targetHandle,
          chain_id: chainRef?.id,
          relation: params.sourceHandle === "out" ? "LINK" : "PROP",
        };
        api.addEdge(data);
      }
    },
    [chainRef, reactFlowInstance, colorMode]
  );

  const isValidConnection = useCallback(
    // Connections are allowed when the source and target types match
    // and the target has an open connector slot. Targets may optionally
    // support multiple connections.

    (connection) => {
      // target
      const target = reactFlowInstance.getNode(connection.target);
      const connectors = target.data.type.connectors;
      let connector, expectedType;
      if (connection.targetHandle === "in") {
        expectedType = "chain-link";
      } else {
        connector = connectors.find((c) => c.key === connection.targetHandle);
        expectedType = connector?.source_type;
      }
      const supportsMultiple = connector?.multiple || false;

      // source
      const source = reactFlowInstance.getNode(connection.source);
      const providedType =
        connection.sourceHandle === "out"
          ? "chain-link"
          : source.data.type.type;

      // connection types must match
      // HAX: adding a special case for chain-agent connections until expectedType can be
      //      expanded to be a set of types
      if (
        expectedType === providedType ||
        (expectedType === "chain" && providedType === "agent")
      ) {
        const instanceEdges = reactFlowInstance.getEdges();
        const targetEdges = instanceEdges.filter(
          (e) =>
            e.target === target.id && e.targetHandle === connection.targetHandle
        );
        const sourceEdges = instanceEdges.filter(
          (e) =>
            e.source === source.id && e.sourceHandle === connection.sourceHandle
        );
        const sourceConnected = sourceEdges.length > 0;
        const targetConnected = targetEdges.length > 0;

        if (edgeUpdate.edge) {
          // valid when updating an edge:
          // - if connecting to the same target/source
          // - if connecting to an unconnected target/source
          // - if target supports multiple connections
          const currentSource = edgeUpdate.edge.source;
          const currentTarget = edgeUpdate.edge.target;
          const isSameSource = connection.source === currentSource;
          const isSameTarget = connection.target === currentTarget;

          return (
            (isSameSource || !sourceConnected) &&
            (isSameTarget || !targetConnected || supportsMultiple)
          );
        } else {
          // valid when creating a new edge
          // - if connecting to an unconnected target/source
          // - if target supports multiple connections
          return !sourceConnected && (!targetConnected || supportsMultiple);
        }
      }

      return false;
    },
    [reactFlowInstance]
  );

  const onEdgeUpdateStart = useCallback(
    (event, edge) => {
      // reset flag when edge is grabbed
      edgeUpdate.edge = edge;
      edgeUpdate.toHandle = false;
    },
    [setEdges]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      // update edge if dropped on valid handle
      edgeUpdate.toHandle = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
      if (newConnection.source === "root") {
        if (oldEdge.target !== newConnection.target) {
          api.setRoot({ chain_id: chainRef.id, node_id: newConnection.target });
        }
      } else {
        const isSame =
          oldEdge.source === newConnection.source &&
          oldEdge.target === newConnection.target;
        if (!isSame) {
          api.updateEdge(oldEdge.data.id, {
            source_id: newConnection.source,
            target_id: newConnection.target,
          });
        }
      }
    },
    [chainRef?.id, setEdges]
  );

  const onEdgeUpdateEnd = useCallback(
    (_, edge) => {
      // delete edge if dropped on graph
      if (!edgeUpdate.toHandle) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        if (edge.source === "root") {
          api.setRoot(chainRef.id, { node_id: null });
        } else {
          api.deleteEdge(edge.data.id);
        }
      }
      edgeUpdate.edge = null;
    },
    [chainRef?.id, setEdges]
  );

  const { callback: debouncedChainUpdate } = useDebounce((...args) => {
    api.updateChain(...args);
  }, 1000);

  const { callback: debouncedChainCreate } = useDebounce((...args) => {
    api.createChain(...args);
  }, 1000);

  const onTitleChange = useCallback(
    (event) => {
      setChainRef({ ...chainRef, name: event.target.value });
      if (!chainLoaded) {
        debouncedChainCreate(
          { name: event.target.value, description: "" },
          {
            onSuccess: (response) => {
              navigate(`/chains/${response.data.id}`, {
                replace: true,
              });
              setChainRef(response.data);
              setChainLoaded(true);
            },
          }
        );
      } else {
        debouncedChainUpdate({
          ...chainRef,
          name: event.target.value,
        });
      }
    },
    [chainRef, api, chainLoaded]
  );

  return (
    <Box height="93vh">
      <Box pb={1}>
        <Input
          size="sm"
          value={chainRef?.name || "Unnamed"}
          width={300}
          borderColor="transparent"
          _hover={{
            border: "1px solid",
            borderColor: "gray.500",
          }}
          onChange={onTitleChange}
        />
      </Box>
      <ChainEditorAPIContext.Provider value={api}>
        <Box ref={reactFlowWrapper} width={"85vw"} height={"100%"}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            isValidConnection={isValidConnection}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDragStop={onNodeDragStop}
            onNodesChange={onFilteredNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            fitView
          >
            <Controls />
            <Background
              color={colorMode === "light" ? "#111" : "#aaa"}
              gap={16}
            />
          </ReactFlow>
        </Box>
      </ChainEditorAPIContext.Provider>
    </Box>
  );
};

export default ChainGraphEditor;

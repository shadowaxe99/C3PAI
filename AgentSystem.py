class AgentSystem:

    from amorphic_agent import AmorphicAgent

def __init__(self):
        self.agents = {}
        self.create_amorphic_agent()

def create_amorphic_agent(self):
        agent = AmorphicAgent()
        agent_id = id(agent)
        self.agents[agent_id] = agent
        return agent_id

    def start(self):
        print('Starting the agent system...')
        for agent in self.agents.values():
            agent.voice_interaction()
            agent.chat_interaction()
            agent.email_interaction()
            agent.text_interaction()

    def stop(self):
        print('Stopping the agent system...')

    def start(self):
        print('Starting the agent system...')
        for agent in self.agents.values():
            agent.voice_interaction()
            agent.chat_interaction()
            agent.email_interaction()
            agent.text_interaction()

    def stop(self):
        print('Stopping the agent system...')

    def get_agent_by_id(self, agent_id):
        if agent_id in self.agents:
            return self.agents[agent_id]
        else:
            print('Agent ID not found.')
            return None
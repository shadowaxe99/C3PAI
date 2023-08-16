from agentmemory-main import AgentMemory

class AIAgentSystemUI:
    def __init__(self):
        self.memory = AgentMemory()

    def store_memory(self, memory):
        self.memory.store_memory(memory)

    def retrieve_memory(self):
        return self.memory.retrieve_memory()

    def voice_interaction(self):
        self.agent.voice_interaction()

    def chat_interaction(self):
        self.agent.chat_interaction()

    def email_interaction(self):
        self.agent.email_interaction()

    def text_interaction(self):
        self.agent.text_interaction()
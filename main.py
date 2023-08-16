# pylint: disable=no-name-in-module
from PyQt5.QtWidgets import QApplication
from AgentSystem import AgentSystem
from AIAgentSystemUI import AIAgentSystemUI


"""Main entry point of the application."""

if __name__ == '__main__':
    app = QApplication([])

    agent_system = AgentSystem()
    ui = AIAgentSystemUI(agent_system.get_agent_by_id(0))

    ui.voice_interaction()
    ui.chat_interaction()
    ui.email_interaction()
    ui.text_interaction()

    app.exec_()

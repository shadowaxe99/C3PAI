from flask import Flask, jsonify, request
from agent_protocol import AgentProtocol

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/voice', methods=['POST'])
def process_voice_input():
    voice_input = request.json['input']
    agent_protocol = AgentProtocol()
    agent_protocol.process_voice_input(voice_input)
    response = agent_protocol.generate_response()
    return jsonify(response)

@app.route('/chat', methods=['POST'])
def process_chat_input():
    chat_input = request.json['input']
    agent_protocol = AgentProtocol()
    agent_protocol.process_chat_input(chat_input)
    response = agent_protocol.generate_response()
    return jsonify(response)

@app.route('/email', methods=['POST'])
def process_email_input():
    email_input = request.json['input']
    agent_protocol = AgentProtocol()
    agent_protocol.process_email_input(email_input)
    response = agent_protocol.generate_response()
    return jsonify(response)

@app.route('/text', methods=['POST'])
def process_text_input():
    text_input = request.json['input']
    agent_protocol = AgentProtocol()
    agent_protocol.process_text_input(text_input)
    response = agent_protocol.generate_response()
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
class CommunicationManager:
    def __init__(self):
        pass

    def send_message(self, channel, message):
        # Code to send message through specified channel
        if channel == 'voice':
            VoiceInterface().synthesize_speech(message)
        elif channel == 'chat':
            ChatInterface().send_chat(message)
        elif channel == 'email':
            EmailInterface().send_email(message)
        elif channel == 'text':
            TextInterface().send_text(message)

    def receive_message(self, channel):
        # Code to receive message from specified channel
        if channel == 'voice':
            return VoiceInterface().recognize_speech()
        elif channel == 'chat':
            return ChatInterface().process_chat()
        elif channel == 'email':
            return EmailInterface().process_email()
        elif channel == 'text':
            return TextInterface().process_text()
import requests


class GroupTextMessaging:
    def __init__(self):
        # Initialize the group text messaging module
        self.messaging_api_url = 'https://api.messaging.com'

    def send_message(self, message):
        # Send a message to the group
        response = requests.post(self.messaging_api_url + '/send', data={'message': message})
        return response.status_code

    def receive_message(self):
        # Receive a message from the group
        response = requests.get(self.messaging_api_url + '/receive')
        return response.json()
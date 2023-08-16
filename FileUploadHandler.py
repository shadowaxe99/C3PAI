import requests

class FileUploadHandler:
    def __init__(self):
        self.session = requests.Session()

    def upload(self, url, file_path):
        with open(file_path, 'rb') as f:
            return self.session.post(url, files={'file': f})
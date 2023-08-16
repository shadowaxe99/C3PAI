```python
from cryptography.fernet import Fernet
import os

class Security:
    def __init__(self):
        self.key = os.environ.get('SECRET_KEY')
        self.cipher_suite = Fernet(self.key)

    def encrypt_data(self, data):
        encoded_data = data.encode()
        encrypted_data = self.cipher_suite.encrypt(encoded_data)
        return encrypted_data

    def decrypt_data(self, encrypted_data):
        decrypted_data = self.cipher_suite.decrypt(encrypted_data)
        return decrypted_data.decode()

    def ensure_security(self, user_data):
        encrypted_data = self.encrypt_data(user_data)
        return encrypted_data

    def retrieve_data(self, encrypted_data):
        decrypted_data = self.decrypt_data(encrypted_data)
        return decrypted_data

security = Security()

def secure_user_data(user_data):
    encrypted_data = security.ensure_security(user_data)
    return encrypted_data

def retrieve_user_data(encrypted_data):
    decrypted_data = security.retrieve_data(encrypted_data)
    return decrypted_data
```
from web3 import Web3
from solcx import compile_source


class UserAgentNFT:

    def __init__(self, contract_address, private_key):
        self.web3 = Web3(Web3.HTTPProvider('http://localhost:8545'))
        self.contract_address = contract_address
        self.private_key = private_key

    def create_nft(self, token_uri):
        print('Creating a new NFT...')
        # TODO: Implement NFT creation logic

    def transfer_nft(self, to_address, token_id):
        print('Transferring an NFT...')
        # TODO: Implement NFT transfer logic

    def update_nft(self, token_id, token_uri):
        print('Updating an NFT...')
        # TODO: Implement NFT update logic
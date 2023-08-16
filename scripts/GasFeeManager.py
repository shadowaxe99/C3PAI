from web3 import Web3


class GasFeeManager:
    def __init__(self):
        # Initialize the gas fee manager
        self.web3 = Web3(Web3.HTTPProvider('http://localhost:8545'))

    def calculate_gas_fee(self, transaction):
        # Calculate the gas fee for a transaction
        gas_estimate = self.web3.eth.estimateGas(transaction)
        gas_price = self.web3.eth.gasPrice
        return gas_estimate * gas_price

    def optimize_transactions(self, transactions):
        # Optimize the transactions to minimize the total gas fee
        optimized_transactions = sorted(transactions, key=self.calculate_gas_fee)
        return optimized_transactions
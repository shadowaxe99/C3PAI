import sqlite3

# Create a connection to the database
conn = sqlite3.connect('database.db')

# Create a cursor object
cursor = conn.cursor()
from database import cursor, conn
from models import User

# Create table
create_table_query = '''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT
)'''
cursor.execute(create_table_query)

# Insert data
insert_data_query = '''
INSERT INTO users (name, email) VALUES (?, ?)'''
data = [('John Doe', 'john@example.com'), ('Jane Smith', 'jane@example.com')]
cursor.executemany(insert_data_query, data)

# Commit changes
conn.commit()

# Close connection
cursor.close()
conn.close()

print('Database initialized')
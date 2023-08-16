import dashdashstash

# Initialize DashDashStash client
client = dashdashstash.Client()

# Connect to DashDashStash server
client.connect()

# Define functions for interacting with DashDashStash

def create_task(task_name):
    # Create a new task in DashDashStash
    task_id = client.create_task(task_name)
    return task_id


def update_task(task_id, task_updates):
    # Update an existing task in DashDashStash
    client.update_task(task_id, task_updates)


def get_task(task_id):
    # Get details of a task from DashDashStash
    task_details = client.get_task(task_id)
    return task_details


def delete_task(task_id):
    # Delete a task from DashDashStash
    client.delete_task(task_id)


def list_tasks():
    # List all tasks in DashDashStash
    tasks = client.list_tasks()
    return tasks


# Close connection to DashDashStash server
client.disconnect()
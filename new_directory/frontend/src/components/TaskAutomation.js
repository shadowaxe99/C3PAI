```javascript
import React, { useState, useEffect } from 'react';

const TaskAutomation = () => {
    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        // Fetch the task list from the backend
        fetch('/api/tasks')
            .then(response => response.json())
            .then(data => setTaskList(data));
    }, []);

    const automateTask = (task) => {
        // Call the backend API to automate the task
        fetch('/api/automateTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })
        .then(response => response.json())
        .then(data => {
            // Update the task list after the task is automated
            setTaskList(prevTasks => prevTasks.map(t => t.id === data.id ? data : t));
        });
    };

    return (
        <div>
            <h2>Task Automation</h2>
            <ul>
                {taskList.map(task => (
                    <li key={task.id}>
                        <p>{task.description}</p>
                        <button onClick={() => automateTask(task)}>Automate Task</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskAutomation;
```
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskAssignment = () => {
    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get('/api/tasks');
        setTaskList(response.data);
    };

    const assignTask = async (task) => {
        const response = await axios.post('/api/tasks', task);
        if (response.status === 200) {
            fetchTasks();
        }
    };

    const handleTaskAssignment = (event) => {
        event.preventDefault();
        const task = {
            title: event.target.elements.taskTitle.value,
            description: event.target.elements.taskDescription.value,
            dueDate: event.target.elements.taskDueDate.value
        };
        assignTask(task);
    };

    return (
        <div id="taskAssignment">
            <h2>Task Assignment</h2>
            <form onSubmit={handleTaskAssignment}>
                <label>
                    Task Title:
                    <input type="text" name="taskTitle" required />
                </label>
                <label>
                    Task Description:
                    <input type="text" name="taskDescription" required />
                </label>
                <label>
                    Due Date:
                    <input type="date" name="taskDueDate" required />
                </label>
                <button type="submit">Assign Task</button>
            </form>
            <div id="taskListDisplay">
                <h3>Task List</h3>
                {taskList.map((task, index) => (
                    <div key={index}>
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskAssignment;
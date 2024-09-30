import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });

    // โหลดงานทั้งหมดจาก API
    useEffect(() => {
        axios.get('/api/tasks')
            .then(response => setTasks(response.data.data))
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);

    // สร้างงานใหม่
    const createTask = () => {
        axios.post('/api/tasks', newTask)
            .then(response => {
                setTasks([...tasks, response.data.data]);
                setNewTask({ title: '', description: '', dueDate: '' });
            })
            .catch(error => console.error('Error creating task:', error));
    };

    // อัพเดทสถานะงาน
    const updateTaskStatus = (id, newStatus) => {
        axios.put(`/api/tasks/${id}`, { status: newStatus })
            .then(response => {
                setTasks(tasks.map(task => task._id === id ? response.data.data : task));
            })
            .catch(error => console.error('Error updating task:', error));
    };

    // ลบงาน
    const deleteTask = (id) => {
        axios.delete(`/api/tasks/${id}`)
            .then(() => {
                setTasks(tasks.filter(task => task._id !== id));
            })
            .catch(error => console.error('Error deleting task:', error));
    };

    return (
        <div>
            <h1>Task Manager</h1>

            <h2>Create a New Task</h2>
            <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
                type="text"
                placeholder="Description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
                type="date"
                value={newTask.dueDate}
                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <button onClick={createTask}>Create Task</button>

            <h2>Task List</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task._id} style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        <button onClick={() => updateTaskStatus(task._id, task.status === 'done' ? 'not done' : 'done')}>
                            {task.status === 'done' ? 'Mark as Not Done' : 'Mark as Done'}
                        </button>
                        <button onClick={() => deleteTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
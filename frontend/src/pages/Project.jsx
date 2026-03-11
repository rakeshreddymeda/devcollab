import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import API from "../services/api";
import socket from "../socket/socket";

function Project() {
    const { id } = useParams();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    const fetchTasks = async () => {
        try {
            const res = await API.get(`/tasks/${id}`);
            setTasks(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        socket.on("taskCreated", (task) => {
            setTasks((prev) => [...prev, task]);
        });

        return () => {
            socket.off("taskCreated");
        };
    }, []);

    const createTask = async (e) => {
        e.preventDefault();

        try {
            await API.post("/tasks", {
                title,
                project:id
            });
            setTitle("");
        } catch (err) {
            alert("Task creation failed");
        }
    };

    const updateStatus = async (taskId, status) => {
        await API.put(`/tasks/${taskId}/status`, {
            status
        });

        fetchTasks();
    };

    const todo = tasks.filter((t) => t.status === "todo");
    const progress = tasks.filter((t) => t.status === "in-progress");
    const done = tasks.filter((t) => t.status === "done");

    return (
        <div style={{padding: "40px"}}>
            <h2>Task Board</h2>
            <form onSubmit={createTask}>
                <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)}  />
                <button type="submit">Add Task</button>
            </form>
            <br />
            <div style={{display: "flex", gap: "40px"}}>
                <div>
                    <h3>Todo</h3>
                    {
                        todo.map(task => (
                            <div key={task._id}>
                                <p>{task.title}</p>
                                <button onClick={() => updateStatus(task._id, "in-progress")}>Start</button>
                            </div>
                        ))
                    }
                </div>
                <div>
                    <h3>In Progress</h3>
                    {
                        progress.map(task => (
                            <div key={task._id}>
                                <p>{task.title}</p>
                                <button onClick={() => updateStatus(task._id, "done")}>Complete</button>
                            </div>
                        ))
                    }
                </div>
                <div>
                    <h3>Done</h3>
                    {
                        done.map(task => (
                            <div key={task._id}>
                                <p>{task.title}</p>
                            </div>
                        ))
                    }
                </div>
            </div>

            <h3>Project Tasks</h3>
            <ul>
                {
                    tasks.map((task) => (
                        <li key={task._id}>{task.title} - {task.status}</li>
                    ))
                }
            </ul>
        </div>
    );
}

export default Project;

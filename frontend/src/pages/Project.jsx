import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import API from "../services/api";
import socket from "../socket/socket";

function Project() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [projectMembers, setProjectMembers] = useState([]);
    const [comment, setComment] = useState("");

    const fetchTasks = async () => {
        try {
            const res = await API.get(`/tasks/${id}`);
            setTasks(res.data);
        } catch (err) {
            console.log(err.response.data.message || "Failed to fetch tasks");
        }
    };

    useEffect(() => {
        fetchTasks();
        displayProjectMembers();
    }, []);

    useEffect(() => {
        socket.on("taskCreated", (task) => {
            setTasks((prev) => [...prev, task]);
        });

        socket.on("taskDeleted", (taskId) => {
            setTasks((prev) => prev.filter(t => t._id !== taskId));
        });

        socket.on("taskUpdated", (updatedTask) => {
            setTasks((prev) => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        });

        return () => {
            socket.off("taskCreated");
            socket.off("taskDeleted");
            socket.off("taskUpdated");
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
            alert(err.response.data.message || "Task creation failed");
        }
    };

    const updateStatus = async (taskId, status) => {
        await API.put(`/tasks/${taskId}/status`, {
            status
        });

        fetchTasks();
    };

    const deleteTask = async (id) => {
        await API.delete(`/tasks/${id}`);
        fetchTasks();
    }

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const taskId = result.draggableId;
        const newStatus = result.destination.droppableId;

        await API.put(`/tasks/${taskId}/status`, {
            status: newStatus
        });

        fetchTasks();
    }

    const addMember = async (e) => {
        e.preventDefault();

        try {
            await API.put(`/projects/${id}/add-member`, { email });
            setEmail("");
            displayProjectMembers();
        } catch (err) {
            alert(err.response.data.message || "Failed to add member");
        }
    }

    const displayProjectMembers = async () => {
        try {
            const projectMembers = await API.get(`/projects/${id}/members`);
            setProjectMembers(projectMembers.data);
        } catch (err) {
            alert(err.response.data.message || "Failed to fetch project members");
        }
    }

    const deleteMember = async (memberId) => {
        try {
            await API.delete(`/projects/${id}/delete-member/${memberId}`);
            displayProjectMembers();
        } catch (err) {
            alert(err.response.data.message || "Failed to delete member");

        }
    }

    const todo = tasks.filter((t) => t.status === "todo");
    const progress = tasks.filter((t) => t.status === "in-progress");
    const done = tasks.filter((t) => t.status === "done");

    return (
        <div style={{padding: "40px"}}>
            <div style={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
                <div>
                    <h1>Task Board</h1>
                    <form onSubmit={createTask}>
                        <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)}  />
                        <button type="submit">Add Task</button>
                    </form>
                </div>
                <div>
                    <h2>Add Member to Project</h2>
                    <form onSubmit={addMember}>
                        <input type="email" value={email} placeholder="Add User by Email" onChange={(e) => setEmail(e.target.value)} />
                        <button type="submit">Add Member</button>
                    </form>
                </div>
                <button onClick={() => navigate("/dashboard")}>Back</button>
            </div>
            <br />
            
            <h2>Drag And Drop to change the task status</h2>
            
            <DragDropContext onDragEnd={handleDragEnd}>

                    <div style={{ display: "flex", gap: "20px" }}>

                        {["todo", "in-progress", "done"].map((status) => (

                            <Droppable droppableId={status} key={status}>
                                {(provided) => (
                                    <div className="bg-gray-100 p-4 rounded w-64" ref={provided.innerRef} {...provided.droppableProps} style={{ width: "250px", minHeight: "300px", border: "1px solid gray", padding: "10px"
                            }}>
                                <h3 className="font-semibold mb-3 capitalize">{status}</h3>
                                {tasks.filter((t) => t.status === status).map((task, index) => (
                                    <Draggable key={task._id} draggableId={task._id} index={index}>
                                        {(provided) => (
                                            <div className="bg-white shadow-sm p-3 rounded mb-3 hover:shadow-md transition" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{padding: "10px", margin: "10px 0", background: "#eee", ...provided.draggableProps.style
                                    }}>
                                        <p className="font-medium text-black">{task.title}</p>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                </div>
                            )}
                            </Droppable>
                        ))}
                    </div>
            </DragDropContext>

            <div>
                <h2>Project Members</h2>
                    <ul>
                        {
                            projectMembers.map(member => (
                                <div key={member._id}>
                                    <p>{member.name} - {member.email}</p>
                                    <button onClick={() => deleteMember(member._id)}>Delete Member</button>
                                </div>
                            ))
                        }
                    </ul>
                </div>        
            <div style={{display: "flex", gap: "40px"}}>
                <div>
                    <h3>Todo</h3>
                    {
                        todo.map(task => (
                            <div key={task._id}>
                                <p>{task.title}</p>
                                <button onClick={() => updateStatus(task._id, "in-progress")}>Start</button>
                                <button onClick={() => deleteTask(task._id)}>Delete</button>
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
                                <button onClick={() => deleteTask(task._id)}>Delete</button>
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
                                <button onClick={() => deleteTask(task._id)}>Delete</button>
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

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import API from "../services/api";

function Project() {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);

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

    return (
        <div style={{padding: "40px"}}>
            <h2>Project Tasks</h2>
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

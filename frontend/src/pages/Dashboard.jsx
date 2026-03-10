import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();

    try {
      await API.post("/projects", {
        title,
        description
      });

      setTitle("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      alert("Project creation failed");
    }
  };

  return (
    <div style={{padding: "40px"}}>
      <h1>Dashboard</h1>
      <h3>Create Project</h3>
      <form onSubmit={createProject}>
        <input type="text" placeholder="Project title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <br /> <br />
        <input type="text" placeholder="Descripton" value={description} onChange={(e) => setDescription(e.target.value)} />
        <br /> <br />
        <button type="submit">Create Project</button>
      </form>
      <hr />
      <h3>Your Projects</h3>
      <ul>
        {
          projects.map((project) => (
            <li key={project._id}>{project.title}</li>
          ))
        }
      </ul>
    </div>
  );
}

export default Dashboard;

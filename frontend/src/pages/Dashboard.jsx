import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import API from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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
      alert(err.response.data.message || "Project creation failed");
    }
  };

  const deleteProject = async (id) => {
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert(err.response.data.message || "Project deletion failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <h3>Create Project</h3>
      <form onSubmit={createProject} className="space-y-3">
        <input className="border p-2 w-full rounded" type="text" placeholder="Project title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <br /> <br />
        <input className="border p-2 w-full rounded" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <br /> <br />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition" type="submit">Create Project</button>
      </form>
      <hr className="my-6" />
      <h3>Your Projects</h3>
      
      {loading ? <p>Loading...</p> : (
        <ul className="space-y-2">
          {
            projects.map((project) => (
              <li key={project._id} className="p-3 border rounded hover:bg-gray-100 max-w-50px">
                <Link to={`/project/${project._id}`}>
                  {project.title}
                </Link>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onClick={() => deleteProject(project._id)} style={{margin: "10px"}}>Delete Project</button>
              </li>
            ))
          }
        </ul>
      )}
      <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;

import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import API from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/login", { email, password });
            login(res.data.token);
            navigate(from, { replace: true } || "/dashboard");
        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <div style={{padding: "40px"}}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <br />
                <div>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;

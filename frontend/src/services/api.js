import axios from "axios";

const API = axios.create({
    baseURL: "https://devcollab-2iq3.onrender.com/api"
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Automatically logs out user if token expires → production-level behavior.
API.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default API;

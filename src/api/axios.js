import axios from "axios";

// Create Axios instance
const instance = axios.create({
  baseURL: "http://localhost:8002/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;

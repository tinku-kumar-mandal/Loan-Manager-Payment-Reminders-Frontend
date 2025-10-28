import axios from "axios";


const API = axios.create({
  // baseURL: 'http://localhost:8080/api',
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;

import axios from "axios";

const api = axios.create({
  baseURL: "https://sets-hrms.onrender.com",
});

export default api;
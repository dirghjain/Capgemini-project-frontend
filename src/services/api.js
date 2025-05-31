import axios from "axios";
const API = axios.create({ baseURL: "https://dirgh-gddbfme2efhqabe4.centralindia-01.azurewebsites.net/api" });

API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});



export default API;

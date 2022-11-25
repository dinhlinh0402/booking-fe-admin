import axios from "axios";

const token = localStorage.getItem("accessToken");

const requestClient = axios.create({
  baseURL: "http://14.225.255.59:8000/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default requestClient;
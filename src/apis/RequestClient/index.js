import axios from "axios";

const token = localStorage.getItem("accessToken");
// const requestClient = axios.create({
//   baseURL: "http://14.225.255.59:8000/",
//   // baseURL: "http://localhost:8000/",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   },
// });

const requestClient = () => axios.create({
  // baseURL: "http://14.225.255.59:8000/",
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});
export default requestClient;
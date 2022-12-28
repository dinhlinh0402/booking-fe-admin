import axios from "axios";
import requestClient from "../RequestClient";

const AuthApis = {
  login(data) {
    const urlParam = 'auth/login';
    return requestClient.post(urlParam, data);
  },

  authMe() {
    const urlParam = 'auth/me';
    // console.log('authme');
    const instance = axios.create({
      baseURL: "http://14.225.255.59:8000/",
      // baseURL: "http://localhost:8000/",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    return instance.get(urlParam);
  },

  resetPassViaEmail(data) {
    const urlParam = 'auth/reset-password-via-mail';
    return requestClient.post(urlParam, data);
  }
};

export default AuthApis;
import requestClient from "../RequestClient";

const AuthApis = {
  login(data) {
    const urlParam = 'auth/login';
    return requestClient.post(urlParam, data);
  },

  authMe() {
    const urlParam = 'auth/me';
    return requestClient.get(urlParam);
  }
};


export default AuthApis;

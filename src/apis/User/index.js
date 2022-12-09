import requestClient from "../RequestClient";

const UserApis = {
  getListUser(params) {
    const urlParam = 'user';

    return requestClient.get(urlParam, { params });
  },

  deleteUser(data) {
    const urlParam = 'user';
    // console.log('data: ', data);
    return requestClient.delete(urlParam, { data: data }); //method delete
  },

  changeStatus(data) {
    const urlParam = 'user/change-status';
    return requestClient.put(urlParam, data);
  }
};


export default UserApis;

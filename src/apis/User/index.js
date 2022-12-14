import requestClient from "../RequestClient";

const UserApis = {
  getListUser(params) {
    const urlParam = 'user';

    return requestClient().get(urlParam, { params });
  },

  deleteUser(data) {
    const urlParam = 'user';
    // console.log('data: ', data);
    return requestClient().delete(urlParam, { data: data }); //method delete
  },

  changeStatus(data) {
    const urlParam = 'user/change-status';
    return requestClient().put(urlParam, data);
  },

  getUserById(params) {
    const urlParam = `user/${params}`;
    return requestClient().get(urlParam);
  },

  changeAvatar(data) {
    const urlParam = `user/change-avatar`;
    return requestClient().post(urlParam, data);
  },

  updateUser(data, userId) {
    const urlParam = `user/${userId}`;
    return requestClient().put(urlParam, data);
  },
};

export default UserApis;
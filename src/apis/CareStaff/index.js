import requestClient from "../RequestClient";

const CareStaffApis = {
  getCareStaff(params) {
    const urlParam = 'user';

    return requestClient.get(urlParam, { params });
  },

  createCareStaff(data) {
    const urlParam = 'user';
    return requestClient.post(urlParam, data)
  },

  updateCareStaff(data, userId) {
    const urlParam = `user/${userId}`;
    return requestClient.put(urlParam, data);
  }
};


export default CareStaffApis;

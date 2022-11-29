import requestClient from "../RequestClient";

const DoctorApis = {
  getListDoctor(params) {
    const urlParam = 'user';

    return requestClient.get(urlParam, { params });
  },

  createDoctor(data) {
    const urlParam = 'user';
    return requestClient.post(urlParam, data)
  }
};


export default DoctorApis;

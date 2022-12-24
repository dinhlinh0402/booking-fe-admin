import requestClient from "../RequestClient";

const DoctorApis = {
  getListDoctor(params) {
    const urlParam = 'user';

    return requestClient.get(urlParam, { params });
  },

  createDoctor(data) {
    const urlParam = 'user';
    return requestClient.post(urlParam, data)
  },

  // doctor-infor
  getDoctorInfoExtra(doctorInforId) {
    const urlParam = `doctor-infor/${doctorInforId}`;
    return requestClient.get(urlParam);
  },

  createDoctorInfor(data) {
    const urlParam = 'doctor-infor';
    return requestClient.post(urlParam, data);
  },

  updateDoctor(data, doctorId) {
    const urlParam = `user/${doctorId}`;
    return requestClient.put(urlParam, data);
  },

  updateDoctorInfoExtra(data, doctorInforId) {
    const ulrParam = `doctor-infor/${doctorInforId}`;
    return requestClient.put(ulrParam, data);
  }
}


export default DoctorApis;

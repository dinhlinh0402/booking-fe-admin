import requestClient from "../RequestClient";

const ClinicApis = {
  getClinics(params) {
    const urlParam = 'clinic';

    return requestClient.get(urlParam, { params });
  },

  deleteClinic(data) {
    const urlParam = 'clinic';
    return requestClient.delete(urlParam, { data: data });
  },

  changeActive(data) {
    const urlParam = 'clinic/change-active';
    return requestClient.put(urlParam, data)
  }
};


export default ClinicApis;

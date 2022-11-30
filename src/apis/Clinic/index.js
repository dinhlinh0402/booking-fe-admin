import requestClient from "../RequestClient";

const ClinicApis = {
  getClinics(params) {
    const urlParam = 'clinic';

    return requestClient.get(urlParam, { params });
  },

  // createCareStaff(data) {
  //   const urlParam = 'user';
  //   return requestClient.post(urlParam, data)
  // }
};


export default ClinicApis;

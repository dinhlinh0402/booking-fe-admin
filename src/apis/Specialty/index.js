import requestClient from "../RequestClient";

const SpecialtyApis = {
  getSpecialtyByClinic(clinicId) {
    const urlParam = `specialty/specialty-clinic/${clinicId}`;

    return requestClient.get(urlParam);
  },

  // createCareStaff(data) {
  //   const urlParam = 'user';
  //   return requestClient.post(urlParam, data)
  // }
};


export default SpecialtyApis;

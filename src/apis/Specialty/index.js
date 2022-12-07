import requestClient from "../RequestClient";

const SpecialtyApis = {
  getSpecialtyByClinic(clinicId) {
    const urlParam = `specialty/specialty-clinic/${clinicId}`;

    return requestClient.get(urlParam);
  },

  getListSpecialty(params) {
    const urlParam = `specialty`;

    return requestClient.get(urlParam, { params: params });
  },

  createSpecialty(data) {
    const urlParam = 'specialty';
    return requestClient.post(urlParam, data);
  }

  // createCareStaff(data) {
  //   const urlParam = 'user';
  //   return requestClient.post(urlParam, data)
  // }
};


export default SpecialtyApis;

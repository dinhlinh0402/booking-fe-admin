import requestClient from "../RequestClient";

const SpecialtyApis = {
  getSpecialtyByClinic(clinicId) {
    const urlParam = `specialty/specialty-clinic/${clinicId}`;

    return requestClient().get(urlParam);
  },

  getListSpecialty(params) {
    const urlParam = `specialty`;

    return requestClient().get(urlParam, { params: params });
  },

  createSpecialty(data) {
    const urlParam = 'specialty';
    return requestClient().post(urlParam, data);
  },

  deleteSpecialty(data) {
    const urlParam = 'specialty';
    return requestClient().delete(urlParam, { data })
  },

  updateSpecialty(specialtyId, data) {
    const urlParam = `specialty/${specialtyId}`;
    return requestClient().put(urlParam, data);
  }
};


export default SpecialtyApis;

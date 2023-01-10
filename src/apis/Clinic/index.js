import requestClient from "../RequestClient";

const ClinicApis = {
  getClinics(params) {
    const urlParam = 'clinic';

    return requestClient().get(urlParam, { params });
  },

  deleteClinic(data) {
    const urlParam = 'clinic';
    return requestClient().delete(urlParam, { data: data });
  },

  changeActive(data) {
    const urlParam = 'clinic/change-active';
    return requestClient().put(urlParam, data)
  },

  createClinic(data) {
    const urlParam = 'clinic';
    return requestClient().post(urlParam, data);
  },

  getClinicById(clinicId) {
    const urlParam = `clinic/${clinicId}`;
    return requestClient().get(urlParam);
  },

  updateClinic(data, clinicId) {
    const urlParam = `clinic/${clinicId}`;
    return requestClient().put(urlParam, data);
  },

  createClinicIntroduct(data) {
    const urlParam = 'clinic-infor';
    return requestClient().post(urlParam, data);
  },

  updateClinicIntroduct(clinicInforId, data) {
    const urlParam = `clinic-infor/${clinicInforId}`;
    return requestClient().put(urlParam, data);

  }
};


export default ClinicApis;

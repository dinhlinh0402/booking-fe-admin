import requestClient from "../RequestClient";

const CustomerApis = {
  getCustomer(params) {
    const urlParam = 'user';

    return requestClient.get(urlParam, { params });
  },

  createCustomer(data) {
    const urlParam = 'user';
    return requestClient.post(urlParam, data)
  }
};


export default CustomerApis;

import requestClient from "../RequestClient";

const HistoryApis = {
  createHistoryBooking(data) {
    const urlParam = 'history';
    return requestClient().post(urlParam, data);
  }

}

export default HistoryApis;
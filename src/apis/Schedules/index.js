import requestClient from "../RequestClient";

const ScheduleApis = {
  getListSchedule(params) {
    const urlParam = 'schedules';

    return requestClient.get(urlParam, { params });
  },

  createSchdules(data) {
    const urlParam = 'schedules';
    return requestClient.post(urlParam, data)
  },
};


export default ScheduleApis;
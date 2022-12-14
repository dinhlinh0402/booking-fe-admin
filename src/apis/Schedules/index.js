import requestClient from "../RequestClient";

const ScheduleApis = {
  getListSchedule(params) {
    const urlParam = 'schedules';

    return requestClient.get(urlParam, { params });
  },
};


export default ScheduleApis;
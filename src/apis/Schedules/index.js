import requestClient from "../RequestClient";

const ScheduleApis = {
  getListSchedule(params) {
    const urlParam = 'schedules';

    return requestClient().get(urlParam, { params });
  },

  createSchdules(data) {
    const urlParam = 'schedules';
    return requestClient().post(urlParam, data)
  },

  deleteManySchedule(data) {
    const urlParam = 'schedules/many-schedule';
    return requestClient().delete(urlParam, { data: data });
  },
};


export default ScheduleApis;
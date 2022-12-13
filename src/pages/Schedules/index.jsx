import moment from 'moment';
import React, { useEffect, useState } from 'react';

const time = [
  {
    timeStart: '08:00:00',
    timeEnd: '08:30:00'
  },
  {
    timeStart: '08:30:00',
    timeEnd: '09:00:00'
  },
  {
    timeStart: '08:00:00',
    timeEnd: '08:30:00'
  },
  {
    timeStart: '08:00:00',
    timeEnd: '08:30:00'
  },
  {
    timeStart: '08:00:00',
    timeEnd: '08:30:00'
  },
  {
    timeStart: '08:00:00',
    timeEnd: '08:30:00'
  }

]

const timeStartDay = '2022-12-14T08:00:00';
const timeEndDay = '2022-12-14T18:00:00';

const Schedules = () => {

  const [listSchedule, setListSchedule] = useState([]);

  useEffect(() => {
    console.log(timeStartDay > timeEndDay);
    const listTime = [];
    let timeStartDayClone = timeStartDay
    while (timeStartDayClone < timeEndDay) {
      console.log('timeStartDayClone: ', timeStartDayClone);
      const time = {
        timeStart: timeStartDayClone,
        timeEnd: moment(timeStartDayClone).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
      }
      timeStartDayClone = moment(timeStartDayClone).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
      listTime.push(time);
    }
    setListSchedule(listTime);
  }, [])
  console.log('listSchedule: ', listSchedule);
  // console.log(moment(timeStartDay).add(30, 'minutes').format('DD-MM-YYYY HH:mm'));

  return (
    <div>
      <h1>Quản lý lịch khám</h1>
    </div>
  )
}

export default Schedules;
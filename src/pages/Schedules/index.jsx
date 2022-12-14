import { Button, DatePicker, Space } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import ScheduleApis from '../../apis/Schedules';
import './index.scss';
import CreateSchedule from './components/CreateSchedule';

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
const dateNow = new Date();

const Schedules = () => {

  const [selectDate, setSelectDate] = useState(moment(dateNow).add(1, 'day').format('YYYY-MM-DDT08:00:00'));
  const [listSchedule, setListSchedule] = useState([]);
  const [isModalCreate, setModalCreate] = useState(true);

  useEffect(() => {
    getSchedules();
  }, [selectDate])

  const getSchedules = async () => {
    try {
      const dataRes = await ScheduleApis.getListSchedule({
        page: 1,
        take: 100,
        doctorId: '29290bf5-13c4-4a55-b9a7-cd7377242ca3',
        date: selectDate,
      })
      console.log('dataRes: ', dataRes);
      if (dataRes?.data?.data) {
        const { data } = dataRes?.data;
        const listScheduleMap = data.map(item => {
          return {
            timeStart: item.timeStart ? moment(item?.timeStart).format('YYYY-MM-DDTHH:mm:ss') : '',
            timeEnd: item.timeEnd ? moment(item?.timeEnd).format('YYYY-MM-DDTHH:mm:ss') : '',
            checked: true,
          }
        })
        setListSchedule(listScheduleMap || []);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }

  useEffect(() => {
    console.log(timeStartDay > timeEndDay);
    const listTime = [];
    let timeStartDayClone = timeStartDay
    while (timeStartDayClone < timeEndDay) {
      // console.log('timeStartDayClone: ', timeStartDayClone);
      const time = {
        timeStart: timeStartDayClone,
        timeEnd: moment(timeStartDayClone).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
      }
      timeStartDayClone = moment(timeStartDayClone).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
      listTime.push(time);
    }
    // setListSchedule(listTime);
  }, [])
  // console.log('listSchedule: ', listSchedule);
  // console.log(moment(timeStartDay).add(30, 'minutes').format('DD-MM-YYYY HH:mm'));

  const onChange = (date, stringDate) => {
    // console.log('date: ', date);
    // console.log('stringDate: ', stringDate);
    setSelectDate(moment(date).format('YYYY-MM-DDTHH:mm:ss'));
  };

  const handleCheckedSchedule = (schedule) => {
    // const {timeStart, timeEnd, checked} = schedule;
    const listScheduleClone = listSchedule;
    const listScheduleNew = listScheduleClone.map(item => {
      if (moment(item.timeStart).isSame(schedule.timeStart) && moment(item.timeStart).isSame(schedule.timeStart)) {
        return {
          ...item,
          checked: schedule.checked ? false : true,
        }
      }
      return item;
    })
    setListSchedule(listScheduleNew);
  }

  return (
    <div>
      <h1>Quản lý lịch khám</h1>

      <div className='header_schedule'>
        <DatePicker
          className='date_picker'
          picker="date"
          defaultValue={moment(selectDate, 'YYYY-MM-DD')}
          format={'DD/MM/YYYY'}
          showNow={true}
          showTime={false}
          style={{
            borderRadius: '0px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
          showToday={false}
          disabledDate={(current) => moment() >= current}
          onChange={onChange}
        />

        <div className='list_button'>
          <Button
            className='button'
            size="large"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setModalCreate(true)}
          >
            Thêm kế hoạch khám
          </Button>
        </div>
      </div>

      <div className='list_schedule'>
        <div className="title_list_schedule">
          Danh sách giờ khám
        </div>
        {listSchedule && listSchedule.length ? (
          <Space>
            {listSchedule.map((item, idx) => (
              <Button
                key={item.timeStart}
                type={item.checked ? 'primary' : ''}
                className={item.checked ? '' : 'button_origin'}
                onClick={() => handleCheckedSchedule(item)}
              >
                {moment(item.timeStart).format('HH:mm')} - {moment(item.timeEnd).format('HH:mm')}
              </Button>
            ))}
          </Space>
        ) : null}


      </div>

      {/* <CreateSchedule
        isShowModal={isModalCreate}
        handleCancelModal={() => setModalCreate(false)}
      /> */}
      <CreateSchedule
        isShowModal={isModalCreate}
        handleCancelModal={() => setModalCreate(false)}
      />
    </div>
  )
}

export default Schedules;
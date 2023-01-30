import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

// import Table from '../components/table/Table'

// import Badge from '../components/badge/Badge'

// import statusCards from '../assets/JsonData/status-card-data.json'
import StatusCard from '../../../components/status-card/StatusCard'
import { useState } from 'react';
import './index.scss';
import { Spin } from 'antd';
import CustomerApis from '../../../apis/Customer';
import ClinicApis from '../../../apis/Clinic';
import BookingApis from '../../../apis/Bookings';
import moment from 'moment';

const DashboardAdmin = () => {

  const [countCustomer, setCountCustomer] = useState(0);
  const [countClinic, setCountClinic] = useState(0);
  const [countDoctor, setCountDoctor] = useState(0);
  const [countAppointentDone, setCountAppointentDone] = useState(0);
  const [countAppointentToday, setCountAppointentToday] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDataCustomer();
    getDataClinic();
    getDataDoctor();
    getDataBookingDone();
    getDataBookingToday();
  }, [])

  const getDataCustomer = async () => {
    setLoading(true);
    try {
      const dataRes = await CustomerApis.getCustomer({
        page: 1,
        take: 100,
        role: 'USER',
      });
      if (dataRes?.data?.data.length) {
        setCountCustomer(dataRes?.data?.meta?.itemCount || 0);
      }
      setLoading(false);
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  const getDataClinic = async () => {
    try {
      setLoading(true);
      const dataRes = await ClinicApis.getClinics({
        page: 1,
        take: 100,
      })
      if (dataRes?.data?.data) {
        setCountClinic(dataRes?.data?.meta?.itemCount || 0);
      }
      setLoading(false);
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  const getDataDoctor = async () => {
    setLoading(true);
    try {
      const dataRes = await CustomerApis.getCustomer({
        page: 1,
        take: 100,
        role: ['DOCTOR', 'HEAD_OF_DOCTOR'],
      });
      if (dataRes?.data?.data.length) {
        setCountDoctor(dataRes?.data?.meta?.itemCount || 0);
      }
      setLoading(false);
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  const getDataBookingDone = async () => {
    try {
      setLoading(true);
      const dataBooking = await BookingApis.getBookings({
        status: ['DONE'],
      });

      if (dataBooking.status === 200 && dataBooking?.data?.data.length) {
        setCountAppointentDone(dataBooking?.data?.meta?.itemCount || 0);
      }
      setLoading(false);

    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  const getDataBookingToday = async () => {
    try {
      setLoading(true);
      const dataBooking = await BookingApis.getBookings({
        date: moment(new Date).format('YYYY-MM-DDT00:00:00'),
        status: ['CONFIRMED', 'DONE'],
      });

      console.log('dataBooking: ', dataBooking);
      if (dataBooking.status === 200 && dataBooking?.data?.data.length) {
        setCountAppointentToday(dataBooking?.data?.meta?.itemCount || 0);
      }
      setLoading(false);

    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  const themeReducer = useSelector(state => state.ThemeReducer.mode)
  return (
    <>
      {loading ? (
        <div className="spin">
          <Spin />
        </div>
      ) : (
        <div>
          <h2 className="page-header">Dashboard</h2>
          {/* <div className="row"> */}
          {/* <div className="col-6"> */}
          <div className="row">
            <div className="col-4">
              <StatusCard
                icon={'bx bx-user-pin'}
                count={countCustomer || 0}
                title={'Số lượng khách hàng'}
              />
            </div>
            <div className="col-4">
              <StatusCard
                icon={'bx bx-clinic'}
                count={countClinic || 0}
                title={'Số lượng phòng khám'}
              />
            </div>

            <div className="col-4">
              <StatusCard
                icon={'bx bx-user'}
                count={countDoctor || 0}
                title={'Số lượng bác sĩ'}
              />
            </div>

            <div className="col-4">
              <StatusCard
                icon={'bx bx-notepad'}
                count={countAppointentDone}
                title={'Lịch hẹn đã hoàn thành'}
              />
            </div>

            <div className="col-4">
              <StatusCard
                icon={'bx bx-notepad'}
                count={countAppointentToday}
                title={'Lịch hẹn hôm nay'}
              />
            </div>
          </div>
          {/* </div> */}
          {/* </div> */}
        </div>
      )}
    </>

  )
}

export default DashboardAdmin
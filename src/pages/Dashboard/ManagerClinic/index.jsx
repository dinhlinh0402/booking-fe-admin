import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

// import Table from '../components/table/Table'

// import Badge from '../components/badge/Badge'

// import statusCards from '../assets/JsonData/status-card-data.json'
import StatusCard from '../../../components/status-card/StatusCard'
import { useState } from 'react';
import { Spin } from 'antd';
import CustomerApis from '../../../apis/Customer';
import ClinicApis from '../../../apis/Clinic';
import BookingApis from '../../../apis/Bookings';
import moment from 'moment';

const DashboardManager = () => {

  // const [countCustomer, setCountCustomer] = useState(0);
  // const [countClinic, setCountClinic] = useState(0);
  const [countDoctor, setCountDoctor] = useState(0);
  const [countAppointentDone, setCountAppointentDone] = useState(0);
  const [countAppointentNotConf, setCountAppointentNotConf] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userLocal, setUserLocal] = useState(null);

  useEffect(() => {
    document.title = 'Dashboard';
    const userLocalStorage = JSON.parse(localStorage.getItem('user'));
    if (userLocalStorage) {
      setUserLocal(userLocalStorage);

    }
  }, []);

  useEffect(() => {
    if (userLocal) {
      getDataDoctor();
      getDataBooking();
    }
  }, [userLocal]);

  const getDataDoctor = async () => {
    setLoading(true);
    try {
      const dataRes = await CustomerApis.getCustomer({
        page: 1,
        take: 100,
        clinicId: userLocal?.clinic?.id,
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

  const getDataBooking = async () => {
    try {
      setLoading(true);
      const dataBooking = await BookingApis.getBookingByClinic({
        clinicId: userLocal?.clinic?.id || undefined,
      });

      if (dataBooking.data) {
        setCountAppointentNotConf(dataBooking?.data?.waiting?.totalWaiting);
        setCountAppointentDone(dataBooking?.data?.done?.totalDone);
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
            {/* <div className="col-3">
                        <StatusCard
                            icon={'bx bx-user-pin'}
                            count={countCustomer || 0}
                            title={'Số lượng khách hàng'}
                        />
                    </div> */}
            {/* <div className="col-3">
                      <StatusCard
                        icon={'bx bx-clinic'}
                        count={countClinic || 0}
                        title={'Số lượng phòng khám'}
                      />
                    </div> */}

            <div className="col-4">
              <StatusCard
                icon={'bx bx-user'}
                count={countDoctor || 0}
                title={'Số lượng bác sĩ '}
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
                count={countAppointentNotConf}
                title={'Lịch hẹn chưa xác nhận'}
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

export default DashboardManager;
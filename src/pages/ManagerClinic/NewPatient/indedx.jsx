import { Spin, Tabs } from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import BookingApis from "../../../apis/Bookings";
import TableCancel from "./components/TableCancel";
import TableConfirmed from "./components/TableConfirmed";
import TableDone from "./components/TableDone";
import TableNewPatient from "./components/TableNewPatient";

const NewPatient = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataNewPatient, setNewPatient] = useState(null);
  const [dataConfirmed, setDataConfirmed] = useState(null);
  const [dataCancel, setDataCancel] = useState(null);
  const [dataDone, setDataDone] = useState(null);
  useEffect(() => {
    document.title = 'Quản lý bệnh nhân';
    const userLocal = JSON.parse(localStorage.getItem('user'));
    if (userLocal) {
      setUser(userLocal);
    }
  }, []);

  useEffect(() => {
    if (user)
      getListBooking();
  }, [user])

  const getListBooking = async () => {
    try {
      setLoading(true);
      const dataBooking = await BookingApis.getBookingByClinic({
        clinicId: user?.clinic?.id || undefined,
      });
      // console.log('dataBooking: ', dataBooking);
      if (dataBooking.data) {
        setNewPatient(dataBooking?.data?.waiting || null);
        setDataConfirmed(dataBooking?.data?.confirmed || null);
        setDataCancel(dataBooking?.data?.cancel || null);
        setDataDone(dataBooking?.data?.done || null);
        setLoading(false);
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Quản lý bệnh nhân đặt lịch</h1>

      <div className="tab_list_patient">

        {loading ? (
          <div className="spin">
            <Spin />
          </div>) : (
          <Tabs
            defaultActiveKey="new_patient"
            type="card"
            size='middle'
          >
            <Tabs.TabPane tab={`Bệnh nhân mới (${dataNewPatient?.totalWaiting || 0})`} key="new_patient">
              <TableNewPatient
                dataNewPatient={dataNewPatient}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={`Đã xác nhận (${dataConfirmed?.totalConfirmed || 0})`} key="confirmed">
              <TableConfirmed
                dataConfirmed={dataConfirmed}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={`Đã hủy (${dataCancel?.totalCancel || 0})`} key="cancel">
              <TableCancel
                dataCancel={dataCancel}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={`Đã khám xong (${dataDone?.totalDone || 0})`} key="done">
              <TableDone
                dataDone={dataDone}
              />
            </Tabs.TabPane>
          </Tabs>
        )}


      </div>
    </div>
  )
}

export default NewPatient;
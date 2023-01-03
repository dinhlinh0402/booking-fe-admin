import { Spin, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import ClinicApis from "../../../apis/Clinic";
import BackIcon from "../../../components/Icon/Common/BackIcon";
import TabClinicInformation from "../../Clinic/components/DetailClinic/TabClinicInformation";
import TabClinicIntroduce from "../../Clinic/components/DetailClinic/TabClinicIntroduce";

const ClinicForManagerClinic = () => {
  const [clinicId, setClinicId] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataClinic, setDataClinic] = useState({});

  useEffect(() => {
    document.title = 'Thông tin phòng khám';
    const userLocal = JSON.parse(localStorage.getItem('user'))
    const getClinicId = userLocal?.clinic?.id;
    if (getClinicId) {
      setClinicId(getClinicId);
      getClinic(getClinicId);
    }
  }, []);

  const getClinic = async (dataClinicId) => {
    setLoading(true);
    try {
      const dataResClinic = await ClinicApis.getClinicById(dataClinicId);
      if (dataResClinic?.status === 200) {
        setDataClinic(dataResClinic?.data || {});
        setLoading(false)
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }

  return (
    <>
      {loading ? (
        <div className="spin">
          <Spin />
        </div>

      ) : (
        <>
          <Tabs defaultActiveKey='table_doctor'>
            <Tabs.TabPane tab="Thông tin phòng khám" key="clinic_information">
              <TabClinicInformation dataClinic={dataClinic || {}} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Giới thiệu về phòng khám" key="clinic_introduce">
              <TabClinicIntroduce
                dataClinicIntroduce={dataClinic?.clinicInfor || {}}
                clinicId={clinicId}
              />
            </Tabs.TabPane>
          </Tabs>
        </>
      )}
    </>
  )
}

export default ClinicForManagerClinic;
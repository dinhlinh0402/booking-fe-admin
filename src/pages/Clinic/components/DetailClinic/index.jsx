import { Space, Spin, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClinicApis from '../../../../apis/Clinic';
import BackIcon from '../../../../components/Icon/Common/BackIcon';
import TableDoctor from './TableDoctor';

import './index.scss';
import TabClinicInformation from './TabClinicInformation';
import TabClinicIntroduce from './TabClinicIntroduce';


const DetailClinic = () => {
  const [loading, setLoading] = useState(false);
  const [dataClinic, setDataClinic] = useState({});

  let { clinicId } = useParams();

  console.log('clinicId: ', clinicId);

  useEffect(() => {
    document.title = 'Thông tin phòng khám';
  }, []);

  useEffect(() => {
    if (clinicId)
      getClinic(clinicId);
  }, [clinicId])

  const getClinic = async (clinicId) => {
    setLoading(true);
    try {
      const dataResClinic = await ClinicApis.getClinicById(clinicId);
      if (dataResClinic?.status === 200) {
        setDataClinic(dataResClinic?.data || {});
        setLoading(false)
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }

  const handleBack = () => {
    // const partName = location.pathname.split('/').slice(0, 3).join('/');
    // console.log('partName: ', partName);
    // history.push(partName);
    window.history.back();
  }

  return (
    <>
      {loading ? (
        <div className="spin">
          <Spin />
        </div>

      ) : (
        <>
          <div className='header_detail_clinic'>
            <Space>
              <BackIcon
                onClick={handleBack}
                style={{
                  cursor: 'pointer',
                  height: '100%'
                }}
              />
              <span className='name_clinic'>
                {dataClinic.name || ''}
              </span>
            </Space>
          </div>

          <Tabs>
            <Tabs.TabPane tab="Danh sách bác sĩ" key="table_doctor">
              <TableDoctor clinicId={clinicId} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Thông tin phòng khám" key="clinic_information">
              <TabClinicInformation />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Giới thiệu về phòng khám" key="clinic_introduce">
              <TabClinicIntroduce />
            </Tabs.TabPane>
          </Tabs>
        </>
      )}
    </>
  );
}

export default DetailClinic;
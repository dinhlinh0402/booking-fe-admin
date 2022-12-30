import { Tabs } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import DoctorApis from "../../../apis/Doctor";
import TabInformation from "./TabInformation";
import TabIntroduce from "./TabIntroduce";

const InformationDoctor = ({ dataUser, handleReset }) => {
  // const [user, setUser] = useState({});

  //sau sẽ lấy user từ parent
  //Lấy tạm từ doctor để làm
  // useEffect(() => {
  //   getDoctor();
  // },[])
  // const getDoctor = async() => {
  //   try {
  //     const dataRes = await DoctorApis.getDoctorById(dataUser.id);
  //     if(dataRes.data) {
  //       setUser(dataRes.data);
  //     }
  //   } catch (error) {
  //     console.log('error: ', error);
  //   }
  // }

  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab="Thông tin cá nhân" key="information">
          <TabInformation dataUser={dataUser} handleReset={handleReset} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Giới thiệu" key="introduce" disabled={dataUser.role === 'MANAGER_CLINIC'}>
          <TabIntroduce dataUser={dataUser} handleReset={handleReset} />
        </Tabs.TabPane>
      </Tabs>
    </div>

  )
}

export default InformationDoctor;
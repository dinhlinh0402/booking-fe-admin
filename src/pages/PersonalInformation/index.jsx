import React, { useEffect, useState } from "react";
import UserApis from "../../apis/User";
import './index.scss';
import InformationAdmin from './components/InformationAdmin';
import InformationDoctor from "./components/InformationDoctor";

const PersonalInformation = () => {
  const [user, setUser] = useState(null);
  const [reset, setReset] = useState(0);
  const [infoUser, setInfoUser] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Thông tin cá nhân';
    const userLocal = JSON.parse(localStorage.getItem('user'));
    if (userLocal) {
      setUser(userLocal);
    } else setUser(null);
  }, []);

  useEffect(() => {
    if (user) {
      getInfoUser();
    }
  }, [user, reset]);

  const getInfoUser = async () => {
    try {
      const dataUser = await UserApis.getUserById(user.id);
      if (dataUser?.status === 200 && dataUser.data) {
        setInfoUser(dataUser.data);
      } else setInfoUser(null);
    } catch (error) {
      console.log('error: ', error);
      setInfoUser(null);
    }
  }

  return (
    <div className="personal-information">
      <div className="personal-information-title">
        Thông tin tài khoản
      </div>
      <div className="personal-information-content">
        {user && user.role === 'ADMIN' ? (
          <InformationAdmin dataUser={infoUser} handleReset={() => setReset(prev => ++prev)} />
        ) : (user && (['DOCTOR', 'MANAGER_CLINIC', 'HEAD_OF_DOCTOR'].includes(user?.role)) ? (
          <InformationDoctor dataUser={infoUser} handleReset={() => setReset(prev => ++prev)} />
        ) : null)}
      </div>
    </div>
  )
}

export default PersonalInformation;
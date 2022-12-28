import React, { useEffect, useState } from "react";

const PersonalInformation = () => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    document.title = 'Thông tin cá nhân';
    const userLocal = JSON.parse(localStorage.getItem('user'));
    if(userLocal) {
      setUser(userLocal);
    } else setUser(null);
  }, [])

  console.log('user: ', user);
  return (
    <div>PersonalInformation</div>
  )
}

export default PersonalInformation;
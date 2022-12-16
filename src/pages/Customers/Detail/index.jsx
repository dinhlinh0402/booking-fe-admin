import { LeftOutlined } from '@ant-design/icons';
import React from 'react';
import { useEffect } from 'react';
import { useLocation, useParams, useHistory } from "react-router-dom";
import './index.scss';

const DetailCustomer = () => {
  const history = useHistory();
  let location = useLocation();
  console.log('location: ', location);

  let { customerId } = useParams();
  console.log('id: ', customerId);
  const handleBack = () => {
    const partName = location.pathname.split('/').slice(0, 3).join('/');
    console.log('partName: ', partName);
    history.push(partName);
  }
  return (
    <div className='header_detail_customer'>
      <LeftOutlined
        onClick={handleBack}
      />
      <span className='name_customer'>Ten</span>
    </div>
  )
}

export default DetailCustomer;
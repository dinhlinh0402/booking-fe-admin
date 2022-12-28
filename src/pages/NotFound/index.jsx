import { Result, Space, Typography } from 'antd';
import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

const NotFoundPage = () => {
  let history = useHistory();
  useEffect(() => {
    document.title = 'Not Found'
  }, [])
  return (
  <Result
    status='404'
    title='404'
    subTitle='Xin lỗi, trang bạn đã truy cập không tồn tại.'
    extra={
      <Space onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
        <ArrowLeftOutlined style={{ color: '#3863EF' }} />
        <Typography.Title level={5} style={{ margin: 0, color: '#3863EF' }}>
          Trở lại
        </Typography.Title>
      </Space>
    }
  />
)}

export default NotFoundPage;

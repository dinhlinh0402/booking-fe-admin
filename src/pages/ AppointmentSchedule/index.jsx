import React, { useState } from "react";
import { Button, DatePicker, Space, Table } from "antd";
import moment from "moment";
import './index.scss';
import { FormOutlined, MailOutlined } from "@ant-design/icons";

const dateNow = new Date();

const AppointmentSchedule = () => {
  const [selectDate, setSelectDate] = useState(moment(dateNow).format('YYYY-MM-DDT08:00:00'));
  const [isLoading, setLoading] = useState(false);
  const [dataResponse, setDataResponse] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [data, setData] = useState([{
    id: '1',
    time: '10:00 - 10:30',
    name: 'Pham Van Nam',
    gender: 'MALE',
    birthday: '2000-01-27T00:00:00',
    phoneNumber: '0336174200',
  }])

  const onChange = (date, stringDate) => {
    console.log('date: ', date);
    console.log('stringDate: ', stringDate);
    setSelectDate(moment(date).format('YYYY-MM-DDTHH:mm:ss'));
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      width: 50,      
    },
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 40,
      render: (value) => (
        <div>{value === 'FEMALE' ? 'Nữ' : value === 'MALE' ? 'Nam' : 'Khác' || ''}</div>
      )
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      width: 65,
      render: (value) => (
        <div>{value ? moment(value).format('DD/MM/YYYY') : ''}</div>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 75
    },
    {
      title: 'Hành động',
      // dataIndex: 'phoneNumber',
      key: 'action',
      width: 75,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            className="btn_detail"
            icon={<FormOutlined />}
            >Chi tiết</Button>
          <Button 
            className="btn_send" 
            type="primary"
            icon={<MailOutlined />}
          
          >Gửi đơn thuốc</Button>
        </Space>
      )
    }
  ];

  return (
    <div> 
      <h1 className="title">
        Danh sách lịch hẹn
      </h1>
      <div className="header_appointment">
        <DatePicker
          className='date_picker'
          picker="date"
          defaultValue={moment(selectDate, 'YYYY-MM-DD')}
          format={'DD/MM/YYYY'}
          showNow={true}
          showTime={false}
          style={{
            borderRadius: '0px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
          showToday={false}
          // disabledDate={(current) => moment() <= current}
          onChange={onChange}
        />
      </div>
        
      <Table
        loading={isLoading}
        rowKey={'id'}
        dataSource={data}
        columns={columns}
        pagination={{
          current: dataResponse?.meta?.page || 1, // so trang
          total: dataResponse?.meta?.itemCount || 10, // tong tat ca 
          defaultPageSize: dataResponse?.meta?.take || 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          locale: { items_per_page: ' kết quả/trang' },
          onChange: (page, pageSize) => {
            setPagination({
              ...pagination,
              page,
              pageSize,
            });
          },
        }}
      // scroll={{ x: 'max-content' }}
      />

    </div>
  )
}

export default AppointmentSchedule;
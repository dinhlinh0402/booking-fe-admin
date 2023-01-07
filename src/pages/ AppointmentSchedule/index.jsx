import React, { useState } from "react";
import { Button, DatePicker, Space, Table } from "antd";
import moment from "moment";
import './index.scss';
import { FormOutlined, MailOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import BookingApis from '../../apis/Bookings';
import DetailPatient from "./compoments/DetailPatient";

const dateNow = new Date();

const AppointmentSchedule = () => {
  const [selectDate, setSelectDate] = useState(moment(dateNow).format('YYYY-MM-DDT00:00:00'));

  const [loading, setLoading] = useState(false);
  const [dataResponse, setDataResponse] = useState({});
  // const [pagination, setPagination] = useState({
  //   page: 1,
  //   pageSize: 100,
  // });
  const currentDate = moment(dateNow).format('YYYY-MM-DDT00:00:00');
  const [dataPatient, setDataPatient] = useState([])
  const [doctor, setDoctor] = useState(null);
  const [detailPatient, setDetailPatient] = useState(null); // {}
  const [showModalDetail, setModalDetail] = useState(false);

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem('user'));
    if (userLocal) {
      setDoctor(userLocal);
    }
  }, [])

  useEffect(() => {
    if (selectDate && doctor)
      getBooking();
  }, [selectDate, doctor])

  const getBooking = async () => {
    try {
      setLoading(true);
      const dataBooking = await BookingApis.getBookings({
        date: selectDate || undefined,
        doctorId: doctor?.id || undefined,
        status: ['CONFIRMED', 'DONE'],
      });

      // console.log('dataBooking: ', dataBooking);
      if (dataBooking.status === 200 && dataBooking?.data?.data.length) {
        const { data } = dataBooking?.data;
        const mapDataPatient = data.map(item => {
          const name = `${item?.patient.firstName ? item?.patient.firstName : ''} ${item?.patient?.middleName ? item?.patient?.middleName : ''} ${item?.patient?.lastName ? item?.patient?.lastName : ''}`.trim();
          return {
            idBooking: item.id,
            timeStart: item?.schedule.timeStart,
            timeEnd: item?.schedule.timeEnd,
            time: `${moment(item?.schedule?.timeStart).format('HH:mm')} - ${moment(item?.schedule?.timeEnd).format('HH:mm')}`,
            name: name,
            gender: item?.patient?.gender || '',
            birthday: item?.patient?.birthday || null,
            phoneNumber: item?.patient?.phoneNumber || '',
            status: item?.status || '',
            bookingDate: item.createdDate,
            reason: item?.reason || '',
            email: item?.patient.email || '',
            address: item?.patient?.address || '',
            doctorNote: item?.patient.userNote || '',
          }
        })
        setDataPatient(mapDataPatient || []);
      }
      setLoading(false);

    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

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
      width: 70,
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
      width: 50,
      render: (value) => (
        <div>{value ? moment(value).format('DD/MM/YYYY') : ''}</div>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 55
    },
    {
      title: 'Hành động',
      // dataIndex: 'phoneNumber',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="btn_detail"
            icon={<FormOutlined />}
            style={{
              minWidth: '30px'
            }}
            onClick={() => {
              setDetailPatient(record);
              setModalDetail(true);
            }}
          >Chi tiết</Button>
          <Button
            disabled={!moment('2014-03-24T01:15:00.000Z').isSame(moment('2014-03-24T01:14:00.000Z'))}
            className="btn_send"
            style={{
              minWidth: '50px'
            }}
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
        loading={loading}
        rowKey={'id'}
        dataSource={dataPatient}
        columns={columns}
      // pagination={{
      //   current: dataResponse?.meta?.page || 1, // so trang
      //   total: dataResponse?.meta?.itemCount || 10, // tong tat ca 
      //   defaultPageSize: dataResponse?.meta?.take || 10,
      //   showSizeChanger: true,
      //   pageSizeOptions: ['10', '20', '50', '100'],
      //   locale: { items_per_page: ' kết quả/trang' },
      //   onChange: (page, pageSize) => {
      //     setPagination({
      //       ...pagination,
      //       page,
      //       pageSize,
      //     });
      //   },
      // }}
      // scroll={{ x: 'max-content' }}
      />

      <DetailPatient
        detailPatient={detailPatient}
        showModal={showModalDetail}
        handleCancelModal={() => setModalDetail(false)}
        disabledBtnSave={!moment('2014-03-24T01:15:00.000Z').isSame(moment('2014-03-24T01:14:00.000Z'))}
      />

    </div>
  )
}

export default AppointmentSchedule;
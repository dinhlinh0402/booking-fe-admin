import { FormOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BookingApis from "../../../../apis/Bookings";
import DetailPatient from "./DetailPatientBooking/DetailPatient";

const TableConfirmed = ({
  dataConfirmed,
  handleReset,
}) => {
  const [dataPatient, setDataPatient] = useState([]);
  const [detailPatient, setDetailPatient] = useState(null); // {}
  const [showModalDetail, setModalDetail] = useState(false);
  const [showModalChangeStatus, setShowModalChangeStatus] = useState(false);
  const [dataChange, setDataChange] = useState(null);

  useEffect(() => {
    if (dataConfirmed) {
      const listBooking = dataConfirmed?.dataConfirmed.map(item => {
        let namePatient = '';
        let phoneNumber = '';
        let gender = '';
        let birthday = null;
        if (item.type === 'FOR_MYSELF') {
          namePatient = `${item?.patient.firstName ? item?.patient.firstName : ''} ${item?.patient?.middleName ? item?.patient?.middleName : ''} ${item?.patient?.lastName ? item?.patient?.lastName : ''}`.trim();
          phoneNumber = item?.patient?.phoneNumber || '';
          gender = item?.patient?.gender || '';
          birthday = item?.patient?.birthday || null;
        } else {
          namePatient = item?.bookingRelatives?.name || '';
          phoneNumber = item?.bookingRelatives?.phone || '';
          gender = item?.bookingRelatives?.gender;
          birthday = item?.bookingRelatives?.birthday || null;
        }
        const nameDoctor = `${item?.doctor.firstName ? item?.doctor.firstName : ''} ${item?.doctor?.middleName ? item?.doctor?.middleName : ''} ${item?.doctor?.lastName ? item?.doctor?.lastName : ''}`.trim();
        return {
          idBooking: item.id,
          timeStart: item?.schedule.timeStart,
          timeEnd: item?.schedule.timeEnd,
          time: `${moment(item?.schedule?.timeStart).format('HH:mm')} - ${moment(item?.schedule?.timeEnd).format('HH:mm')}`,
          namePatient: namePatient,
          nameDoctor: nameDoctor,
          gender: gender,
          birthday: birthday,
          phoneNumber: phoneNumber,
          status: item?.status || '',
          bookingDate: item.createdDate,
          reason: item?.reason || '',
          email: item?.patient.email || '',
          address: item?.patient?.address || '',
          doctorNote: item?.patient.userNote || '',
          patientId: item?.patient?.id,
          date: moment(item.date).format('DD/MM/YYYY'),
        }
      })
      setDataPatient(listBooking || []);
    }
  }, [dataConfirmed])

  const handleChangeStatus = async () => {
    const { status, bookingId } = dataChange;
    const listStatus = ['CANCEL', 'CONFIRMED'];
    if (!dataChange || !listStatus.includes(status)) {
      toast.error('Thay đổi trạng thái không thành công!');
      return;
    }
    try {
      const dataUpdate = await BookingApis.updateBooking({
        status: status
      }, bookingId);
      if (dataUpdate.status === 200 && dataUpdate.data === true) {
        toast.success('Thay đổi trạng thái thành công');
      }
      handleReset();
      setDataChange(null);
      setShowModalChangeStatus(false);
    } catch (error) {
      console.log('error: ', error);
      toast.error('Thay đổi trạng thái không thành công!');
      setDataChange(null);
    }
  }

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      width: 50,
    },
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      key: 'date',
      width: 50,
    },
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'namePatient',
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
      title: 'Tên bác sĩ',
      dataIndex: 'nameDoctor',
      key: 'nameDoctor',
      ellipsis: true,
      width: 55
    },
    {
      title: 'Hành động',
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
          {/* <Button
            // disabled={!moment('2014-03-24T01:15:00.000Z').isSame(moment('2014-03-24T01:14:00.000Z'))}
            className="btn"
            style={{
              minWidth: '50px'
            }}
            type="primary"
            // icon={< />}
          >Xác nhận</Button> */}
          <Button
            // disabled={!moment('2014-03-24T01:15:00.000Z').isSame(moment('2014-03-24T01:14:00.000Z'))}
            className="btn"
            style={{
              minWidth: '50px'
            }}
            type="primary"
            danger
            onClick={() => {
              setShowModalChangeStatus(true);
              setDataChange({ status: 'CANCEL', bookingId: record.idBooking })
            }}
          >Hủy</Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Table
        // loading={loading}
        rowKey={'idBooking'}
        dataSource={dataPatient}
        columns={columns}
      />

      <DetailPatient
        detailPatient={detailPatient}
        showModal={showModalDetail}
        handleCancelModal={() => setModalDetail(false)}
        // disabledBtnSave={!moment(currentDate).isBefore(moment(selectDate))}
        type='confirmed'
      />

      <Modal
        open={showModalChangeStatus}
        onOk={handleChangeStatus}
        onCancel={() => {
          setDataChange(null);
          setShowModalChangeStatus(false);
        }}
        cancelText={'Hủy'}
        okText={'Xác nhận'}
        className='confirm_delete_label'
        width={370}
      >
        <h2 style={{ color: '#595959', fontWeight: 700, textAlign: 'center' }}>
          Bạn có muốn hủy lịch hẹn không?
        </h2>
      </Modal>
    </div>
  )
}

export default TableConfirmed;
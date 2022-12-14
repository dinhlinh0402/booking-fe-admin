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
        const namePatient = `${item?.patient.firstName ? item?.patient.firstName : ''} ${item?.patient?.middleName ? item?.patient?.middleName : ''} ${item?.patient?.lastName ? item?.patient?.lastName : ''}`.trim();
        const nameDoctor = `${item?.doctor.firstName ? item?.doctor.firstName : ''} ${item?.doctor?.middleName ? item?.doctor?.middleName : ''} ${item?.doctor?.lastName ? item?.doctor?.lastName : ''}`.trim();
        return {
          idBooking: item.id,
          timeStart: item?.schedule.timeStart,
          timeEnd: item?.schedule.timeEnd,
          time: `${moment(item?.schedule?.timeStart).format('HH:mm')} - ${moment(item?.schedule?.timeEnd).format('HH:mm')}`,
          namePatient: namePatient,
          nameDoctor: nameDoctor,
          gender: item?.patient?.gender || '',
          birthday: item?.patient?.birthday || null,
          phoneNumber: item?.patient?.phoneNumber || '',
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
      toast.error('Thay ?????i tr???ng th??i kh??ng th??nh c??ng!');
      return;
    }
    try {
      const dataUpdate = await BookingApis.updateBooking({
        status: status
      }, bookingId);
      if (dataUpdate.status === 200 && dataUpdate.data === true) {
        toast.success('Thay ?????i tr???ng th??i th??nh c??ng');
      }
      handleReset();
      setDataChange(null);
      setShowModalChangeStatus(false);
    } catch (error) {
      console.log('error: ', error);
      toast.error('Thay ?????i tr???ng th??i kh??ng th??nh c??ng!');
      setDataChange(null);
    }
  }

  const columns = [
    {
      title: 'Th???i gian',
      dataIndex: 'time',
      key: 'time',
      width: 50,
    },
    {
      title: 'Ng??y kh??m',
      dataIndex: 'date',
      key: 'date',
      width: 50,
    },
    {
      title: 'T??n b???nh nh??n',
      dataIndex: 'namePatient',
      key: 'name',
      width: 70,
      ellipsis: true,
    },
    {
      title: 'Gi???i t??nh',
      dataIndex: 'gender',
      key: 'gender',
      width: 40,
      render: (value) => (
        <div>{value === 'FEMALE' ? 'N???' : value === 'MALE' ? 'Nam' : 'Kh??c' || ''}</div>
      )
    },
    {
      title: 'Ng??y sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      width: 50,
      render: (value) => (
        <div>{value ? moment(value).format('DD/MM/YYYY') : ''}</div>
      )
    },
    {
      title: 'S??? ??i???n tho???i',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 55
    },
    {
      title: 'T??n b??c s??',
      dataIndex: 'nameDoctor',
      key: 'nameDoctor',
      ellipsis: true,
      width: 55
    },
    {
      title: 'H??nh ?????ng',
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
          >Chi ti???t</Button>
          {/* <Button
            // disabled={!moment('2014-03-24T01:15:00.000Z').isSame(moment('2014-03-24T01:14:00.000Z'))}
            className="btn"
            style={{
              minWidth: '50px'
            }}
            type="primary"
            // icon={< />}
          >X??c nh???n</Button> */}
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
          >H???y</Button>
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
        cancelText={'H???y'}
        okText={'X??c nh???n'}
        className='confirm_delete_label'
        width={370}
      >
        <h2 style={{ color: '#595959', fontWeight: 700, textAlign: 'center' }}>
          B???n c?? mu???n h???y l???ch h???n kh??ng?
        </h2>
      </Modal>
    </div>
  )
}

export default TableConfirmed;
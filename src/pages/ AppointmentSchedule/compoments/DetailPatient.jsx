import { Button, Col, DatePicker, Divider, Form, Input, Modal, Row, Select, Spin, Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import BookingApis from "../../../apis/Bookings";
import baseURL from "../../../utils/url";
import './DetailPatient.scss';

const { TextArea } = Input;

const DetailPatient = ({
  detailPatient,
  showModal,
  handleCancelModal,
  disabledBtnSave
}) => {
  const [loading, setLoading] = useState(false);
  const [dataHistoryPatient, setDataHistoryPatient] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    if (detailPatient) {
      form.setFieldsValue({
        name: detailPatient.name,
        email: detailPatient.email,
        reason: detailPatient.reason,
        userNote: detailPatient.userNote,
      });

      getHistoryPatient();
    }
  }, [detailPatient]);

  const getHistoryPatient = async () => {
    try {
      setLoading(true);
      const dataHistory = await BookingApis.getBookings({
        patientId: detailPatient?.patientId,
        status: ['DONE'],
      });
      if (dataHistory?.data?.data.length) {
        const { data } = dataHistory?.data;
        const listHistory = data.map(item => {
          const nameDoctor = `${item?.doctor.firstName ? item?.doctor.firstName : ''} ${item?.doctor?.middleName ? item?.doctor?.middleName : ''} ${item?.doctor?.lastName ? item?.doctor?.lastName : ''}`.trim();
          return {
            id: item.id,
            timeStart: item?.schedule.timeStart,
            timeEnd: item?.schedule.timeEnd,
            time: `${moment(item?.schedule?.timeStart).format('HH:mm')} - ${moment(item?.schedule?.timeEnd).format('HH:mm')} ${moment(item?.schedule?.timeEnd).format('DD/MM/YYYY')}`,
            nameDoctor: nameDoctor,
            date: moment(item.date).format('DD/MM/YYYY'),
            reason: item?.reason || '',
            userNote: item?.userNote || '',
            prescription: item?.history?.prescription ? `${baseURL}${item?.history?.prescription}` : '',
            doctorNote: item?.history?.doctorNote || '',
          }
        })
        setDataHistoryPatient(listHistory);
      }
      setLoading(false);
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
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
      title: 'Tên bác sĩ',
      dataIndex: 'nameDoctor',
      key: 'nameDoctor',
      ellipsis: true,
      width: 55
    },
    {
      title: 'Lý do khám',
      dataIndex: 'reason',
      key: 'reason',
      // ellipsis: true,
      width: 55
    },
    {
      title: 'Đơn thuốc',
      dataIndex: 'prescription',
      key: 'prescription',
      ellipsis: true,
      width: 55,
      render: (value) => (
        <>
          {value ? (
            <a download href={value}>
              <div style={{
                color: '#1890ff'
              }}>Xem đơn thuốc</div>
            </a>
          ) : ''}
        </>
      )
    },
  ];


  const handleSubmit = async (values) => {
    try {
      const { note, ...res } = values;
      const dataRes = await BookingApis.updateBooking({ userNote: note }, detailPatient.idBooking);
      console.log('dataRes: ', dataRes);
      // thêm ghi chú 
    } catch (error) {
      console.log('error: ', error);
      toast.error('Thêm ghi chú không thành công!');
    }
  }

  return (
    <Modal
      className='detail_modal'
      title={
        <>
          <div>Chi tiết</div>
        </>
      }
      open={showModal}
      onCancel={() => {
        if (!loading) {
          handleCancelModal();
          form.resetFields()
        }
      }}
      width={700}
      height={500}
      footer={false}
    >
      <Spin spinning={loading}>
        <div style={{ height: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
          <Form
            name='patient'
            onFinish={(values) => handleSubmit(values)}
            autoComplete='off'
            layout='vertical'
            form={form}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name={'name'}
                  label={<span className='txt_label'>Tên bệnh nhân</span>}
                >
                  <Input
                    disabled
                    size='middle'
                    className='txt_input'
                    placeholder={'Tên bệnh nhân'} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={'email'}
                  label={<span className='txt_label'>Email</span>}
                >
                  <Input
                    disabled
                    size='middle'
                    className='txt_input'
                    placeholder={'Email'} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name={'reason'}
                  label={<span className='txt_label'>Lý do khám</span>}
                >
                  <TextArea
                    disabled
                    rows={4}
                    placeholder='Lý do'
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name={'userNote'}
                  label={<span className='txt_label'>Ghi chú</span>}
                >
                  <TextArea
                    disabled
                    rows={4}
                    placeholder={detailPatient?.doctorNote ? 'Ghi chú' : 'Không có thông tin'}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button className='btn_cancel' danger size='middle' onClick={() => handleCancelModal()}>
                Hủy
              </Button>

              {/* <Button disabled={disabledBtnSave} className='btn_add' size='middle' htmlType='submit' type='primary'>
                Lưu
              </Button> */}

            </Col>
          </Form>
          <div className="history">
            <Divider>Lịch sử khám</Divider>
            <Table
              loading={loading}
              rowKey={'id'}
              dataSource={dataHistoryPatient}
              columns={columns}
            />
          </div>
        </div>
      </Spin>
    </Modal>
  )
}

export default DetailPatient;
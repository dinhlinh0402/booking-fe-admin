import { Button, Col, DatePicker, Divider, Form, Input, Modal, Row, Select, Spin, Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import BookingApis from "../../../apis/Bookings";
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
        note: detailPatient.doctorNote,
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
            time: `${moment(item?.schedule?.timeStart).format('HH:mm')} - ${moment(item?.schedule?.timeEnd).format('HH:mm')}`,
            nameDoctor: nameDoctor,
            date: moment(item.date).format('DD/MM/YYYY'),
            reason: item?.reason || '',
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
      title: 'Th???i gian',
      dataIndex: 'time',
      key: 'time',
      width: 50,
    },
    {
      title: 'Ng??y kh??m',
      dataIndex: 'time',
      key: 'time',
      width: 50,
    },
    {
      title: 'T??n b??c s??',
      dataIndex: 'nameDoctor',
      key: 'nameDoctor',
      ellipsis: true,
      width: 55
    },
    {
      title: 'L?? do kh??m',
      dataIndex: 'reason',
      key: 'reason',
      // ellipsis: true,
      width: 55
    }
  ];


  const handleSubmit = async (values) => {
    console.log('value: ', values);

    try {
      const { note, ...res } = values;
      const dataRes = await BookingApis.updateBooking({ userNote: note }, detailPatient.idBooking);
      console.log('dataRes: ', dataRes);

    } catch (error) {
      console.log('error: ', error);
      toast.error('Th??m ghi ch?? kh??ng th??nh c??ng!');
    }
  }

  return (
    <Modal
      className='detail_modal'
      title={
        <>
          <div>Chi ti???t</div>
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
                  label={<span className='txt_label'>T??n b???nh nh??n</span>}
                >
                  <Input
                    disabled
                    size='middle'
                    className='txt_input'
                    placeholder={'T??n b???nh nh??n'} />
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
                  label={<span className='txt_label'>L?? do kh??m</span>}
                >
                  <TextArea
                    disabled
                    rows={4}
                    placeholder='L?? do'
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name={'note'}
                  label={<span className='txt_label'>Ghi ch??</span>}
                >
                  <TextArea
                    disabled
                    rows={4}
                    placeholder={detailPatient?.doctorNote ? 'Ghi ch??' : 'Kh??ng c?? th??ng tin'}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button className='btn_cancel' danger size='middle' onClick={() => handleCancelModal()}>
                H???y
              </Button>

              {/* <Button disabled={disabledBtnSave} className='btn_add' size='middle' htmlType='submit' type='primary'>
                L??u
              </Button> */}

            </Col>
          </Form>
          <div className="history">
            <Divider>L???ch s??? kh??m</Divider>
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
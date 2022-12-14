import { Button, Col, DatePicker, Form, Input, Modal, Spin, Row, Select, InputNumber } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import './CreateSchedule.scss';
import { toast } from 'react-toastify';

const { Option } = Select;
const dateNow = new Date();

const listTime = [
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
]

const CreateSchedule = ({
  isShowModal,
  handleCancelModal, // function cancel
}) => {
  const [selectDate, setSelectDate] = useState(moment(dateNow).add(1, 'day').format('YYYY-MM-DDT08:00:00'));
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();


  // const getListClinic = async () => {
  //   try {
  //     const dataRes = await ClinicApis.getClinics({
  //       pages: 1,
  //       take: 100,
  //     })
  //     // console.log('dataRes: ', dataRes);
  //     if (dataRes?.data?.data) {
  //       const { data } = dataRes?.data;
  //       const listOptionsClinic = data.map(item => {
  //         return {
  //           id: item.id,
  //           name: item?.name || '',
  //         }
  //       })
  //       setOptionsClinic(listOptionsClinic || []);
  //     }
  //   } catch (error) {
  //     console.log('error: ', error);
  //   }
  // }
  // const handleAddNewDoctor = async (value) => {
  //   console.log('value: ', value);
  //   try {
  //     setLoading(true)
  //     const dataRes = await DoctorApis.createDoctor({
  //       ...value,
  //     })
  //     // 
  //     if (dataRes.status === 200) {
  //       setLoading(false);
  //       toast.success('Thêm bác thành công');
  //       handleCancelModal();
  //       form.setFieldsValue({
  //         firstName: '',
  //         middleName: '',
  //         lastName: '',
  //         email: '',
  //         gender: undefined,
  //         role: undefined,
  //         clinicId: undefined,
  //         specialtyId: undefined
  //       })
  //     }
  //   } catch (error) {
  //     console.log('error: ', error);
  //     setLoading(false);
  //     if (error.response.data.error === 'USER_ALREADY_EXIST' && error.response.data.status === 409) {
  //       toast.error('Bác sĩ đã tồn tại!');
  //     }
  //     // toast.error('Lỗi');
  //   }
  // }

  const onChange = (date, stringDate) => {
    // console.log('date: ', date);
    // console.log('stringDate: ', stringDate);
    setSelectDate(moment(date).format('YYYY-MM-DDTHH:mm:ss'));
  };

  return (
    <Modal
      className='create_modal'
      title={
        <>
          <div>Thêm kế hoạch khám bệnh</div>
        </>
      }
      visible={isShowModal}
      onCancel={() => {
        !loading && handleCancelModal()
      }}
      width={600}
      footer={false}
    >
      <Spin spinning={loading}>
        <Form
          name='user'
          // onFinish={(values) => handleAddNewDoctor(values)}
          autoComplete='off'
          layout='vertical'
          form={form}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name={'date'}
                label={<span className='txt__label'>Ngày khám</span>}
                rules={[
                  {
                    required: true,
                    message: 'Ngày khám không được để trống',
                  }
                ]}
              >
                <DatePicker
                  picker='date'
                  showNow={false}
                  placeholder={true ? 'Chọn ngày khám' : 'Không có thông tin'}
                  size={'middle'}
                  defaultValue={moment(selectDate, 'YYYY-MM-DD')}
                  format={'DD/MM/YYYY'}
                  style={{
                    width: '100%',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  className='txt_input'
                  showToday={false}
                  disabledDate={(current) => moment() >= current}
                  onChange={onChange}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={'count'}
                label={<span className='txt__label'>Số bệnh nhân</span>}
                rules={[
                  {
                    required: true,
                    message: 'Số lượng bệnh nhân không được để trống',
                  },
                ]}
              >
                <InputNumber
                  // style={{ width: '100%' }}
                  min={1} max={10} defaultValue={1} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name={'timeStart'}
                label={<span className='txt_label'>Bắt đầu</span>}
                rules={[
                  {
                    required: true,
                    message: 'Giờ bắt đầu không được để trống',
                  },
                ]}
              >
                <Select
                  style={{ width: '100%' }}
                  size='middle'
                  placeholder={true ? 'Chọn giờ bắt đầu' : 'Không có thông tin'}
                  className='txt_input'
                  defaultValue={listTime[0]}
                >
                  {listTime.map((item, index) => (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name={'timeEnd'}
                label={<span className='txt_label'>Kết thúc</span>}
                rules={[
                  {
                    required: true,
                    message: 'Giờ kết thúc không được để trống',
                  },
                ]}
              >
                <Select
                  style={{ width: '100%' }}
                  size='middle'
                  placeholder={true ? 'Chọn giờ kết thúc' : 'Không có thông tin'}
                  className='txt_input'
                  defaultValue={listTime[1]}
                >
                  {listTime.map((item, index) => (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                style={{
                  marginTop: '29px'
                }}
              >+</Button>
            </Col>


          </Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button className='btn_cancel' danger size='middle' onClick={() => handleCancelModal()}>
              Hủy
            </Button>
            <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
              Thêm kế hoạch
            </Button>
          </Col>
        </Form>
      </Spin>
    </Modal >
  )
}

export default CreateSchedule;
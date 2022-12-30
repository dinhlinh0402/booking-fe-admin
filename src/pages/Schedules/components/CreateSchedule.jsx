import { Button, Col, DatePicker, Form, Input, Modal, Spin, Row, Select, InputNumber } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import './CreateSchedule.scss';
import { toast } from 'react-toastify';
import { DeleteOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ScheduleApis from '../../../apis/Schedules';

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
  doctor,
  handleCancelModal, // function cancel
}) => {
  const [selectDate, setSelectDate] = useState(moment(dateNow).add(1, 'day').format('YYYY-MM-DDT08:00:00'));
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      date: moment(selectDate)
    })
  }, [])

  const onChange = (date, stringDate) => {
    // console.log('date: ', date);
    // console.log('stringDate: ', stringDate);
    setSelectDate(moment(date).format('YYYY-MM-DDTHH:mm:ss'));
  };

  const handleAddNewSchedule = async (values) => {
    console.log('value: ', values);
    setLoading(true);
    try {
      let times = values.times && values.times.length > 0 ? [values.time, ...values.times] : [values.time];
      times = times.map(item => {
        return {
          ...item,
          timeStart: moment(selectDate).format(`YYYY-MM-DDT${item.timeStart}:00`),
          timeEnd: moment(selectDate).format(`YYYY-MM-DDT${item.timeEnd}:00`),
        }
      })
      console.log('times: ', times);
      const newData = {
        date: moment(values.date).format('YYYY-MM-DDTHH:mm:ss'),
        maxCount: 2,
        doctorId: doctor.id,
        times: times,
      }

      const dataRes = await ScheduleApis.createSchdules(newData);
      console.log('dataRes: ', dataRes);
      if (dataRes?.status === 200) {
        toast.success('Tạo kế hoạch khám thành công');
        handleCancelModal();
        setLoading(false);
        // form.setFieldsValue({
        //   date: moment(selectDate),
        //   time: {
        //     maxCount: 1,

        //   }

        // })
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
      if (error?.response?.data?.error === 'TIME_END_MUST_BE_GREATER_THAN_TIME_START') {
        toast.error('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!');
        return;
      } else if (error?.response?.data?.status === 400 && error?.response?.data?.error === 'INVALID DATE') {
        toast.error('Thời gian đã tồn tại hoặc trùng với thời gian khác. Thử lại');
        return;
      }
      toast.error('Tạo kế hoạch khám không thành công!')
    }
  }

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
          onFinish={(values) => handleAddNewSchedule(values)}
          autoComplete='off'
          layout='vertical'
          form={form}
        >
          <div style={{ minHeight: '250px', maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }}>
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
                    // defaultValue={moment(selectDate, 'YYYY-MM-DD')}
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
                  name={['time', 'maxCount']}
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
              <Col span={9}>
                <Form.Item
                  name={['time', 'timeStart']}
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
                  // defaultValue={listTime[0]}
                  >
                    {listTime.map((item, index) => (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item
                  name={['time', 'timeEnd']}
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
                  // defaultValue={listTime[1]}
                  >
                    {listTime.map((item, index) => (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Form.List name="times">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <React.Fragment key={key}>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'maxCount']}
                            label={<span className='txt__label'>Số bệnh nhân</span>}
                            rules={[
                              {
                                required: true,
                                message: 'Số lượng bệnh nhân không được để trống',
                              }
                            ]}
                          >
                            <InputNumber
                              // style={{ width: '100%' }}
                              min={1} max={10} defaultValue={1} />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'timeStart']}
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
                            // defaultValue={listTime[0]}
                            >
                              {listTime.map((item, index) => (
                                <Option key={index} value={item}>
                                  {item}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'timeEnd']}
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
                            // defaultValue={listTime[1]}
                            >
                              {listTime.map((item, index) => (
                                <Option key={index} value={item}>
                                  {item}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        {/* <MinusCircleOutlined */}
                        <DeleteOutlined
                          style={{
                            fontSize: '16px',
                            transform: 'translateY(37px)',
                            color: 'red'
                          }}
                          onClick={() => remove(name)} />
                      </React.Fragment>
                    ))}
                    <Col span={24}>
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Thêm giờ khám
                        </Button>
                      </Form.Item>
                    </Col>
                  </>
                )}
              </Form.List>


            </Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button className='btn_cancel' danger size='middle' onClick={() => handleCancelModal()}>
                Hủy
              </Button>
              <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
                Thêm kế hoạch
              </Button>
            </Col>
          </div>
        </Form>
      </Spin>
    </Modal>
  )
}

export default CreateSchedule;
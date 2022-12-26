import { Button, Col, DatePicker, Form, Input, Modal, Spin, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import './CreateDoctor.scss';
import { toast } from 'react-toastify';
import ClinicApis from '../../../apis/Clinic';
import SpecialtyApis from '../../../apis/Specialty';
import DoctorApis from '../../../apis/Doctor';

const { Option } = Select;
const listGender = [
  {
    key: 'MALE',
    value: 'Nam'
  },
  {
    key: 'FEMALE',
    value: 'Nữ'
  },
  {
    key: 'ORTHER',
    value: 'Khác'
  }
]

const listRole = [
  {
    key: 'HEAD_OF_DOCTOR',
    value: 'Trưởng khoa'
  },
  {
    key: 'DOCTOR',
    value: 'Bác sĩ'
  },
  {
    key: 'MANAGER_CLINIC',
    value: 'Quản lý phòng khám'
  }
]

const CreateDoctor = ({
  isShowModal,
  handleCancelModal, // function cancel
}) => {
  const [loading, setLoading] = useState(false);
  const [optionsClinic, setOptionsClinic] = useState([]);
  const [optionsSpecialty, setOptionsSpecialty] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    !!isShowModal && getListClinic();
  }, [isShowModal])

  const getListClinic = async () => {
    try {
      const dataRes = await ClinicApis.getClinics({
        pages: 1,
        take: 100,
        active: true,
      })
      // console.log('dataRes: ', dataRes);
      if (dataRes?.data?.data) {
        const { data } = dataRes?.data;
        const listOptionsClinic = data.map(item => {
          return {
            id: item.id,
            name: item?.name || '',
          }
        })
        setOptionsClinic(listOptionsClinic || []);
      }
    } catch (error) {
      console.log('error: ', error);

    }
  }
  const handleAddNewDoctor = async (value) => {
    console.log('value: ', value);
    try {
      setLoading(true)
      const dataRes = await DoctorApis.createDoctor({
        ...value,
      })
      // 
      if (dataRes.status === 200) {
        setLoading(false);
        toast.success('Thêm bác thành công');
        handleCancelModal();
        form.setFieldsValue({
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          gender: undefined,
          role: undefined,
          clinicId: undefined,
          specialtyId: undefined
        })
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
      if (error.response.data.error === 'USER_ALREADY_EXIST' && error.response.data.status === 409) {
        toast.error('Bác sĩ đã tồn tại!');
      }
      // toast.error('Lỗi');
    }
  }

  const handleChangSelectClinic = async (value) => {
    try {
      const dataSpecialty = await SpecialtyApis.getSpecialtyByClinic(value);
      if (dataSpecialty?.data?.data?.length > 0) {
        const { data } = dataSpecialty?.data;
        const listSpecialty = data?.map(item => {
          return {
            id: item.id,
            name: item.name,
          }
        })

        setOptionsSpecialty(listSpecialty || [])
      } else if (dataSpecialty?.data?.data?.length === 0) {
        setOptionsSpecialty([]);
        form.setFieldsValue({
          specialtyId: undefined
        })
      }
    } catch (error) {
      // console.log('error: ', error);
      setOptionsSpecialty([]);
      form.setFieldsValue({
        specialtyId: undefined
      })
    }
  }


  return (
    <Modal
      className='create_modal'
      title={
        <>
          <div>Thêm bác sĩ</div>
        </>
      }
      open={isShowModal}
      onCancel={() => {
        !loading && handleCancelModal()
      }}
      width={700}
      footer={false}
    >
      <Spin spinning={loading}>
        <Form
          name='user'
          onFinish={(values) => handleAddNewDoctor(values)}
          autoComplete='off'
          layout='vertical'
          form={form}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name={'firstName'}
                label={<span className='txt_label'>Họ</span>}
                rules={[
                  {
                    required: true,
                    message: 'Họ không được để trống',
                  }
                ]}
              >
                <Input
                  size='middle'
                  className='txt_input'
                  placeholder={'Họ'} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={'middleName'}
                label={<span className='txt_label'>Tên đệm</span>}
              >
                <Input
                  size='middle'
                  className='txt_input'
                  placeholder={'Tên đệm'} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={'lastName'}
                label={<span className='txt_label'>Tên</span>}
                rules={[
                  {
                    required: true,
                    message: 'Tên không được để trống',
                  }
                ]}
              >
                <Input
                  size='middle'
                  className='txt_input'
                  placeholder={'Tên'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'email'}
                label={<span className='txt_label'>Email</span>}
                rules={[
                  { max: 255, message: 'Email tối đa 255 ký tự!' },
                  {
                    required: true,
                    message: 'Email không được để trống',
                  },
                  {
                    validator: (_, value) => {
                      const regex = new RegExp(/^[a-z0-9](\.?[a-z0-9]){2,}@gmail\.com$/gi);
                      if ((regex.test(value) && value)) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject('Email không đúng định dạng');
                      }
                    },
                  },
                ]}
              >
                <Input
                  size='middle'
                  className='txt_input'
                  placeholder={'Email'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'gender'}
                label={<span className='txt_label'>Giới tính</span>}
                rules={[
                  {
                    required: true,
                    message: 'Giới tính không được để trống',
                  },
                ]}
              >
                <Select
                  style={{ width: '100%' }}
                  size='middle'
                  placeholder={true ? 'Chọn giới tính' : 'Không có thông tin'}
                  className='txt_input'
                >
                  {listGender.map((item, index) => (
                    <Option key={index} value={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'phoneNumber'}
                label={<span className='txt_label'>Số điện thoại</span>}
                rules={[
                  {
                    max: 20,
                    message: 'Số điện thoại tối đa 20 ký tự',
                  },
                ]}
              >
                <Input
                  className='txt_input'
                  size='middle'
                  placeholder={true ? 'Số điện thoại' : 'Không có thông tin'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'birthday'} label={<span className='txt__label'>Ngày sinh</span>}>
                <DatePicker
                  picker='date'
                  showNow={false}
                  // showTime
                  placeholder={true ? 'Chọn ngày' : 'Không có thông tin'}
                  size={'middle'}
                  format={'DD/MM/YYYY'}
                  style={{
                    width: '100%',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  className='txt_input'
                  disabledDate={(current) => moment() <= current}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={'role'}
                label={<span className='txt_label'>Vai trò</span>}
                rules={[
                  {
                    required: true,
                    message: 'Vai trò không được để trống',
                  },
                ]}
              >
                <Select
                  style={{ width: '100%' }}
                  size='middle'
                  placeholder={true ? 'Chọn vai trò' : 'Không có thông tin'}
                  className='txt_input'
                >
                  {listRole.map((item, index) => (
                    <Option key={index} value={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'clinicId'}
                label={<span className='txt_label'>Phòng khám</span>}
                rules={[
                  {
                    required: true,
                    message: 'Phòng khám không được để trống',
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  size='middle'
                  placeholder={true ? 'Chọn phòng khám' : 'Không có thông tin'}
                  className='txt_input'
                  // optionLabelProp='label'
                  // optionFilterProp={'label'}
                  filterOption={(input, option) =>
                    option?.label !== null && option?.label?.toLowerCase().includes(input.trim().toLowerCase())
                  }
                  onChange={handleChangSelectClinic}
                >
                  {optionsClinic.length && optionsClinic.map((item) => (
                    <Option
                      key={item.id}
                      value={item.id || ''}
                      label={item.name}
                    >
                      {item.name}
                    </Option>

                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'specialtyId'}
                label={<span className='txt_label'>Chuyên khoa</span>}
              // rules={[
              //   {
              //     required: true,
              //     message: 'Giới tính không được để trống',
              //   },
              // ]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  size='middle'
                  placeholder={true ? 'Chọn chuyên khoa' : 'Không có thông tin'}
                  className='txt_input'
                  filterOption={(input, option) =>
                    option?.label !== null && option?.label?.toLowerCase().includes(input.trim().toLowerCase())
                  }
                >
                  {optionsSpecialty.length && optionsSpecialty.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button className='btn_cancel' danger size='middle' onClick={() => handleCancelModal()}>
              Hủy
            </Button>
            <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
              Thêm bác sĩ
            </Button>
          </Col>
        </Form>
      </Spin>
    </Modal >
  )
}

export default CreateDoctor;
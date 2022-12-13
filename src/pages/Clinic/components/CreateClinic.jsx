import { Button, Col, DatePicker, Form, Input, Modal, Spin, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import './CreateClinic.scss';
import { toast } from 'react-toastify';
import ClinicApis from '../../../apis/Clinic';
import SpecialtyApis from '../../../apis/Specialty';
import DoctorApis from '../../../apis/Doctor';

const { Option } = Select;

const CreateClinic = ({
  isShowModal,
  handleCancelModal, // function cancel
}) => {
  const [loading, setLoading] = useState(false);
  const [optionsSpecialty, setOptionsSpecialty] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {

    !!isShowModal && getListSpecialty();
  }, [isShowModal])

  const handleAddNewClinic = async (value) => {
    console.log('value: ', value);
    try {
      setLoading(true)
      const dataRes = await ClinicApis.createClinic({
        ...value,
        specialties: JSON.stringify(value.specialties),
      })
      // 
      if (dataRes.status === 200) {
        setLoading(false);
        toast.success('Thêm phòng khám thành công');
        handleCancelModal();
        form.setFieldsValue({
          name: '',
          emai: '',
          phone: '',
          email: '',
          address: '',
          province: '',
          specialties: undefined
        })
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
      if (error.response.data.error === 'CLINIC_ALREADY_EXIST' && error.response.data.status === 409) {
        toast.error('Phòng khám đã tồn tại!');
      }
      toast.error('Thêm phòng khám không thành công!');
    }
  }

  const getListSpecialty = async (value) => {
    try {
      const dataSpecialty = await SpecialtyApis.getListSpecialty({
        page: 1,
        take: 100,
      });
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
          <div>Thêm phòng khám</div>
        </>
      }
      visible={isShowModal}
      onCancel={() => {
        !loading && handleCancelModal()
      }}
      width={700}
      footer={false}
    >
      <Spin spinning={loading}>
        <Form
          name='user'
          onFinish={(values) => handleAddNewClinic(values)}
          autoComplete='off'
          layout='vertical'
          form={form}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name={'name'}
                label={<span className='txt_label'>Tên phòng khám</span>}
                rules={[
                  {
                    required: true,
                    message: 'Tên phòng khám không được để trống',
                  }
                ]}
              >
                <Input
                  size='middle'
                  className='txt_input'
                  placeholder={'Tên phòng khám'} />
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
                name={'phone'}
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
            <Col span={16}>
              <Form.Item
                name={'address'}
                label={<span className='txt_label'>Địa chỉ</span>}
              // rules={[
              //   {
              //     max: 20,
              //     message: 'Số điện thoại tối đa 20 ký tự',
              //   },
              // ]}
              >
                <Input
                  className='txt_input'
                  size='middle'
                  placeholder={true ? 'Địa chỉ' : 'Không có thông tin'}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={'province'}
                label={<span className='txt_label'>Tỉnh/Thành phố</span>}
                rules={[
                  {
                    required: true,
                    message: 'Tỉnh/Thành phố không được để trống',
                  },
                ]}
              >
                <Input
                  className='txt_input'
                  size='middle'
                  placeholder={true ? 'Tỉnh/Thành phố' : 'Không có thông tin'}
                />
              </Form.Item>
            </Col>


            <Col span={24}>
              <Form.Item
                name={'specialties'}
                label={<span className='txt_label'>Chuyên khoa</span>}
              // rules={[
              //   {
              //     required: true,
              //     message: 'Giới tính không được để trống',
              //   },
              // ]}
              >
                <Select
                  mode='multiple'
                  allowClear
                  showArrow
                  style={{ width: '100%' }}
                  size='middle'
                  placeholder={true ? 'Chọn chuyên khoa' : 'Không có thông tin'}
                  className='txt_input'
                  // defaultValue={}
                  filterOption={(input, option) =>
                    option?.children !== null && option?.children?.toLowerCase().includes(input.trim().toLowerCase())
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
              Thêm phòng khám
            </Button>
          </Col>
        </Form>
      </Spin>
    </Modal >
  )
}

export default CreateClinic;
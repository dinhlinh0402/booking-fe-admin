import { Button, Col, DatePicker, Form, Input, Modal, Spin, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import './AddEditUser.scss';
import CustomerApis from '../../../apis/Customer';
import { toast } from 'react-toastify';

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
    key: 'OTHER',
    value: 'Khác'
  }
]
const AddEditUser = ({
  isShowModal,
  type,
  handleCancelModal, // function cancel
  dataCustomer, // data update from dertail customer
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (type === 'update' && dataCustomer) {
      form.setFieldsValue({
        ...dataCustomer,
        birthday: dataCustomer.birthday ? moment(dataCustomer.birthday) : null,

      })
    }
  }, [dataCustomer])

  const handleAddEditCustomer = async (value) => {
    if (type === 'create') {
      await addNewCustomer(value);
    } else if (type === 'update' && dataCustomer) {
      await updateCustomer(value);
    }
  }

  const addNewCustomer = async (value) => {
    try {
      setLoading(true)
      const dataRes = await CustomerApis.createCustomer({
        ...value,
        role: 'USER',
      })
      if (dataRes.status === 200) {
        setLoading(false);
        toast.success('Thêm khách hàng thành công');
        handleCancelModal();
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
      if (error.response.data.error === 'USER_ALREADY_EXIST' && error.response.data.status === 409) {
        toast.error('Khách hàng đã tồn tại!');
      }
      toast.error('Thêm khách hàng không thành công!');
    }
  }

  const updateCustomer = async (value) => {
    try {
      setLoading(true)
      const dataRes = await CustomerApis.updateCustomer(dataCustomer.id, { ...value });
      if (dataRes.status === 200) {
        setLoading(false);
        toast.success('Sửa thông tin khách hàng thành công');
        handleCancelModal();
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
      if (error.response.data.error === 'USER_ALREADY_EXIST' && error.response.data.status === 409) {
        toast.error('Khách hàng đã tồn tại!');
        return;
      }
      toast.error('Sửa thông tin khách hàng không thành công');
    }
  }

  return (
    <Modal
      className='create_modal'
      title={
        <>
          {type == 'create' ? (
            <div>Thêm khách hàng</div>
          ) : (
            <div>Sửa thông tin khách hàng</div>
          )}
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
          onFinish={(values) => handleAddEditCustomer(values)}
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
                  placeholder={dataCustomer?.firstName ? 'Họ' : 'Không có thông tin'}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={'middleName'}
                label={<span className='txt_label'>Tên đệm</span>}
              // rules={[
              //   {
              //     required,
              //     message: 'Họ không được để trống',
              //   }
              // ]}
              >
                <Input
                  size='middle'
                  className='txt_input'
                  placeholder={dataCustomer?.middleName ? 'Tên đệm' : 'Không có thông tin'}
                />
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
                  placeholder={dataCustomer?.lastName ? 'Tên' : 'Không có thông tin'}
                />
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
                  placeholder={dataCustomer?.email ? 'Email' : 'Không có thông tin'}
                />
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
                  placeholder={dataCustomer?.gender ? 'Chọn giới tính' : 'Không có thông tin'}
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
                  placeholder={dataCustomer?.phoneNumber ? 'Số điện thoại' : 'Không có thông tin'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'birthday'} label={<span className='txt__label'>Ngày sinh</span>}>
                <DatePicker
                  picker='date'
                  showNow={false}
                  // showTime
                  placeholder={dataCustomer?.birthday ? 'Chọn ngày' : 'Không có thông tin'}
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
                name={'address'}
                label={<span className='txt_label'>Địa chỉ</span>}
                rules={[
                  {
                    max: 255,
                    message: 'Địa chỉ tối đa 255 ký tự',
                  },
                ]}
              >
                <Input
                  className='txt_input'
                  size='middle'
                  placeholder={dataCustomer?.address ? 'Địa chỉ' : 'Không có thông tin'}
                />
              </Form.Item>
            </Col>
          </Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button className='btn_cancel' danger size='middle' onClick={() => handleCancelModal()}>
              Hủy
            </Button>
            {type === 'create' ? (
              <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
                Thêm khách hàng
              </Button>
            ) : (
              <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
                Lưu thay đổi
              </Button>
            )}
          </Col>
        </Form>
      </Spin>
    </Modal>
  )
}

export default AddEditUser;
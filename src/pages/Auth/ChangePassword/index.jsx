import { Button, Col, Form, Input, Row, Spin } from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import AuthApis from "../../../apis/Auth";
import './index.scss';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // changePassword
      const dataChange = await AuthApis.changePassword(values);
      if (dataChange?.status === 200 && dataChange?.data) {
        toast.success('Đổi mật khẩu thành công!');
        setLoading(false);
        form.resetFields();
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
      if (error?.response?.data?.error === 'CURRENT_PASSWORD_INVALID') {
        toast.error('Mật khẩu cũ không đúng!');
        return;
      } else if (error?.response?.data?.error === 'NEW_PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH') {
        toast.error('Mật khẩu mới không giống nhau!');
        return;
      }
      toast.error('Đổi mật khẩu không thành công!');
    }
  }

  return (
    <div className="form_change">
      <Spin spinning={loading}>
        <div style={{
          fontSize: '20px',
          textAlign: 'center'
        }}>Đổi mật khẩu</div>
        <Form
          name='change_password'
          onFinish={(values) => handleSubmit(values)}
          autoComplete='off'
          layout='vertical'
          form={form}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name={'currentPassword'}
                label={<span className='txt_label'>Mật khẩu cũ</span>}
                rules={[
                  {
                    required: true,
                    message: 'Mật khẩu cũ không được để trống',
                  },
                  {
                    min: 6,
                    message: 'Mật khẩu phải lớn hơn 6 kí tự'
                  }
                ]}
              >
                <Input.Password
                  size='middle'
                  className='txt_input'
                  placeholder={'Mật khẩu cũ'} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name={'newPassword'}
                label={<span className='txt_label'>Mật khẩu mới</span>}
                rules={[
                  {
                    required: true,
                    message: 'Mật khẩu mới không được để trống',
                  },
                  {
                    min: 6,
                    message: 'Mật khẩu phải lớn hơn 6 kí tự'
                  }
                ]}
              >
                <Input.Password
                  size='middle'
                  className='txt_input'
                  placeholder={'Mật khẩu mới'} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name={'confirmPassword'}
                label={<span className='txt_label'>Xác nhận mật khẩu</span>}
                rules={[
                  {
                    required: true,
                    message: 'Xác nhận mật khẩu không được để trống',
                  },
                  {
                    min: 6,
                    message: 'Mật khẩu phải lớn hơn 6 kí tự'
                  }
                ]}
              >
                <Input.Password
                  size='middle'
                  className='txt_input'
                  placeholder={'Xác nhận mật khẩu'} />
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button className='btn_add' htmlType='submit' type='primary' size='middle' >
                Xác nhận
              </Button>
            </Col>
          </Row>

        </Form>
      </Spin>
    </div>
  )
}

export default ChangePassword;
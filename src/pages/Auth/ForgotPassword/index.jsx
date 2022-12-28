import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Spin } from "antd";
import './index.scss';
import { Link, Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AuthApis from "../../../apis/Auth";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  let history = useHistory();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      checkToken();
    }
  }, []);

  const checkToken = async () => {
    // console.log('ok');
    try {
      const dataCheckToken = await AuthApis.authMe();
      console.log('/dataCheckToken: ', dataCheckToken);
      if (dataCheckToken?.data) {
        if (dataCheckToken?.data?.role === 'ADMIN') {
          history.push('/admin');
        } else {
          history.push('/he-thong');
        }
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error('Hết phiên đăng nhập!');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }

  const onFinish = async (values) => {
    setLoading(true);
    console.log('Success:', values);
    try {
      const resetPassRes = await AuthApis.resetPassViaEmail(values);
      console.log('resetPassRes: ', resetPassRes);
      if (resetPassRes?.status === 200 && resetPassRes?.data) {
        toast.success('Mật khẩu mới đã được gửi về mail của bạn');
        setLoading(false);
        history.push('/login');
      }

    } catch (error) {
      console.log('error: ', error);
      toast.error('Thay đổi mật khẩu không thành công!');
      setLoading(false);
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          <img src="shttps://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700" alt="Login" />
        </div>
        <Spin spinning={loading}>
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <p className="form-title">Quên mật khẩu</p>

            <Form.Item
              name="email"
              rules={[
                { max: 255, message: 'Email tối đa 255 ký tự!' },
                {
                  required: true,
                  message: 'Vui lòng nhập email của bạn!'
                },
                {
                  validator: (_, value) => {
                    const regex = new RegExp(/^[a-z0-9](\.?[a-z0-9]){2,}@gmail\.com$/gi);
                    if ((regex.test(value) && value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('Email không đúng định dạng!');
                    }
                  },
                },
              ]}
            >
              <Input
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  cursor: 'pointer',
                  color: '#349eff',
                }}
                onClick={() => history.push('/login')}
              >
                Quay về trang đăng nhập
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </Spin>

      </div>
    </div>
  );
}

export default ForgotPassword;
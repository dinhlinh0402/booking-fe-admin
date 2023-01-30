import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Spin } from "antd";
import './index.scss';
import { Link, Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AuthApis from "../../../apis/Auth";

const Login = () => {
  const [loading, setLoading] = useState(false)
  let history = useHistory();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      checkToken();
    }
  }, []);

  const checkToken = async () => {
    try {
      const dataCheckToken = await AuthApis.authMe();
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
    try {
      const loginRes = await AuthApis.login(values);
      if (loginRes?.data?.user && loginRes?.data.token) {
        const { token, user } = loginRes?.data;
        localStorage.setItem('accessToken', token.accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Đăng nhập thành công');
        setLoading(false);
        if (user?.role === 'ADMIN') {
          history.push('/admin');
        } else {
          history.push('/he-thong');
        }
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error('Đăng nhập không thành công!');
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
          <img
            // src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700" 
            src="http://techport.vn/uploads/2019/12-4/3.-bookingcare_brochure-VIE-1.jpg"
            alt="Login"
          />
        </div>
        <Spin spinning={loading}>
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <p className="form-title">Welcome back!</p>
            <p>Login to the Dashboard</p>
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

            <Form.Item
              name="password"
              rules={[
                { min: 6, message: 'Mật khẩu phải lớn hơn 6 kí tự!' },
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu của bạn!'
                }
              ]}
            >
              <Input.Password
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  cursor: 'pointer',
                  color: '#349eff',
                }}
                onClick={() => history.push('/quen-mat-khau')}
              >
                Quên mật khẩu
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Spin>

      </div>
    </div>
  );
}

export default Login;
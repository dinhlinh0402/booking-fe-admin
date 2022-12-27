import React, { useEffect } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import './index.scss';
import { Link, Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AuthApis from "../../../apis/Auth";

const Login = () => {
  let history = useHistory();

  useEffect(() => {
    console.log('run');
    checkToken();
  }, []);

  const checkToken = async () => {
    console.log('ok');
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
    }
  }

  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      const loginRes = await AuthApis.login(values);
      console.log('loginRes: ', loginRes);
      if (loginRes?.data?.user && loginRes?.data.token) {
        const { token, user } = loginRes?.data;
        localStorage.setItem('accessToken', token.accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Đăng nhập thành công');
        history.push('/admin');
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error('Đăng nhập không thành công!');
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  console.log('ok');

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          <img src="shttps://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700" alt="Login" />
        </div>
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

          <div onClick={() => <Redirect to="https://google.com.vn" />
          }>Quên mật khẩu</div>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
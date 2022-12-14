import { Button, Col, Form, Input, Row, Select, Spin } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import ClinicApis from "../../../../../apis/Clinic";
import './index.scss';

const modulesQill = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' },
    { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  },
  history: {
    delay: 1000,
    maxStack: 50,
    userOnly: false
  },
  // imageResize: {
  // displayStyles: {
  //   backgroundColor: 'black',
  //   border: 'none',
  //   color: 'white'
  // },
  // modules: ['Resize', 'DisplaySize', 'Toolbar']
  // },
}
const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]


const TabClinicIntroduce = ({ dataClinicIntroduce, clinicId }) => {
  const [loading, setLoading] = useState(false);
  const [editIntroduce, setEditIntroduce] = useState(false)
  const [form] = Form.useForm();

  console.log('dataClinicIntroduce: ', dataClinicIntroduce);
  useEffect(() => {
    if (Object.keys(dataClinicIntroduce).length) {
      form.setFieldsValue({
        introduct: dataClinicIntroduce?.introduct || null,
        strengths: dataClinicIntroduce?.strengths || null,
        equipment: dataClinicIntroduce?.equipment || null,
        location: dataClinicIntroduce?.location || null,
        procedure: dataClinicIntroduce?.procedure || null,
      })
    }

    return () => {
      form.resetFields();
    };
  }, [dataClinicIntroduce])

  const handleClinicIntroduce = async (values) => {
    setLoading(true);
    if (Object.keys(dataClinicIntroduce).length && clinicId) {
      try {
        const clinicInforRes = await ClinicApis.updateClinicIntroduct(dataClinicIntroduce.id, values);
        if (clinicInforRes?.status === 200) {
          toast.success('Thay ?????i th??ng tin gi???i thi???u ph??ng kh??m th??nh c??ng');
          setLoading(false);
          setEditIntroduce(false);
        }
      } catch (error) {
        console.log('error: ', error);
        toast.error('Thay ?????i th??ng tin gi???i thi???u ph??ng kh??m kh??ng th??nh c??ng!');
        setLoading(false);
      }
    } else if (!Object.keys(dataClinicIntroduce).length && clinicId) {
      try {
        const clinicInforRes = await ClinicApis.createClinicIntroduct({
          ...values,
          clinicId: clinicId,
        });
        if (clinicInforRes?.status === 200) {
          toast.success('Th??m gi???i thi???u ph??ng kh??m th??nh c??ng');
          setLoading(false);
          setEditIntroduce(false);
        }
      } catch (error) {
        console.log('error: ', error);
        toast.error('Th??m gi???i thi???u ph??ng kh??m kh??ng th??nh c??ng!');
        setLoading(false);
      }

    }
  }
  return (
    <>
      {loading ? (
        <div className="spin">
          <Spin />
        </div>

      ) : (
        <>
          <div className="header_clinic_introduce">
            <div style={{ fontSize: '17px' }}>Th??ng tin ph??ng kh??m</div>
            <div className="button_edit">
              {!editIntroduce && (
                <Button
                  type='primary'
                  onClick={() => setEditIntroduce(true)}
                >
                  {Object.keys(dataClinicIntroduce).length ? 'Ch???nh s???a th??ng tin' : 'Th??m gi???i thi???u ph??ng kh??m'}
                </Button>
              )}
            </div>
          </div>

          <div className="form_clinic_introduce">
            <Form
              name='clinic_information'
              onFinish={(values) => handleClinicIntroduce(values)}
              autoComplete='off'
              layout='vertical'
              form={form}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={'introduct'}
                    label={<span className='txt_label'>Gi???i thi???u ph??ng kh??m</span>}
                  >
                    <ReactQuill
                      // disabled={!editIntroduce}
                      readOnly={!editIntroduce}
                      className={!editIntroduce ? 'react_quill_disable' : ''}
                      theme="snow"
                      placeholder="Gi???i thi???u ph??ng kh??m"
                      modules={modulesQill}
                      formats={formats}
                      // bounds={'#root'}
                      style={{ height: "500px" }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name={'strengths'}
                    label={<span className='txt_label'>Th??? m???nh chuy??n m??n</span>}
                  >
                    <ReactQuill
                      readOnly={!editIntroduce}
                      className={!editIntroduce ? 'react_quill_disable' : ''}
                      theme="snow"
                      placeholder="Th??? m???nh chuy??n m??n"
                      modules={modulesQill}
                      formats={formats}
                      // bounds={'#root'}
                      style={{ height: "500px" }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name={'equipment'}
                    label={<span className='txt_label'>Trang thi???t b???</span>}
                  >
                    <ReactQuill
                      readOnly={!editIntroduce}
                      className={!editIntroduce ? 'react_quill_disable' : ''}
                      theme="snow"
                      placeholder="Trang thi???t b???"
                      modules={modulesQill}
                      formats={formats}
                      // bounds={'#root'}
                      style={{ height: "500px" }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name={'location'}
                    label={<span className='txt_label'>V??? tr??</span>}
                  >
                    <ReactQuill
                      readOnly={!editIntroduce}
                      className={!editIntroduce ? 'react_quill_disable' : ''}
                      theme="snow"
                      placeholder="V??? tr??"
                      modules={modulesQill}
                      formats={formats}
                      // bounds={'#root'}
                      style={{ height: "500px" }}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name={'procedure'}
                    label={<span className='txt_label'>Quy tr??nh kh??m</span>}
                  >
                    <ReactQuill
                      readOnly={!editIntroduce}
                      className={!editIntroduce ? 'react_quill_disable' : ''}
                      theme="snow"
                      placeholder="Quy tr??nh kh??m"
                      modules={modulesQill}
                      formats={formats}
                      // bounds={'#root'}
                      style={{ height: "500px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {editIntroduce && (
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Button className='btn_cancel' danger size='middle' onClick={() => setEditIntroduce(false)}>
                    {dataClinicIntroduce && Object.keys(dataClinicIntroduce).length ? 'H???y ch???nh s???a' : 'H???y th??m'}
                  </Button>
                  <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
                    {dataClinicIntroduce && Object.keys(dataClinicIntroduce).length ? 'C???p nh???t' : 'Th??m'}
                  </Button>
                </Col>
              )}
            </Form>
          </div>
        </>
      )}
    </>
  )
}

export default TabClinicIntroduce;
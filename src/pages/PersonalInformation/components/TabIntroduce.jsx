import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import DoctorApis from "../../../apis/Doctor";
import { listPayment, listPositon } from "../../../common/constants/doctor";

const { TextArea } = Input;
const { Option } = Select;

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

const TabIntroduce = ({dataUser}) => {
  const [editIntroduce, setEditIntroduce] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  console.log('dataUser: ', dataUser);

  useEffect(() => {
    if(dataUser) {
      const {doctorInfor} = dataUser;
      console.log('doctorInfor: ', doctorInfor);
      form.setFieldsValue({
        position: doctorInfor?.position || null,
        price: doctorInfor?.price || 0,
        payment: doctorInfor?.payment || null,
        introduct: doctorInfor?.introduct || null,
        note: doctorInfor?.note || null,
        description: doctorInfor?.description || null,
      })
    }
  }, [dataUser])

  const handleUpdateIntroduce = async (values) => {
    setLoading(true);
    if (!dataUser && Object.keys(dataUser).length === 0) {
      try {
        const dataSaveDoctorInfo = await DoctorApis.createDoctorInfor({
          ...values,
          doctorId: dataUser.id,
        })
        if (dataSaveDoctorInfo?.status === 200) {
          toast.success('Th??m gi???i thi???u th??nh c??ng');
          setLoading(false);
          setEditIntroduce(false);
        }
      } catch (error) {
        console.log('error: ', error);
        toast.error('Th??m gi???i thi???u kh??ng th??nh c??ng!');
        setLoading(false);
      }

    } else {
      // cC???p nh???t th??ng tin gi???i thi???u
      try {
        const dataSaveDoctorInfo = await DoctorApis.updateDoctorInfoExtra(values, dataUser.doctorInfor.id);
        if (dataSaveDoctorInfo?.status === 200) {
          toast.success('Thay ?????i th??ng tin gi???i thi???u th??nh c??ng');
          setLoading(false);
          setEditIntroduce(false);
        }
      } catch (error) {
        console.log('error: ', error);
        toast.error('Thay ?????i th??ng tin gi???i thi???u kh??ng th??nh c??ng!');
        setLoading(false);
      }
    }
  }

  return (
    <div className="doctor_introduce">
    <div className="header_doctor_introduce">
      <div style={{ fontSize: '17px' }}>Gi???i thi???u chi ti???t</div>
      <div className='button_edit'>
        {!editIntroduce && (
          <Button
            type='primary'
            onClick={() => setEditIntroduce(true)}
          >
            {!dataUser ? 'Th??m gi???i thi???u' : 'Ch???nh s???a th??ng tin'}
          </Button>
        )}
      </div>
    </div>
    <div className="form_doctor_introduce">
      <Form
        name='doctor_introduce'
        onFinish={(values) => handleUpdateIntroduce(values)}
        autoComplete='off'
        layout='vertical'
        form={form}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name={'position'}
              label={<span className='txt_label'>Ch???c danh</span>}
            >
              <Select
                disabled={!editIntroduce}
                style={{ width: '100%' }}
                size='middle'
                placeholder={true ? 'Ch???n ch???c danh' : 'Kh??ng c?? th??ng tin'}
                className='txt_input'
              >
                {listPositon.map((item, index) => (
                  <Option key={index} value={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={'price'}
              label={<span className='txt_label'>Gi?? kh??m</span>}
            >
              <InputNumber
                defaultValue={0}
                style={{ width: '100%' }}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/\.(?=\d{0,2}$)/g, ",")}
                parser={(value) => value.replace(/\$\s?|(\.*)/g, "").replace(/(\,{1})/g, ".")}
                placeholder={true ? 'Gi?? kh??m' : 'Kh??ng c?? th??ng tin'}
                disabled={!editIntroduce}
                className='txt_input'
                size='middle'
              />

            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={'payment'}
              label={<span className='txt_label'>Ph????ng th???c thanh to??n</span>}
            >
              <Select
                disabled={!editIntroduce}
                style={{ width: '100%' }}
                size='middle'
                placeholder={true ? 'Ch???n ph????ng th???c thanh to??n' : 'Kh??ng c?? th??ng tin'}
                className='txt_input'
              >
                {listPayment.map((item, index) => (
                  <Option key={index} value={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={'introduct'}
              label={<span className='txt_label'>Gi???i thi???u</span>}
            >
              <TextArea
                disabled={!editIntroduce}
                rows={4}
                placeholder='Gi???i thi???u b??c s??'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={'note'}
              label={<span className='txt_label'>Ghi ch??</span>}
            >
              <TextArea
                disabled={!editIntroduce}
                rows={4}
                placeholder='Ghi ch??'
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name={'description'}
              label={<span className='txt_label'>M?? t??? b??c s??</span>}
            >
              <ReactQuill
                readOnly={!editIntroduce}
                theme="snow"
                placeholder="M?? t???"
                modules={modulesQill}
                formats={formats}
                // bounds={'#root'}
                style={{ height: "500px" }}
              />
            </Form.Item>
          </Col>

          {editIntroduce && dataUser && (
            <div style={{ textAlign: 'center', marginTop: '30px', width: '100%' }}>
              <Col span={24} style={{ textAlign: 'center', marginTop: '20px !important' }}>
                <Button className='btn_cancel' danger size='middle' onClick={() => setEditIntroduce(false)}>
                  H???y ch???nh s???a
                </Button>
                <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
                  C???p nh???t
                </Button>
              </Col>
            </div>
          )}

          {editIntroduce && !dataUser && (
            <div style={{ textAlign: 'center', marginTop: '30px', width: '100%' }}>
              <Col span={24} >
                <Button className='btn_cancel' danger size='middle' onClick={() => setEditIntroduce(false)}>
                  H???y
                </Button>
                <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
                  Th??m
                </Button>
              </Col>
            </div>
          )}

        </Row>
      </Form>
    </div>
  </div>
  )
}

export default TabIntroduce;
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Input, message, Row, Select, Spin, Upload } from "antd";
import SpecialtyApis from "../../../../../apis/Specialty";
import './index.scss';
import { PlusOutlined } from "@ant-design/icons";
import baseURL from "../../../../../utils/url";
import { toast } from "react-toastify";
import ClinicApis from "../../../../../apis/Clinic";

const { Option } = Select;

const TabClinicInformation = ({ dataClinic }) => {
  const [loading, setLoading] = useState('false');
  const [editInformation, setEditInformation] = useState(false);
  const [optionsSpecialty, setOptionsSpecialty] = useState([]);
  const [fileListImage, setFileListImage] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    getListSpecialty();
  }, [])

  useEffect(() => {
    if (Object.keys(dataClinic).length) {
      form.setFieldsValue({
        name: dataClinic.name || null,
        email: dataClinic.email || null,
        phone: dataClinic.phone || null,
        address: dataClinic.address || null,
        province: dataClinic.province || null,
        specialties: dataClinic?.specialties
          ? dataClinic?.specialties.map(item => item.id) : [],
      });
      setFileListImage(dataClinic?.image ? [{
        uid: '-1',
        name: 'image.jpg',
        status: 'done',
        url: `${baseURL}${dataClinic.image}`,
      }] : [])
    }

    return () => {
      form.resetFields();
    };
  }, [dataClinic])

  const getListSpecialty = async () => {
    setLoading(true);
    try {
      const dataSpecialty = await SpecialtyApis.getListSpecialty({
        pages: 1,
        take: 100,
      });
      if (dataSpecialty?.data?.data) {
        const { data } = dataSpecialty?.data;
        const listSpecialty = data?.map(item => {
          return {
            id: item.id,
            name: item?.name,
          }
        })

        setOptionsSpecialty(listSpecialty || []);
        setLoading(false);
      }
    } catch (error) {
      console.log('error: ', error);
      setOptionsSpecialty([]);
      form.setFieldsValue({
        specialtyId: undefined
      })
      setLoading(false);
    }
  }

  const onChangeImage = ({ fileList: newFileList }) => {
    setFileListImage(newFileList);
  };

  const handleUpdateClinic = async (values) => {
    setLoading(true);
    let newData = [];
    if (values.image === dataClinic.image || (!values.image) || (values.image && values?.image?.fileList?.length === 0)) {
      const { image, ...resData } = values;
      newData = {
        ...resData,
        specialties: JSON.stringify(resData.specialties),
      }
    } else if (values?.image?.fileList?.length > 0) {
      const fileSize = values?.image?.fileList[0]?.size;
      const isLt2M = fileSize / 1024 / 1024 < 2;
      // console.log('isLt2M: ', isLt2M);
      if (!isLt2M) {
        message.error('Ch???n ???nh nh??? h??n 2MB!');
        return;
      }
      let formData = new FormData();
      for (const item in values) {
        if (item === 'image') {
          formData.append('file', values[item].fileList[0]?.originFileObj);
        } else if (item === 'specialties') {
          formData.append(item, JSON.stringify(values[item]));
        } else if (!values[item]) break;
        else {
          formData.append(item, values[item]);
        }
      }
      // formData.append('file', avatar?.fileList[0]?.originFileObj);
      newData = formData;
    }

    try {
      const dataUpdateRes = await ClinicApis.updateClinic(newData, dataClinic.id);
      if (dataUpdateRes.status === 200) {
        setLoading(false);
        toast.success('C???p nh???t th??ng tin ph??ng kh??m th??nh c??ng');
        setEditInformation(false);
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
      toast.error('C???p nh???t th??ng tin ph??ng kh??m kh??ng th??nh c??ng!');
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
          <div className="header_clinic_information">
            <div style={{ fontSize: '17px' }}>Th??ng tin ph??ng kh??m</div>
            <div className="button_edit">
              {!editInformation && (
                <Button
                  type='primary'
                  onClick={() => setEditInformation(true)}
                >
                  Ch???nh s???a th??ng tin ph??ng kh??m
                </Button>
              )}
            </div>
          </div>

          <div className="form_clinic_information">
            <Form
              name='clinic_information'
              onFinish={(values) => handleUpdateClinic(values)}
              autoComplete='off'
              layout='vertical'
              form={form}
            >
              <Row gutter={24}>
                <Col span={18}>
                  <Form.Item
                    name={'name'}
                    label={<span className='txt_label'>T??n ph??ng kh??m</span>}
                    rules={[
                      {
                        required: true,
                        message: 'T??n ph??ng kh??m kh??ng ???????c ????? tr???ng',
                      }
                    ]}
                  >
                    <Input
                      disabled={!editInformation}
                      size='middle'
                      className='txt_input'
                      placeholder={dataClinic?.name ? 'T??n ph??ng kh??m' : 'Kh??ng c?? th??ng tin'} />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    name={'image'}
                    label={<span className='txt_label'>???nh ph??ng kh??m</span>}
                  >
                    <Upload
                      disabled={!editInformation}
                      listType="picture-card"
                      fileList={fileListImage}
                      beforeUpload={() => false}
                      onChange={onChangeImage}
                      maxCount={1}
                    >
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name={'email'}
                    label={<span className='txt_label'>Email</span>}
                    rules={[
                      { max: 255, message: 'Email t???i ??a 255 k?? t???!' },
                      {
                        required: true,
                        message: 'Email kh??ng ???????c ????? tr???ng',
                      },
                      {
                        validator: (_, value) => {
                          const regex = new RegExp(/^[a-z0-9](\.?[a-z0-9]){2,}@gmail\.com$/gi);
                          if ((regex.test(value) && value)) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject('Email kh??ng ????ng ?????nh d???ng');
                          }
                        },
                      },
                    ]}
                  >
                    <Input
                      disabled={!editInformation}
                      size='middle'
                      className='txt_input'
                      placeholder={dataClinic?.email ? 'Email' : 'Kh??ng c?? th??ng tin'} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name={'phone'}
                    label={<span className='txt_label'>S??? ??i???n tho???i</span>}
                    rules={[
                      {
                        max: 20,
                        message: 'S??? ??i???n tho???i t???i ??a 20 k?? t???',
                      },
                    ]}
                  >
                    <Input
                      disabled={!editInformation}
                      className='txt_input'
                      size='middle'
                      placeholder={dataClinic?.phone ? 'S??? ??i???n tho???i' : 'Kh??ng c?? th??ng tin'}
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name={'address'}
                    label={<span className='txt_label'>?????a ch???</span>}
                  // rules={[
                  //   {
                  //     max: 20,
                  //     message: 'S??? ??i???n tho???i t???i ??a 20 k?? t???',
                  //   },
                  // ]}
                  >
                    <Input
                      disabled={!editInformation}
                      className='txt_input'
                      size='middle'
                      placeholder={dataClinic?.address ? '?????a ch???' : 'Kh??ng c?? th??ng tin'}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={'province'}
                    label={<span className='txt_label'>T???nh/Th??nh ph???</span>}
                    rules={[
                      {
                        required: true,
                        message: 'T???nh/Th??nh ph??? kh??ng ???????c ????? tr???ng',
                      },
                    ]}
                  >
                    <Input
                      disabled={!editInformation}
                      className='txt_input'
                      size='middle'
                      placeholder={dataClinic?.province ? 'T???nh/Th??nh ph???' : 'Kh??ng c?? th??ng tin'}
                    />
                  </Form.Item>
                </Col>


                <Col span={24}>
                  <Form.Item
                    name={'specialties'}
                    label={<span className='txt_label'>Chuy??n khoa</span>}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Gi???i t??nh kh??ng ???????c ????? tr???ng',
                  //   },
                  // ]}
                  >
                    <Select
                      mode='multiple'
                      allowClear
                      disabled={!editInformation}
                      showArrow
                      style={{ width: '100%' }}
                      size='middle'
                      placeholder={dataClinic?.specialties ? 'Ch???n chuy??n khoa' : 'Kh??ng c?? th??ng tin'}
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
              {editInformation && (
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Button className='btn_cancel' danger size='middle' onClick={() => setEditInformation(false)}>
                    H???y ch???nh s???a
                  </Button>
                  <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
                    C???p nh???t
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

export default TabClinicInformation;
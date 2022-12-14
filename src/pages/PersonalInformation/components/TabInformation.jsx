import { Avatar, Badge, Button, Col, DatePicker, Form, Input, message, Row, Select, Space, Spin, Typography, Upload } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ClinicApis from "../../../apis/Clinic";
import DoctorApis from "../../../apis/Doctor";
import SpecialtyApis from "../../../apis/Specialty";
import UserApis from "../../../apis/User";
import { listRole } from "../../../common/constants/doctor";
import { listGender } from "../../../common/constants/gender";
import baseURL from "../../../utils/url";

const { Text, Title } = Typography;
const { Option } = Select;

const TabInformation = ({dataUser, handleReset}) => {
  // console.log('dataUser: ', handleReset);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [editInformation, setEditInformation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optionsClinic, setOptionsClinic] = useState([]);
  const [optionsSpecialty, setOptionsSpecialty] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if(dataUser?.clinic?.id) {
      getListSpecialty();
      getListClinic();
    }
  }, [])

  useEffect(() => {
    if(dataUser?.clinic?.id) {
      getListSpecialty();
      getListClinic();
    }

    if(dataUser) {
      form.setFieldsValue({
        firstName: dataUser?.firstName || '',
        middleName: dataUser?.middleName || '',
        lastName: dataUser?.lastName || '',
        email: dataUser?.email || '',
        gender: dataUser?.gender || null,
        phoneNumber: dataUser?.phoneNumber || null,
        birthday: dataUser?.birthday ? moment(dataUser?.birthday) : null,
        address: dataUser?.address || '',
        role: dataUser.role || '',
        clinicId: dataUser?.clinic ? dataUser.clinic?.id : null,
        specialtyId: dataUser?.specialty ? dataUser.specialty?.id : null,
        avatar: dataUser?.avatar || null,
        religion: dataUser?.religion || '',
        nation: dataUser?.nation || '',
        identityCardNumber: dataUser?.identityCardNumber || '',
      })
    }
  }, [dataUser])


  const getListClinic = async () => {
    setLoading(true);
    try {
      const dataRes = await ClinicApis.getClinics({
        pages: 1,
        take: 100,
        active: true,
      })
      if (dataRes?.data?.data) {
        const { data } = dataRes?.data;
        const listOptionsClinic = data.map(item => {
          return {
            id: item.id,
            name: item?.name || '',
          }
        })
        setOptionsClinic(listOptionsClinic || []);
        setLoading(false);
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  const getListSpecialty = async () => {
    setLoading(true);
    try {
      console.log(dataUser?.clinic?.id);
      const dataSpecialty = await SpecialtyApis.getSpecialtyByClinic(
        dataUser?.clinic?.id || undefined
      );
      if (dataSpecialty?.data?.data?.length > 0) {
        const { data } = dataSpecialty?.data;
        const listSpecialty = data?.map(item => {
          return {
            id: item.id,
            name: item.name,
          }
        })

        setOptionsSpecialty(listSpecialty || []);
        setLoading(false);
      } else if (dataSpecialty?.data?.data?.length === 0) {
        setOptionsSpecialty([]);
        form.setFieldsValue({
          specialtyId: undefined
        })
        setLoading(true);
      }
    } catch (error) {
      console.log('error: ', error);
      setOptionsSpecialty([]);
      form.setFieldsValue({
        specialtyId: undefined
      })
    setLoading(true);

    }
  }

  const handleUploadAvatar = async ({ file, fileList }) => {
    setLoadingAvatar(true);
    console.log('file: ', file);
    console.log('fileList: ', fileList);
    const listType = ['image/jpeg', 'image/png', 'image/jpg'];
    const checkType = listType.includes(file.type)

    if (!checkType) {
      message.error(`Kh??ng ????ng ?????nh d???ng ???nh`);
      return;
    }

    const fileSize = file?.size;
    const isLt2M = fileSize / 1024 / 1024 < 2;
    // console.log('isLt2M: ', isLt2M);
    if (!isLt2M) {
      message.error('Ch???n ???nh nh??? h??n 2MB!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', fileList[0]?.originFileObj);
      // handleReset();
      // Do khongo phaan quyeefn get use cho doctor n??n ko get dc
      // fix sau
      const data = await UserApis.changeAvatar(formData);
      if (data?.status === 200 && data?.data) {
        toast.success('Thay ?????i ???nh ?????i di???n th??nh c??ng');
        setLoadingAvatar(false);
        handleReset();
      }
    } catch (error) {
      console.log('error: ', error);
      toast.success('Thay ?????i ???nh ?????i di???n kh??ng th??nh c??ng');
      setLoadingAvatar(false);
    }
  }

  const handleUpdateDoctor = async (value) => {
    setLoading(true);
    
    try {
      const dataRes = await DoctorApis.updateDoctor(value, dataUser.id);
      if (dataRes.status === 200) {
        setLoading(false);
        setEditInformation(false);
        toast.success('C???p nh???t th??ng tin th??nh c??ng');
        setEditInformation(false);
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
      if (error.response.data.error === 'USER_ALREADY_EXIST' && error.response.data.status === 409) {
        toast.error('Ng?????i d??ng ???? t???n t???i!');
        return;
      }
      toast.error('C???p nh???t th??ng tin kh??ng th??nh c??ng!');
    }
  }

  return (
    <div>
      <div className="info_admin_avatar">
        <Space align='center'>
          <Badge
            offset={[-10, 66]}
          >
            {loadingAvatar ? (
              <Spin className='spin-avatar' />
            ) : (
              <Form.Item
                noStyle
                shouldUpdate={(prev, cur) => {
                  return prev.avatar !== cur.avatar;
                }}
              >
                <Avatar
                  src={`${baseURL}${dataUser.avatar}`}
                  size={80}
                  style={{ fontSize: '26px' }}
                >
                  {dataUser?.lastName?.[0]?.toUpperCase()}
                </Avatar>

              </Form.Item>
            )}
          </Badge>
          <Space direction='vertical' size={0} style={{ marginLeft: '10px' }}>
            <Title level={5} style={{ color: 'rgba(17, 17, 17, 0.75)', fontWeight: 600 }}>
              ???nh ?????i di???n
            </Title>
            {/* <label htmlFor='upload-input'>
                  <Text style={{ color: '#3863EF', fontWeight: 500, cursor: 'pointer' }} underline>
                    Thay ???nh ...
                  </Text>
                </label> */}
            <Upload
              // {...props}
              // listType="picture-card"
              maxCount={1}
              showUploadList={false}
              multiple={false}
              beforeUpload={() => false}
              onChange={handleUploadAvatar}
            >
              <span
                style={{
                  color: '#3863EF',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >Thay ???nh...</span>
            </Upload>
          </Space>
        </Space>
      </div>
      <div className="doctor_information">
                <div className="header_doctor_information">
                  <div style={{ fontSize: '17px' }}>Th??ng tin</div>
                  <div className='button_edit'>
                    {!editInformation && (
                      <Button
                        type='primary'
                        onClick={() => setEditInformation(true)}
                      >
                        Ch???nh s???a th??ng tin
                      </Button>
                    )}
                  </div>
                </div>

                <div className="form_doctor_information">
                  {loading ? (
                    <Spin />
                  ): (
                    <Form
                    name='doctor'
                    onFinish={(values) => handleUpdateDoctor(values)}
                    autoComplete='off'
                    layout='vertical'
                    form={form}
                  >
                    <Row gutter={24}>
                      <Col span={6}>
                        <Form.Item
                          name={'firstName'}
                          label={<span className='txt_label'>H???</span>}
                          rules={[
                            {
                              required: true,
                              message: 'H??? kh??ng ???????c ????? tr???ng',
                            }
                          ]}
                        >
                          <Input
                            disabled={!editInformation}
                            size='middle'
                            className='txt_input'
                            placeholder={dataUser?.firstName ? 'H???' : 'Kh??ng c?? th??ng tin'} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name={'middleName'}
                          label={<span className='txt_label'>T??n ?????m</span>}
                        >
                          <Input
                            disabled={!editInformation}
                            size='middle'
                            className='txt_input'
                            placeholder={dataUser?.middleName ? 'T??n ?????m' : 'Kh??ng c?? th??ng tin'} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name={'lastName'}
                          label={<span className='txt_label'>T??n</span>}
                          rules={[
                            {
                              required: true,
                              message: 'T??n kh??ng ???????c ????? tr???ng',
                            }
                          ]}
                        >
                          <Input
                            disabled={!editInformation}
                            size='middle'
                            className='txt_input'
                            placeholder={dataUser?.lastName ? 'T??n' : 'Kh??ng c?? th??ng tin'} />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
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
                            placeholder={dataUser?.email ? 'Email' : 'Kh??ng c?? th??ng tin'} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name={'gender'}
                          label={<span className='txt_label'>Gi???i t??nh</span>}
                          rules={[
                            {
                              required: true,
                              message: 'Gi???i t??nh kh??ng ???????c ????? tr???ng',
                            },
                          ]}
                        >
                          <Select
                            disabled={!editInformation}
                            style={{ width: '100%' }}
                            size='middle'
                            placeholder={dataUser?.gender ? 'Ch???n gi???i t??nh' : 'Kh??ng c?? th??ng tin'}
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
                      <Col span={6}>
                        <Form.Item
                          name={'phoneNumber'}
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
                            placeholder={dataUser?.phoneNumber ? 'S??? ??i???n tho???i' : 'Kh??ng c?? th??ng tin'}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name={'birthday'} label={<span className='txt__label'>Ng??y sinh</span>}>
                          <DatePicker
                            disabled={!editInformation}
                            picker='date'
                            showNow={false}
                            // showTime
                            placeholder={dataUser?.birthday ? 'Ch???n ng??y' : 'Kh??ng c?? th??ng tin'}
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

                      <Col span={8}>
                        <Form.Item
                          name={'nation'}
                          label={<span className='txt_label'>Qu???c gia</span>}
                        >
                          <Input
                            disabled={!editInformation}
                            className='txt_input'
                            size='middle'
                            placeholder={dataUser?.nation ? 'Qu???c gia' : 'Kh??ng c?? th??ng tin'}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={'religion'}
                          label={<span className='txt_label'>T??n gi??o</span>}
                        >
                          <Input
                            disabled={!editInformation}
                            className='txt_input'
                            size='middle'
                            placeholder={dataUser?.religion ? 'T??n gi??o' : 'Kh??ng c?? th??ng tin'}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={'identityCardNumber'}
                          label={<span className='txt_label'>CCCD/CTM</span>}
                        >
                          <Input
                            disabled={!editInformation}
                            className='txt_input'
                            size='middle'
                            placeholder={dataUser?.identityCardNumber ? 'CCCD/CMT' : 'Kh??ng c?? th??ng tin'}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={4}>
                        <Form.Item
                          name={'role'}
                          label={<span className='txt_label'>Vai tr??</span>}
                          rules={[
                            {
                              required: true,
                              message: 'Vai tr?? kh??ng ???????c ????? tr???ng',
                            },
                          ]}
                        >
                          <Select
                            disabled={true}
                            style={{ width: '100%' }}
                            size='middle'
                            placeholder={dataUser?.role ? 'Ch???n vai tr??' : 'Kh??ng c?? th??ng tin'}
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
                      <Col span={10}>
                        <Form.Item
                          name={'clinicId'}
                          label={<span className='txt_label'>Ph??ng kh??m</span>}
                          rules={[
                            {
                              required: true,
                              message: 'Ph??ng kh??m kh??ng ???????c ????? tr???ng',
                            },
                          ]}
                        >
                          <Select
                            disabled={true}
                            showSearch
                            style={{ width: '100%' }}
                            size='middle'
                            placeholder={dataUser?.clinic?.id ? 'Ch???n ph??ng kh??m' : 'Kh??ng c?? th??ng tin'}
                            className='txt_input'
                            // optionLabelProp='label'
                            // optionFilterProp={'label'}
                            filterOption={(input, option) =>
                              option?.label !== null && option?.label?.toLowerCase().includes(input.trim().toLowerCase())
                            }
                            // onChange={handleChangSelectClinic}
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
                      <Col span={10}>
                        <Form.Item
                          name={'specialtyId'}
                          label={<span className='txt_label'>Chuy??n khoa</span>}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Gi???i t??nh kh??ng ???????c ????? tr???ng',
                        //   },
                        // ]}
                        >
                          <Select
                            disabled={!editInformation}
                            showSearch
                            style={{ width: '100%' }}
                            size='middle'
                            placeholder={dataUser?.specialty ? 'Ch???n chuy??n khoa' : 'Kh??ng c?? th??ng tin'}
                            className='txt_input'
                            filterOption={(input, option) =>
                              option?.label !== null && option?.label?.toLowerCase().includes(input.trim().toLowerCase())
                            }
                          >
                            {optionsSpecialty.length && optionsSpecialty.map((item) => (
                              <Option key={item.id} value={item.id} label={item.name}>
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
                  )}
                  
                </div>
              </div>
    </div>
  )
}

export default TabInformation;
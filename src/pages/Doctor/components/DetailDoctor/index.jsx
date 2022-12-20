import { PlusOutlined, SettingFilled } from '@ant-design/icons';
import { Avatar, Button, Col, DatePicker, Form, Image, Input, message, Row, Select, Space, Spin, Tabs, Upload } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClinicApis from '../../../../apis/Clinic';
import SpecialtyApis from '../../../../apis/Specialty';
import UserApis from '../../../../apis/User';
import BackIcon from '../../../../components/Icon/Common/BackIcon';
import './index.scss';

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
    key: 'ORTHER',
    value: 'Khác'
  }
]

const listRole = [
  {
    key: 'HEAD_OF_DOCTOR',
    value: 'Trưởng khoa'
  },
  {
    key: 'DOCTOR',
    value: 'Bác sĩ'
  },
  {
    key: 'MANAGER_CLINIC',
    value: 'Quản lý phòng khám'
  }
]

const DetailDoctor = () => {
  const [dataDoctor, setDataDoctor] = useState({});
  const [dataDoctorRes, setDataDoctorRes] = useState({});
  const [form] = Form.useForm();
  const [optionsClinic, setOptionsClinic] = useState([]);
  const [optionsSpecialty, setOptionsSpecialty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editInformation, setEditInformation] = useState(false);
  const [fileListAvatar, setFileListAvatar] = useState([]);

  let { doctorId } = useParams();

  useEffect(() => {
    document.title = 'Thông tin bác sĩ';
  }, [])

  useEffect(() => {
    if (doctorId)
      getInfoDoctor(doctorId);
    getListClinic();
    getListSpecialty();
  }, [doctorId])

  const getInfoDoctor = async (doctorId) => {
    setLoading(true);
    try {
      const dataRes = await UserApis.getUserById(doctorId);
      console.log('dataRes: ', dataRes);
      if (dataRes.status === 200) {
        const { data } = dataRes
        setDataDoctor({
          id: data.id,
          firstName: data?.firstName || '',
          middleName: data?.middleName || '',
          lastName: data?.lastName || '',
          email: data?.email || '',
          gender: data?.gender || null,
          phoneNumber: data?.phoneNumber || '',
          birthday: data?.birthday || '',
          address: data?.address || '',
          role: data.role || '',
          clinic: data.clinic ? data.clinic.id : '',
          specialty: data.specialty ? data.specialty.name : '',
          avatar: data.avatar || '',
          // avatar: data?.avatar ? [{
          //   uid: '-1',
          //   name: 'image.jpg',
          //   status: 'done',
          //   url: `http://14.225.255.59:8000/${data.avatar}`
          // }] : [],
        });
        setFileListAvatar(data?.avatar ? [{
          uid: '-1',
          name: 'image.jpg',
          status: 'done',
          url: `http://14.225.255.59:8000/${data.avatar}`
        }] : []);

        form.setFieldsValue({
          firstName: data?.firstName || '',
          middleName: data?.middleName || '',
          lastName: data?.lastName || '',
          email: data?.email || '',
          gender: data?.gender || null,
          phoneNumber: data?.phoneNumber || '',
          birthday: data?.birthday ? moment(data?.birthday) : null,
          address: data?.address || '',
          role: data.role || '',
          clinicId: data?.clinic ? data.clinic?.id : null,
          specialtyId: data?.specialty ? data.specialty?.id : null,
          avatar: data?.avatar || null,
        })
        setDataDoctorRes(data);
        setLoading(false);
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  const getListClinic = async () => {
    setLoading(true);
    try {
      const dataRes = await ClinicApis.getClinics({
        pages: 1,
        take: 100,
        active: true,
      })
      // console.log('dataRes: ', dataRes);
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
      const dataRes = await SpecialtyApis.getListSpecialty({
        pages: 1,
        take: 100,
      })
      // console.log('dataRes: ', dataRes);
      if (dataRes?.data?.data) {
        const { data } = dataRes?.data;
        const listSpecialty = data?.map(item => {
          return {
            id: item.id,
            name: item.name,
          }
        })
        setOptionsSpecialty(listSpecialty || [])
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
      setOptionsSpecialty([]);
    }
  }

  const handleBack = () => {
    // const partName = location.pathname.split('/').slice(0, 3).join('/');
    // console.log('partName: ', partName);
    // history.push(partName);
    window.history.back();
  }

  const handleChangSelectClinic = async (value) => {
    try {
      const dataSpecialty = await SpecialtyApis.getSpecialtyByClinic(value);
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
      console.log('error: ', error);
      setOptionsSpecialty([]);
      form.setFieldsValue({
        specialtyId: undefined
      })
    }
  }

  const onChangeAvatar = ({ fileList: newFileList }) => {
    console.log('newFileList: ', newFileList);
    setFileListAvatar(newFileList);
  };

  const handleUpdateDoctor = (value) => {
    console.log('value: ', value);
    let newData = [];
    if (value.avatar === dataDoctor.avatar || value.avatar.fileList.length === 0) {
      console.log('ok');
      newData = value;
    } else if (value.avatar.fileList.length > 0) {
      const fileSize = value?.avatar?.fileList[0]?.size;
      const isLt2M = fileSize / 1024 / 1024 < 2;
      console.log('isLt2M: ', isLt2M);
      if (!isLt2M) {
        message.error('Chọn ảnh nhỏ hơn 2MB!');
      }
      let formData = new FormData();
      for (const item in value) {
        if (item === 'avatar') {
          formData.append('file', value[item].fileList[0]?.originFileObj);
        }
        formData.append(item, value[item]);
      }
      newData = formData;
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
          <div className='header_detail_doctor'>
            <Space>
              <BackIcon
                onClick={handleBack}
                style={{
                  cursor: 'pointer',
                  height: '100%'
                }}
              />
              <span className='name_doctor'>
                {`${dataDoctor.firstName || ''} ${dataDoctor.middleName || ''} ${dataDoctor.lastName || ''}`.trim()}
              </span>
            </Space>
          </div>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Thông tin bác sĩ" key="doctor_information">
              <div className="doctor_information">
                <div className="header_doctor_information">
                  <div style={{ fontSize: '17px' }}>Thông tin bác sĩ</div>
                  <div className='button_edit'>
                    {!editInformation && (
                      <Button
                        type='primary'
                        onClick={() => setEditInformation(true)}
                      >
                        Chỉnh sửa thông tin bác sĩ
                      </Button>
                    )}
                  </div>
                </div>

                <div className="form_doctor_information">
                  <Form
                    name='doctor'
                    onFinish={(values) => handleUpdateDoctor(values)}
                    autoComplete='off'
                    layout='vertical'
                    form={form}
                  >
                    <Row gutter={24}>
                      <Col span={5}>
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
                            disabled={!editInformation}
                            size='middle'
                            className='txt_input'
                            placeholder={dataDoctor?.firstName ? 'Họ' : 'Không có thông tin'} />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          name={'middleName'}
                          label={<span className='txt_label'>Tên đệm</span>}
                        >
                          <Input
                            disabled={!editInformation}
                            size='middle'
                            className='txt_input'
                            placeholder={dataDoctor?.middleName ? 'Tên đệm' : 'Không có thông tin'} />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
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
                            disabled={!editInformation}
                            size='middle'
                            className='txt_input'
                            placeholder={dataDoctor?.lastName ? 'Tên' : 'Không có thông tin'} />
                        </Form.Item>
                      </Col>

                      <Col span={9}>
                        <Form.Item
                          name={'avatar'}
                          label={<span className='txt_label'>Ảnh chuyên khoa</span>}
                          rules={[
                            {
                              required: true,
                              message: 'Tên chuyên khoa không được để trống',
                            }
                          ]}
                        >
                          <Upload
                            disabled={!editInformation}
                            listType="picture-card"
                            fileList={fileListAvatar}
                            beforeUpload={() => false}
                            onChange={onChangeAvatar}
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
                            disabled={!editInformation}
                            size='middle'
                            className='txt_input'
                            placeholder={dataDoctor?.email ? 'Email' : 'Không có thông tin'} />
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
                            disabled={!editInformation}
                            style={{ width: '100%' }}
                            size='middle'
                            placeholder={dataDoctor?.gender ? 'Chọn giới tính' : 'Không có thông tin'}
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
                            disabled={!editInformation}
                            className='txt_input'
                            size='middle'
                            placeholder={dataDoctor?.phoneNumber ? 'Số điện thoại' : 'Không có thông tin'}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name={'birthday'} label={<span className='txt__label'>Ngày sinh</span>}>
                          <DatePicker
                            disabled={!editInformation}
                            picker='date'
                            showNow={false}
                            // showTime
                            placeholder={dataDoctor?.birthday ? 'Chọn ngày' : 'Không có thông tin'}
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
                          name={'role'}
                          label={<span className='txt_label'>Vai trò</span>}
                          rules={[
                            {
                              required: true,
                              message: 'Vai trò không được để trống',
                            },
                          ]}
                        >
                          <Select
                            disabled={!editInformation}
                            style={{ width: '100%' }}
                            size='middle'
                            placeholder={dataDoctor?.role ? 'Chọn vai trò' : 'Không có thông tin'}
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
                      <Col span={12}>
                        <Form.Item
                          name={'clinicId'}
                          label={<span className='txt_label'>Phòng khám</span>}
                          rules={[
                            {
                              required: true,
                              message: 'Phòng khám không được để trống',
                            },
                          ]}
                        >
                          <Select
                            disabled={!editInformation}
                            showSearch
                            style={{ width: '100%' }}
                            size='middle'
                            placeholder={dataDoctor?.clinicId ? 'Chọn phòng khám' : 'Không có thông tin'}
                            className='txt_input'
                            // optionLabelProp='label'
                            // optionFilterProp={'label'}
                            filterOption={(input, option) =>
                              option?.label !== null && option?.label?.toLowerCase().includes(input.trim().toLowerCase())
                            }
                            onChange={handleChangSelectClinic}
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
                      <Col span={12}>
                        <Form.Item
                          name={'specialtyId'}
                          label={<span className='txt_label'>Chuyên khoa</span>}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Giới tính không được để trống',
                        //   },
                        // ]}
                        >
                          <Select
                            disabled={!editInformation}
                            showSearch
                            style={{ width: '100%' }}
                            size='middle'
                            placeholder={dataDoctor?.specialtyId ? 'Chọn chuyên khoa' : 'Không có thông tin'}
                            className='txt_input'
                            filterOption={(input, option) =>
                              option?.label !== null && option?.label?.toLowerCase().includes(input.trim().toLowerCase())
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
                          Hủy chỉnh sửa
                        </Button>
                        <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
                          Cập nhật
                        </Button>
                      </Col>
                    )}
                  </Form>
                </div>
              </div>

            </Tabs.TabPane>
            <Tabs.TabPane tab="Giới thiệu về bác sĩ" key="doctor_introduce">
              Content of Tab Pane 2
              <div className="doctor_information_detail">
                chi tiêts
              </div>
            </Tabs.TabPane>
          </Tabs>

        </>
      )}

    </>
  )
}

export default DetailDoctor;
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Row, Select, Space, Spin, Tabs, Upload } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import ClinicApis from '../../../../apis/Clinic';
import SpecialtyApis from '../../../../apis/Specialty';
import UserApis from '../../../../apis/User';
import BackIcon from '../../../../components/Icon/Common/BackIcon';
import './index.scss';
import DoctorApis from '../../../../apis/Doctor';
import { toast } from 'react-toastify';
import { listGender } from '../../../../common/constants/gender';
import { listRole, listPositon, listPayment } from '../../../../common/constants/doctor';
import baseURL from '../../../../utils/url';

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

const DetailDoctor = () => {
  const [dataDoctor, setDataDoctor] = useState({});
  const [dataDoctorRes, setDataDoctorRes] = useState({});
  const [form] = Form.useForm();
  const [formIntroduce] = Form.useForm();
  const [optionsClinic, setOptionsClinic] = useState([]);
  const [optionsSpecialty, setOptionsSpecialty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editInformation, setEditInformation] = useState(false);
  const [editIntroduce, setEditIntroduce] = useState(false);
  const [fileListAvatar, setFileListAvatar] = useState([]);
  const [doctorInforId, setDoctorInforId] = useState('');
  const [dataDoctorInfo, setDataDoctorInfo] = useState({})

  let { doctorId } = useParams();

  useEffect(() => {
    document.title = 'Thông tin bác sĩ';
  }, [])

  useEffect(() => {
    if (doctorId) {
      getInfoDoctor(doctorId);
    }
    getListClinic();
    getListSpecialty();
  }, [doctorId]);

  const getInfoDoctor = async (doctorId) => {
    setLoading(true);
    try {
      const dataRes = await UserApis.getUserById(doctorId);
      // console.log('dataRes: ', dataRes);
      if (dataRes.status === 200) {
        const { data } = dataRes
        setDataDoctor({
          id: data.id,
          firstName: data?.firstName || '',
          middleName: data?.middleName || '',
          lastName: data?.lastName || '',
          email: data?.email || '',
          gender: data?.gender || null,
          phoneNumber: data?.phoneNumber || null,
          birthday: data?.birthday || '',
          address: data?.address || '',
          role: data.role || '',
          clinic: data.clinic ? data.clinic.id : '',
          specialty: data.specialty ? data.specialty.name : '',
          avatar: data.avatar || '',
          religion: data?.religion || '',
          nation: data?.nation || '',
          identityCardNumber: data?.identityCardNumber || '',
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
          url: `${baseURL}${data.avatar}`
        }] : []);

        form.setFieldsValue({
          firstName: data?.firstName || '',
          middleName: data?.middleName || '',
          lastName: data?.lastName || '',
          email: data?.email || '',
          gender: data?.gender || null,
          phoneNumber: data?.phoneNumber || null,
          birthday: data?.birthday ? moment(data?.birthday) : null,
          address: data?.address || '',
          role: data.role || '',
          clinicId: data?.clinic ? data.clinic?.id : null,
          specialtyId: data?.specialty ? data.specialty?.id : null,
          avatar: data?.avatar || null,
          religion: data?.religion || '',
          nation: data?.nation || '',
          identityCardNumber: data?.identityCardNumber || '',
        })
        setDataDoctorRes(data);
        if (data?.doctorInfor) {
          const { doctorInfor } = data;
          setDoctorInforId(data?.doctorInfor?.id || '');
          // await getInfoDoctorExtra(data?.doctorInfor || {});
          formIntroduce.setFieldsValue({
            position: doctorInfor?.position || null,
            price: doctorInfor?.price || 0,
            payment: doctorInfor?.payment || null,
            introduct: doctorInfor?.introduct || null,
            note: doctorInfor?.note || null,
            description: doctorInfor?.description || null,
          })
        }
        setLoading(false);
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  const getInfoDoctorExtra = async (doctorInforId) => {
    try {
      const dataRes = await DoctorApis.getDoctorInfoExtra(doctorInforId);
      console.log('dataRes: ', dataRes);
    } catch (error) {
      console.log('error: ', error);
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

  const handleUpdateDoctor = async (value) => {
    setLoading(true);
    let newData = [];
    if (value.avatar === dataDoctor.avatar || (!value.avatar) || (value.avatar && value?.avatar?.fileList?.length === 0)) {
      const { avatar, ...resData } = value;
      newData = resData
    } else if (value?.avatar?.fileList?.length > 0) {
      const fileSize = value?.avatar?.fileList[0]?.size;
      const isLt2M = fileSize / 1024 / 1024 < 2;
      console.log('isLt2M: ', isLt2M);
      if (!isLt2M) {
        message.error('Chọn ảnh nhỏ hơn 2MB!');
      }
      let formData = new FormData();
      const { avatar, ...resData } = value;
      console.log('resData: ', resData);
      for (const item in value) {
        if (item === 'avatar') {
          formData.append('file', value[item].fileList[0]?.originFileObj);
        }
        formData.append(item, value[item]);
      }
      // formData.append('file', avatar?.fileList[0]?.originFileObj);
      newData = formData;
    }
    console.log('newData: ', newData);

    try {
      const dataRes = await DoctorApis.updateDoctor(newData, doctorId);
      if (dataRes.status === 200) {
        setLoading(false);
        setEditInformation(false);
        toast.success('Cập nhật thông tin nhân viên thành công');
        setEditInformation(false);
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
      if (error.response.data.error === 'USER_ALREADY_EXIST' && error.response.data.status === 409) {
        toast.error('Bác sĩ đã tồn tại!');
        return;
      }
      toast.error('Cập nhật thông tin bác sĩ không thành công!');
    }
  }

  const handleUpdateDoctorIntroduce = async (values) => {
    console.log('value: ', values)
    setLoading(true);
    if (!doctorInforId && Object.keys(dataDoctorInfo).length === 0) {
      console.log('thêm');
      try {
        const dataSaveDoctorInfo = await DoctorApis.createDoctorInfor({
          ...values,
          doctorId: doctorId,
        })
        console.log('dataSaveDoctorInfo: ', dataSaveDoctorInfo);
        if (dataSaveDoctorInfo?.status === 200) {
          toast.success('Thêm giới thiệu bác sĩ thành công');
          setLoading(false);
          setEditIntroduce(false);
        }
      } catch (error) {
        console.log('error: ', error);
        toast.error('Thêm giới thiệu bác sĩ không thành công!');
        setLoading(false);
      }

    } else {
      // cCập nhật thông tin giới thiệu
      console.log('sửa');
      try {
        console.log('doctorInforId: ', doctorInforId);
        const dataSaveDoctorInfo = await DoctorApis.updateDoctorInfoExtra(values, doctorInforId);
        console.log('dataSaveDoctorInfo: ', dataSaveDoctorInfo);
        if (dataSaveDoctorInfo?.status === 200) {
          toast.success('Thay đổi thông tin giới thiệu bác sĩ thành công');
          setLoading(false);
          setEditIntroduce(false);
        }
      } catch (error) {
        console.log('error: ', error);
        toast.error('Thay đổi thông tin giới thiệu bác sĩ không thành công!');
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
          <Tabs defaultActiveKey="doctor_information">
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
                      <Col span={6}>
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
                      <Col span={6}>
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
                      <Col span={6}>
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

                      <Col span={6}>
                        <Form.Item
                          name={'avatar'}
                          label={<span className='txt_label'>Ảnh chuyên khoa</span>}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Tên chuyên khoa không được để trống',
                        //   }
                        // ]}
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

                      <Col span={6}>
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
                      <Col span={6}>
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
                      <Col span={6}>
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
                      <Col span={6}>
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

                      <Col span={8}>
                        <Form.Item
                          name={'nation'}
                          label={<span className='txt_label'>Quốc gia</span>}
                        >
                          <Input
                            disabled={!editInformation}
                            className='txt_input'
                            size='middle'
                            placeholder={dataDoctor?.nation ? 'Quốc gia' : 'Không có thông tin'}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={'religion'}
                          label={<span className='txt_label'>Tôn giáo</span>}
                        >
                          <Input
                            disabled={!editInformation}
                            className='txt_input'
                            size='middle'
                            placeholder={dataDoctor?.religion ? 'Tôn giáo' : 'Không có thông tin'}
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
                            placeholder={dataDoctor?.identityCardNumber ? 'CCCD/CMT' : 'Không có thông tin'}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={4}>
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
                      <Col span={10}>
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
                      <Col span={10}>
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
              <div className="doctor_introduce">
                <div className="header_doctor_introduce">
                  <div style={{ fontSize: '17px' }}>Giới thiệu chi tiết bác sĩ</div>
                  <div className='button_edit'>
                    {!editIntroduce && (
                      <Button
                        type='primary'
                        onClick={() => setEditIntroduce(true)}
                      >
                        {!doctorInforId ? 'Thêm giới thiệu bác sĩ' : 'Chỉnh sửa thông tin'}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="form_doctor_introduce">
                  <Form
                    name='doctor_introduce'
                    onFinish={(values) => handleUpdateDoctorIntroduce(values)}
                    autoComplete='off'
                    layout='vertical'
                    form={formIntroduce}
                  >
                    <Row gutter={24}>
                      <Col span={8}>
                        <Form.Item
                          name={'position'}
                          label={<span className='txt_label'>Chức danh</span>}
                        >
                          <Select
                            disabled={!editIntroduce}
                            style={{ width: '100%' }}
                            size='middle'
                            placeholder={true ? 'Chọn chức danh' : 'Không có thông tin'}
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
                          label={<span className='txt_label'>Giá khám</span>}
                        >
                          <InputNumber
                            defaultValue={0}
                            style={{ width: '100%' }}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/\.(?=\d{0,2}$)/g, ",")}
                            parser={(value) => value.replace(/\$\s?|(\.*)/g, "").replace(/(\,{1})/g, ".")}
                            placeholder={true ? 'Giá khám' : 'Không có thông tin'}
                            disabled={!editIntroduce}
                            className='txt_input'
                            size='middle'
                          />

                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={'payment'}
                          label={<span className='txt_label'>Phương thức thanh toán</span>}
                        >
                          <Select
                            disabled={!editIntroduce}
                            style={{ width: '100%' }}
                            size='middle'
                            placeholder={true ? 'Chọn phương thức thanh toán' : 'Không có thông tin'}
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
                          label={<span className='txt_label'>Giới thiệu</span>}
                        >
                          <TextArea
                            disabled={!editIntroduce}
                            rows={4}
                            placeholder='Giới thiệu bác sĩ'
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={'note'}
                          label={<span className='txt_label'>Ghi chú</span>}
                        >
                          <TextArea
                            disabled={!editIntroduce}
                            rows={4}
                            placeholder='Ghi chú'
                          />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item
                          name={'description'}
                          label={<span className='txt_label'>Mô tả bác sĩ</span>}
                        >
                          <ReactQuill
                            disabled={!editIntroduce}
                            theme="snow"
                            placeholder="Mô tả"
                            modules={modulesQill}
                            formats={formats}
                            // bounds={'#root'}
                            style={{ height: "500px" }}
                          />
                        </Form.Item>
                      </Col>

                      {editIntroduce && doctorInforId && (
                        <div style={{ textAlign: 'center', marginTop: '30px', width: '100%' }}>
                          <Col span={24} style={{ textAlign: 'center', marginTop: '20px !important' }}>
                            <Button className='btn_cancel' danger size='middle' onClick={() => setEditInformation(false)}>
                              Hủy chỉnh sửa
                            </Button>
                            <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
                              Cập nhật
                            </Button>
                          </Col>
                        </div>
                      )}

                      {editIntroduce && !doctorInforId && (
                        <div style={{ textAlign: 'center', marginTop: '30px', width: '100%' }}>
                          <Col span={24} >
                            <Button className='btn_cancel' danger size='middle' onClick={() => setEditInformation(false)}>
                              Hủy
                            </Button>
                            <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
                              Thêm
                            </Button>
                          </Col>
                        </div>
                      )}

                    </Row>
                  </Form>
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>

        </>
      )}

    </>
  )
}

export default DetailDoctor;
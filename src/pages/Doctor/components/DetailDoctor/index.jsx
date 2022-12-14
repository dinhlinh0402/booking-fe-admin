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
    document.title = 'Th??ng tin b??c s??';
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
      const dataRes = await SpecialtyApis.getListSpecialty({
        pages: 1,
        take: 100,
      })
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
      // console.log('isLt2M: ', isLt2M);
      if (!isLt2M) {
        message.error('Ch???n ???nh nh??? h??n 2MB!');
      }
      let formData = new FormData();
      const { avatar, ...resData } = value;
      for (const item in value) {
        if (item === 'avatar') {
          formData.append('file', value[item].fileList[0]?.originFileObj);
        }
        if (!value[item]) break;
        formData.append(item, value[item]);
      }
      // formData.append('file', avatar?.fileList[0]?.originFileObj);
      newData = formData;
    }

    try {
      const dataRes = await DoctorApis.updateDoctor(newData, doctorId);
      if (dataRes.status === 200) {
        setLoading(false);
        setEditInformation(false);
        toast.success('C???p nh???t th??ng tin b??c s?? th??nh c??ng');
        setEditInformation(false);
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
      if (error.response.data.error === 'USER_ALREADY_EXIST' && error.response.data.status === 409) {
        toast.error('B??c s?? ???? t???n t???i!');
        return;
      }
      toast.error('C???p nh???t th??ng tin b??c s?? kh??ng th??nh c??ng!');
    }
  }

  const handleUpdateDoctorIntroduce = async (values) => {
    setLoading(true);
    if (!doctorInforId && Object.keys(dataDoctorInfo).length === 0) {
      try {
        const dataSaveDoctorInfo = await DoctorApis.createDoctorInfor({
          ...values,
          doctorId: doctorId,
        })
        if (dataSaveDoctorInfo?.status === 200) {
          toast.success('Th??m gi???i thi???u b??c s?? th??nh c??ng');
          setLoading(false);
          setEditIntroduce(false);
        }
      } catch (error) {
        console.log('error: ', error);
        toast.error('Th??m gi???i thi???u b??c s?? kh??ng th??nh c??ng!');
        setLoading(false);
      }

    } else {
      // cC???p nh???t th??ng tin gi???i thi???u
      try {
        const dataSaveDoctorInfo = await DoctorApis.updateDoctorInfoExtra(values, doctorInforId);
        if (dataSaveDoctorInfo?.status === 200) {
          toast.success('Thay ?????i th??ng tin gi???i thi???u b??c s?? th??nh c??ng');
          setLoading(false);
          setEditIntroduce(false);
        }
      } catch (error) {
        console.log('error: ', error);
        toast.error('Thay ?????i th??ng tin gi???i thi???u b??c s?? kh??ng th??nh c??ng!');
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
            <Tabs.TabPane tab="Th??ng tin b??c s??" key="doctor_information">
              <div className="doctor_information">
                <div className="header_doctor_information">
                  <div style={{ fontSize: '17px' }}>Th??ng tin b??c s??</div>
                  <div className='button_edit'>
                    {!editInformation && (
                      <Button
                        type='primary'
                        onClick={() => setEditInformation(true)}
                      >
                        Ch???nh s???a th??ng tin b??c s??
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
                            placeholder={dataDoctor?.firstName ? 'H???' : 'Kh??ng c?? th??ng tin'} />
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
                            placeholder={dataDoctor?.middleName ? 'T??n ?????m' : 'Kh??ng c?? th??ng tin'} />
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
                            placeholder={dataDoctor?.lastName ? 'T??n' : 'Kh??ng c?? th??ng tin'} />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          name={'avatar'}
                          label={<span className='txt_label'>???nh chuy??n khoa</span>}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'T??n chuy??n khoa kh??ng ???????c ????? tr???ng',
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
                            placeholder={dataDoctor?.email ? 'Email' : 'Kh??ng c?? th??ng tin'} />
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
                            placeholder={dataDoctor?.gender ? 'Ch???n gi???i t??nh' : 'Kh??ng c?? th??ng tin'}
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
                            placeholder={dataDoctor?.phoneNumber ? 'S??? ??i???n tho???i' : 'Kh??ng c?? th??ng tin'}
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
                            placeholder={dataDoctor?.birthday ? 'Ch???n ng??y' : 'Kh??ng c?? th??ng tin'}
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
                            placeholder={dataDoctor?.nation ? 'Qu???c gia' : 'Kh??ng c?? th??ng tin'}
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
                            placeholder={dataDoctor?.religion ? 'T??n gi??o' : 'Kh??ng c?? th??ng tin'}
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
                            placeholder={dataDoctor?.identityCardNumber ? 'CCCD/CMT' : 'Kh??ng c?? th??ng tin'}
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
                            disabled={!editInformation}
                            style={{ width: '100%' }}
                            size='middle'
                            placeholder={dataDoctor?.role ? 'Ch???n vai tr??' : 'Kh??ng c?? th??ng tin'}
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
                            disabled={!editInformation}
                            showSearch
                            style={{ width: '100%' }}
                            size='middle'
                            placeholder={dataDoctor?.clinicId ? 'Ch???n ph??ng kh??m' : 'Kh??ng c?? th??ng tin'}
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
                            placeholder={dataDoctor?.specialtyId ? 'Ch???n chuy??n khoa' : 'Kh??ng c?? th??ng tin'}
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
                          H???y ch???nh s???a
                        </Button>
                        <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
                          C???p nh???t
                        </Button>
                      </Col>
                    )}
                  </Form>
                </div>
              </div>

            </Tabs.TabPane>
            <Tabs.TabPane tab="Gi???i thi???u v??? b??c s??" key="doctor_introduce" disabled={dataDoctor && dataDoctor.role === 'MANAGER_CLINIC'}>
              <div className="doctor_introduce">
                <div className="header_doctor_introduce">
                  <div style={{ fontSize: '17px' }}>Gi???i thi???u chi ti???t b??c s??</div>
                  <div className='button_edit'>
                    {!editIntroduce && (
                      <Button
                        type='primary'
                        onClick={() => setEditIntroduce(true)}
                      >
                        {!doctorInforId ? 'Th??m gi???i thi???u b??c s??' : 'Ch???nh s???a th??ng tin'}
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
                            className={!editIntroduce ? 'react_quill_disable' : ''}
                            theme="snow"
                            placeholder="M?? t???"
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
                            <Button className='btn_cancel' danger size='middle' onClick={() => setEditIntroduce(false)}>
                              H???y ch???nh s???a
                            </Button>
                            <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
                              C???p nh???t
                            </Button>
                          </Col>
                        </div>
                      )}

                      {editIntroduce && !doctorInforId && (
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
            </Tabs.TabPane>
          </Tabs>

        </>
      )}

    </>
  )
}

export default DetailDoctor;
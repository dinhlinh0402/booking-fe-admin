import React, { useState } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Spin, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import './CreateEdit.scss';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SpecialtyApis from "../../../apis/Specialty";
import { useEffect } from "react";
import baseURL from "../../../utils/url";

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
const CreateEditSpecialty = ({
  isShowModal,
  handleCancelModal,
  type,
  dataUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileListImage, setFileListImage] = useState([]);

  useEffect(() => {
    if (type === 'update' && Object.keys(dataUpdate).length) {
      form.setFieldsValue({
        name: dataUpdate?.name || null,
        image: dataUpdate?.image || null,
        description: dataUpdate?.description || null,
      });
      setFileListImage(dataUpdate?.image ? [{
        uid: '-1',
        name: 'image.jpg',
        status: 'done',
        url: `${baseURL}${dataUpdate.image}`,
      }] : [])
    }
  }, [type, dataUpdate])

  const handleSubmitSpecialty = async (value) => {
    console.log('value: ', value);
    setLoading(true);
    if (type === 'create' && Object.keys(dataUpdate).length === 0) {
      const fileSize = value?.image?.fileList[0]?.size;
      const isLt2M = fileSize / 1024 / 1024 < 2;
      console.log('isLt2M: ', isLt2M);
      if (!isLt2M) {
        message.error('Chọn ảnh nhỏ hơn 2MB!');
      }
      try {
        let formData = new FormData();
        formData.append('file', value?.image?.fileList[0]?.originFileObj);
        formData.append('name', value?.name);
        formData.append('description', value?.description);
        const dataRes = await SpecialtyApis.createSpecialty(formData);
        if (dataRes.status === 200) {
          setLoading(false);
          toast.success('Thêm chuyên khoa thành công');
          handleCancelModal();
          form.setFieldsValue({
            name: '',
            image: null,
            description: '',
          })
        }
      } catch (error) {
        console.log('error: ', error);
        setLoading(false);
        toast.error('Thêm chuyên khoa không thành công!');
      }
    } else if (type === 'update' && Object.keys(dataUpdate).length) {
      console.log('update');
      let newData = {};
      if (value.image === dataUpdate.image || (!value.image) || (value.image && value?.image?.fileList?.length === 0)) {
        const { image, ...res } = value;
        newData = res;
      } else if (value?.image?.fileList?.length > 0) {
        const fileSize = value?.image?.fileList[0]?.size;
        const isLt2M = fileSize / 1024 / 1024 < 2;
        // console.log('isLt2M: ', isLt2M);
        if (!isLt2M) {
          message.error('Chọn ảnh nhỏ hơn 2MB!');
          return;
        }
        let formData = new FormData();
        for (const item in value) {
          if (item === 'image') {
            formData.append('file', value[item].fileList[0]?.originFileObj);
          } else {
            formData.append(item, value[item]);
          }
        }
        newData = formData;
      }
      try {
        const updateSpecialty = await SpecialtyApis.updateSpecialty(dataUpdate.id, newData);
        console.log('updateSpecialty: ', updateSpecialty);
        if (updateSpecialty.status === 200) {
          setLoading(false);
          toast.success('Cập nhật thông tin chuyên khoa thành công');
          handleCancelModal();
          form.resetFields();
          setFileListImage([]);
        }
      } catch (error) {
        console.log('error: ', error);
        setLoading(false);
        toast.error('Cập nhật thông tin chuyên khoa không thành công!')
      }
    }
  }

  const onChangeImage = ({ fileList: newFileList }) => {
    setFileListImage(newFileList);
  };

  return (
    <Modal
      className='create_modal'
      title={
        <>
          <div>{type === 'create' ? 'Thêm chuyên khoa' : 'Sửa thông tin chuyên khoa'}</div>
        </>
      }
      open={isShowModal}
      onCancel={() => {
        if (!loading) {
          handleCancelModal();
          form.resetFields();
        }
      }}
      height={550}
      width={700}
      footer={false}
    >
      <Spin spinning={loading}>
        <Form
          name='user'
          onFinish={(values) => handleSubmitSpecialty(values)}
          autoComplete='off'
          layout='vertical'
          form={form}
        >
          <div style={{ height: '400px', overflowY: 'auto', overflowX: 'hidden' }}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name={'name'}
                  label={<span className='txt_label'>Tên chuyên khoa</span>}
                  rules={[
                    {
                      required: true,
                      message: 'Tên chuyên khoa không được để trống',
                    }
                  ]}
                >
                  <Input
                    size='middle'
                    className='txt_input'
                    placeholder={'Tên Chuyên khoa'} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name={'image'}
                  label={<span className='txt_label'>Ảnh chuyên khoa</span>}
                  rules={[
                    {
                      required: (type === 'update' && Object.keys(dataUpdate).length) ? false : true,
                      message: 'Ảnh chuyên khoa không được để trống',
                    }
                  ]}
                >
                  <Upload
                    listType="picture-card"
                    beforeUpload={() => false}
                    fileList={fileListImage}
                    onChange={onChangeImage}
                    maxCount={1}
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
                <Col span={24}>
                  <Form.Item
                    name={'description'}
                    label={<span className='txt_label'>Mô tả chuyên khoa</span>}
                    rules={[
                      {
                        required: true,
                        message: 'Mô tả chuyên khoa không được để trống',
                      }
                    ]}
                  >
                    <ReactQuill
                      theme="snow"
                      placeholder="Mô tả"
                      modules={modulesQill}
                      formats={formats}
                      // bounds={'#root'}
                      style={{ height: "300px" }}
                    />
                  </Form.Item>
                </Col>

              </Col>
            </Row>
          </div>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button className='btn_cancel' danger size='middle' onClick={() => handleCancelModal()}>
              Hủy
            </Button>
            <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
              {type === 'create' ? 'Thêm chuyên khoa' : 'Cập nhật'}
            </Button>
          </Col>
        </Form>
      </Spin>
    </Modal >
  )

}


export default CreateEditSpecialty;
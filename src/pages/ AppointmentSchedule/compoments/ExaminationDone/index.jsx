import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, message, Modal, Row, Spin, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import './index.scss';

const { TextArea } = Input;

const ExaminationDone = ({
  showModal,
  handleCancelModal,
  detailPatient
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (detailPatient) {
      form.setFieldsValue({
        name: detailPatient?.name || '',
        email: detailPatient?.email || '',
        note: detailPatient?.note || '',
      })
    }
  }, [detailPatient])



  const handleUploadFile = ({ file, fileList }) => {
    const typeFile = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const checkFile = typeFile.includes(file.type);
    if (!checkFile) {
      message.error('Bạn chỉ có thể tải lên file doc, docx hoặc pdf!');
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('File phải nhỏ hơn 2MB!');
      return;
    }
    return checkFile;
  };

  const handleSubmit = (values) => {
    console.log(values);
    const { file, fileList } = values.file;
    const typeFile = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const checkFile = typeFile.includes(file.type);
    if (!checkFile) {
      message.error('Bạn chỉ có thể tải lên file doc, docx hoặc pdf!');
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('File phải nhỏ hơn 2MB!');
      return;
    }
    try {
      let formData = new FormData();
      for (const item in values) {
        if (item === 'file') {
          formData.append('file', values[item].fileList[0]?.originFileObj);
        } else if (!values[item]) break;
        else formData.append(item, values[item]);
      }

      console.log('asdasd: ', formData.get('name'));
    } catch (error) {
      console.log('error: ', error);
      toast.error('Gửi đơn thuốc không thành công!')
    }
  }

  return (
    <Modal
      className='prescription_modal'
      title={
        <>
          <div>Đơn thuốc</div>
        </>
      }
      open={showModal}
      onCancel={() => {
        if (!loading) {
          handleCancelModal();
          form.resetFields()
        }
      }}
      width={700}
      footer={false}
    >
      <Spin spinning={loading}>
        <Form
          name='patient'
          onFinish={(values) => handleSubmit(values)}
          autoComplete='off'
          layout='vertical'
          form={form}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name={'name'}
                label={<span className='txt_label'>Tên bệnh nhân</span>}
              >
                <Input
                  disabled
                  size='middle'
                  className='txt_input'
                  placeholder={'Tên bệnh nhân'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'email'}
                label={<span className='txt_label'>Email</span>}
              >
                <Input
                  disabled
                  size='middle'
                  className='txt_input'
                  placeholder={'Email'} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name={'note'}
                label={<span className='txt_label'>Ghi chú của bác sĩ</span>}
              >
                <TextArea
                  rows={4}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name={'file'}
                label={<span className='txt_label'>File đơn thuốc</span>}
                rules={[
                  {
                    required: true,
                    message: 'File đơn thuốc không thể thiếu!'
                  },
                ]}
              >
                <Upload
                  beforeUpload={() => false}
                  multiple={false}
                  maxCount={1}
                // onChange={handleUploadFile}
                >
                  <Button icon={<UploadOutlined />}>Chọn File</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button className='btn_cancel' danger size='middle' onClick={() => handleCancelModal()}>
              Hủy
            </Button>

            <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
              Lưu
            </Button>

          </Col>
        </Form>
      </Spin>
    </Modal>
  )
}

export default ExaminationDone;
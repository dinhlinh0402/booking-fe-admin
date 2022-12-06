import React, { useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Spin } from "antd";
const { TextArea } = Input;

// import { toast } from 'react-toastify';

const CreateEditSpecialty = ({
  isShowModal,
  handleCancelModal,
  type,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleAddNewSpecialty = (value) => {
    console.log('value: ', value);
  }

  return (
    <Modal
      className='create_modal'
      title={
        <>
          <div>{type === 'create' ? 'Thêm chuyên khoa' : 'Sửa thông tin chuyên khoa'}</div>
        </>
      }
      visible={isShowModal}
      onCancel={() => {
        !loading && handleCancelModal()
      }}
      width={700}
      footer={false}
    >
      <Spin spinning={loading}>
        <Form
          name='user'
          onFinish={(values) => handleAddNewSpecialty(values)}
          autoComplete='off'
          layout='vertical'
          form={form}
        >
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
          </Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button className='btn_cancel' danger size='middle' onClick={() => handleCancelModal()}>
              Hủy
            </Button>
            <Button className='btn_add' size='middle' htmlType='submit' type='primary'>
              {type === 'create' ? 'Thêm chuyên khoa' : 'Lưu'}
            </Button>
          </Col>
        </Form>
      </Spin>
    </Modal >
  )

}

export default CreateEditSpecialty;
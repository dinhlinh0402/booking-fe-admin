import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Spin } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import BookingApis from "../../../apis/Bookings";
import './DetailPatient.scss';

const { TextArea } = Input;

const DetailPatient = ({
  detailPatient,
  showModal,
  handleCancelModal,
  disabledBtnSave
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (detailPatient) {
      form.setFieldsValue({
        name: detailPatient.name,
        email: detailPatient.email,
        reason: detailPatient.reason,
        note: detailPatient.doctorNote,
      })
    }
  }, [detailPatient]);

  const handleSubmit = async (values) => {
    console.log('value: ', values);

    try {
      const { note, ...res } = values;
      const dataRes = await BookingApis.updateBooking({ userNote: note }, detailPatient.idBooking);
      console.log('dataRes: ', dataRes);

    } catch (error) {
      console.log('error: ', error);
      toast.error('Thêm ghi chú không thành công!');
    }
  }
  return (
    <Modal
      className='detail_modal'
      title={
        <>
          <div>Chi tiết</div>
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
                name={'reason'}
                label={<span className='txt_label'>Lý do khám</span>}
              >
                <TextArea
                  disabled
                  rows={4}
                  placeholder='lý do'
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name={'note'}
                label={<span className='txt_label'>Ghi chú của bác sĩ</span>}
                rules={[
                  {
                    required: true,
                    message: 'Ghi chú không được để trống'
                  }
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder='Ghi chú của bác sĩ'
                />
              </Form.Item>
            </Col>
          </Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button className='btn_cancel' danger size='middle' onClick={() => handleCancelModal()}>
              Hủy
            </Button>

            <Button disabled={disabledBtnSave} className='btn_add' size='middle' htmlType='submit' type='primary'>
              Lưu
            </Button>

          </Col>
        </Form>
      </Spin>
    </Modal>
  )
}

export default DetailPatient;
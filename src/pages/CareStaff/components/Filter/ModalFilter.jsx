import React from 'react';
import './isModalCreate.scss';

const ModalFilter = () => {

  return (
    <Modal
      className='create_modal'
      title={
        <>
          <div>Bộ lọc</div>
        </>
      }
      visible={isShowModal}
      onCancel={() => handleCancelModal()}
      width={700}
      footer={false}
    >
      <Form>
        <Row gutter={24}>
          <Col span={12}>
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
                size='middle'
                className='txt_input'
                placeholder={'Họ'} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalFilter;
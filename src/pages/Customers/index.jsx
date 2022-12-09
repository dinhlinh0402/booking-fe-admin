import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, PlusCircleOutlined, FilterOutlined, WarningFilled } from '@ant-design/icons';
import { Alert, Button, Input, Modal, Space, Table, Typography } from 'antd';
import './index.scss';
import CustomerApis from '../../apis/Customer';
import AddEditUser from './components/AddEditUser';
import Stroke from '../../components/Icon/CareStaff/Stoke';
import { toast } from 'react-toastify';
import UserApis from '../../apis/User';
const { Text } = Typography;

const Customer = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [dataRes, setDataRes] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const typingSearch = useRef(null);
  const [isModalAdd, setModalAdd] = useState(false);
  const [isShowModalDelete, setShowModalDelete] = useState(false);

  useEffect(() => {
    if (!isModalAdd || !isShowModalDelete)
      getListUser();
  }, [pagination, search, isModalAdd, isShowModalDelete])

  const getListUser = async () => {
    setLoading(true);
    try {
      const dataRes = await CustomerApis.getCustomer({
        page: pagination.page,
        take: pagination.pageSize,
        role: 'USER',
        q: search || undefined,
      });
      if (dataRes?.data?.data.length) {

        const listUser = dataRes?.data?.data.map(item => {
          const name = `${item.firstName ? item.firstName : ''} ${item.middleName ? item.middleName : ''} ${item.lastName ? item.lastName : ''}`;
          return {
            id: item.id || '',
            name: name || '',
            email: item.email || '',
            gender: item.gender === 'FEMALE' ? 'Nữ' : item.gender === 'MALE' ? 'Nam' : 'Khác' || '',
            phoneNumber: item.phoneNumber || '',
            count: 0 || '',
            address: item.address || '',
            identityCardNumber: item.identityCardNumber || '',
          }
        })
        setListUser(listUser || []);
        setDataRes(dataRes?.data ? dataRes?.data : {});
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (value) => (
        <div>{value}</div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      width: 120,
      render: (value) => (
        <div className='three_dot'>{value}</div>
      ),
    },
    {
      title: 'Số lần khám',
      dataIndex: 'count',
      key: 'count',
      width: '10%'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: '10%'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: '10%'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      width: 120,
      render: (value) => (
        <div className='three_dot'>{value}</div>
      ),
    },
    {
      title: 'CCCD/CMT',
      dataIndex: 'identityCardNumber',
      key: 'identityCardNumber',
      ellipsis: true,
      width: 60,
      render: (value) => (
        <div className='three_dot'>{value}</div>
      ),
    }
  ];
  // console.log('pagination: ', pagination);
  const handleSearch = (e) => {
    if (typingSearch.current) {
      clearTimeout(typingSearch.current);
    }
    typingSearch.current = setTimeout(() => {
      setSearch(e.target.value);
    }, 500)
  }

  const handleDeleteCustomer = async () => {
    try {
      if (selectedRowKeys.length > 0) {
        const dataRes = await UserApis.deleteUser({
          userIds: selectedRowKeys,
        })
        if (dataRes?.data === true && dataRes?.status === 200) {
          toast.success('Xoá khách hàng thành công!');
        }
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error('Xoá khách hàng không thành công!');
    }
    setShowModalDelete(false);
    setSelectedRowKeys([]);
  };

  return (
    <div>
      <h1>Danh sách khách hàng</h1>
      {/* <div>Customer</div> */}
      <div className='header-customer'>
        <Input
          className='search-customer'
          size="large"
          placeholder="Tìm kiếm"
          suffix={<SearchOutlined />}
          onChange={(e) => handleSearch(e)}
        />
        <div className='list-button'>
          <Button className='button' size="large" icon={<FilterOutlined />}>Lọc</Button>
          <Button
            className='button'
            size="large"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setModalAdd(true)}
          >
            Thêm mới
          </Button>
        </div>
      </div>

      {selectedRowKeys.length > 0 && (
        <Alert
          className='fontSizeAlert'
          message={
            <div>
              <Space>
                <span>Đã chọn: {selectedRowKeys.length}</span>

                <Button
                  className='btn_active'
                  icon={<Stroke className='transformY_2' />}
                  onClick={() => {
                    setShowModalDelete(true);
                  }}
                >
                  <span className='ml_8'>Xóa</span>
                </Button>
              </Space>
            </div>
          }
        />
      )}

      <Table
        loading={isLoading}
        rowKey={'id'}
        dataSource={listUser}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
        pagination={{
          current: dataRes?.meta?.page || 1, // so trang
          total: dataRes?.meta?.itemCount, // tong tat ca 
          defaultPageSize: dataRes?.meta?.take || 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          locale: { items_per_page: ' kết quả/trang' },
          onChange: (page, pageSize) => {
            setPagination({
              ...pagination,
              page,
              pageSize,
            });
          },
        }}
        scroll={{ x: 'max-content' }}
      />
      {isModalAdd && (
        <AddEditUser
          isShowModal={isModalAdd}
          handleCancelModal={() => setModalAdd(false)}
          type={'create'}
        />
      )}

      <Modal
        visible={isShowModalDelete}
        onOk={handleDeleteCustomer}
        onCancel={() => setShowModalDelete(false)}
        cancelText={'Hủy'}
        okText={'Xóa'}
        className='confirm_delete_label'
        width={370}
      >
        <h2 style={{ color: '#595959', fontWeight: 700, textAlign: 'center' }}>
          Bạn có muốn xóa khách hàng?
        </h2>
        {/* <Space direction='vertical'>
          <Text>
            Sau khi xóa nhãn, hệ thống sẽ tự động gỡ nhãn khỏi các lượt tương tác đã được gắn nhãn
            trước đây.
            <br /> Vui lòng cân nhắc trước khi xóa.
          </Text>

          <div style={{ background: '#fdefe4', padding: '10px', borderRadius: '3px' }}>
            <Text style={{ fontWeight: 600, color: '#e59935' }}>
              <WarningFilled /> Lưu ý:
              <br />
            </Text>
            <Text>Các nhãn tạo từ Facebook được hệ thống tự động đồng bộ, không thể xóa.</Text>
          </div>
        </Space> */}
      </Modal>
    </div>
  );
}

export default Customer;
import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, PlusCircleOutlined, FilterOutlined } from '@ant-design/icons';
import { Button, Input, Table } from 'antd';
import './index.scss';
import CustomerApis from '../../apis/Customer';
import AddEditUser from './components/AddEditUser';

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

  useEffect(() => {
    if (!isModalAdd)
      getListUser();
  }, [pagination, search, isModalAdd])

  const getListUser = async () => {
    setLoading(true);
    try {
      const dataRes = await CustomerApis.getCustomer({
        page: pagination.page,
        take: pagination.pageSize,
        name: search || undefined,
        role: 'USER'
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
    </div>
  );
}

export default Customer;
import { FilterOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Table } from 'antd';
import React, { useRef, useState } from 'react';
import CreateStaff from './components/CreateStaff';
import './index.scss';

const CareStaff = () => {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState('');
  const typingSearch = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [isModalCreate, setModalCreate] = useState(true);

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

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

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
      <h1>Danh sách bác sĩ</h1>

      <div className="header_staff">
        <Input
          className='search_staff'
          size="large"
          placeholder="Tìm kiếm"
          suffix={<SearchOutlined />}
        // onChange={(e) => handleSearch(e)}
        />
        <div className='list_button'>
          <Button className='button' size="large" icon={<FilterOutlined />}>Lọc</Button>
          <Button
            className='button'
            size="large"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setModalCreate(true)}
          >
            Thêm mới
          </Button>
        </div>
      </div>

      <Table
        // loading={isLoading}
        rowKey={'id'}
        // dataSource={listUser}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
        pagination={{
          current: 1, // so trang
          total: 10, // tong tat ca 
          defaultPageSize: 10,
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

      <CreateStaff
        isShowModal={isModalCreate}
        type={'create'}
        handleCancelModal={() => setModalCreate(false)}
      />
    </div>
  )
}

export default CareStaff;
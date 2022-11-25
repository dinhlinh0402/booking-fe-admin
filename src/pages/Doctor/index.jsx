import { FilterOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Table } from 'antd';
import React, { useRef, useState } from 'react';
import CreateDoctor from './components/CreateDoctor';
import './index.scss';

const Doctor = () => {

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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true,
      width: 50,
      fixed: true,
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 100,
      fixed: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Tên phòng khám',
      dataIndex: 'clinicName',
      key: 'clinicName',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'specialty',
      key: 'specialty',
      ellipsis: true,
      width: 100,
    }
  ]

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

      <div className="header_doctor">
        <Input
          className='search_doctor'
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

      <CreateDoctor
        isShowModal={isModalCreate}
        handleCancelModal={() => setModalCreate(false)}
      />
    </div>
  )
}

export default Doctor;
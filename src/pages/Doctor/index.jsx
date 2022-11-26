import { DownOutlined, FilterOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Input, Space, Table } from 'antd';
import React, { useRef, useState } from 'react';
import FilterObjDropDown from '../../components/Filter/FilterObjDropDown';
import FilterIcon from '../../components/Icon/CareStaff/Doctor/FilterIcon';
import CreateDoctor from './components/CreateDoctor';
import './index.scss';

const listRole = [
  {
    key: 'HEAD_OF_DOCTOR',
    name: 'Trưởng khoa'
  },
  {
    key: 'DOCTOR',
    name: 'Bác sĩ'
  },
  {
    key: 'MANAGER_CLINIC',
    name: 'Quản lý phòng khám'
  }
]

const listStatus = [
  {
    key: 0,
    name: 'Khoá'
  },
  {
    key: 1,
    name: 'Kích hoạt'
  },
]

const Doctor = () => {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState('');
  const typingSearch = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [isModalCreate, setModalCreate] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [plainOptions, setPlainOptions] = useState({

  })
  const [checkedList, setCheckedList] = useState({
    role: [],
    status: [],
    clinic: [],
    specialty: [],
  })


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

  const handleCheck = (key, value) => {
    setCheckedList({
      ...checkedList,
      [key]: value,
    });
  };

  const handleCheckAll = (key, value) => {
    setCheckedList({
      ...checkedList,
      [key]: value,
    });
  };

  const handleSearch = (e) => {
    if (typingSearch.current) {
      clearTimeout(typingSearch.current);
    }
    typingSearch.current = setTimeout(() => {
      setSearch(e.target.value);
    }, 500)
  }


  const items = [
    {
      label: <a href="https://www.antgroup.com">1st menu item</a>,
      key: '0',
    },
    {
      label: <a href="https://www.aliyun.com">2nd menu item</a>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: '3rd menu item',
      key: '3',
    },
  ];

  return (
    <div>
      <h1>Danh sách bác sĩ</h1>

      <div className="header_doctor">
        <Space>
          <Button
            id={'btn__filter'}
            icon={
              <FilterIcon
                style={{
                  transform: 'translateY(2px)',
                  fill: `${showFilter ? '#3863EF' : 'none'}`,
                }}
              />
            }
            onClick={() => setShowFilter(!showFilter)}
          />
          <Input
            className='search_doctor'
            size="large"
            placeholder="Tìm kiếm"
            suffix={<SearchOutlined />}
          // onChange={(e) => handleSearch(e)}
          />
        </Space>

        <div className='list_button'>
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

      {/* Bộ lọc */}
      {showFilter && (
        <Space
          size={24}
          style={{ marginTop: '10px', marginBottom: '20px', color: 'rgba(17, 17, 17, 0.45)' }}
        >
          <FilterObjDropDown
            displayName={'Trạng thái'}
            placeholder={'Trạng thái'}
            placeholderSearch={false}
            plainOptions={listStatus || []}
            checkedList={checkedList.status}
            keyFilter={'status'}
            handleCheckAll={handleCheckAll}
            handleCheck={handleCheck}
          />
          <FilterObjDropDown
            displayName={'Vai trò'}
            placeholder={'Vai trò'}
            placeholderSearch={false}
            plainOptions={listRole || []}
            checkedList={checkedList.role}
            keyFilter={'role'}
            handleCheckAll={handleCheckAll}
            handleCheck={handleCheck}
          />

          <FilterObjDropDown
            displayName={'Phòng khám'}
            placeholder={'Phòng khám'}
            placeholderSearch={false}
            plainOptions={listRole || []}
            checkedList={checkedList.clinic}
            keyFilter={'clinic'}
            handleCheckAll={handleCheckAll}
            handleCheck={handleCheck}
          />

          <FilterObjDropDown
            displayName={'Chuyên khoa'}
            placeholder={'Chuyên khoa'}
            placeholderSearch={false}
            plainOptions={listRole || []}
            checkedList={checkedList.specialty}
            keyFilter={'specialty'}
            handleCheckAll={handleCheckAll}
            handleCheck={handleCheck}
          />

        </Space>
      )}

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
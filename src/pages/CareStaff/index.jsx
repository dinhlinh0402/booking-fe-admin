import { EyeInvisibleOutlined, EyeOutlined, FilterOutlined, PlusCircleOutlined, PushpinOutlined, ReconciliationFilled, SearchOutlined } from '@ant-design/icons';
import { Alert, Button, Input, Space, Switch, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import CreateStaff from './components/CreateStaff';
import './index.scss';
import CareStaffApis from '../../apis/CareStaff';
import moment from 'moment';
import Stroke from '../../components/Icon/CareStaff/Stoke';

const CareStaff = () => {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalCreate, setModalCreate] = useState(false);
  const [dataResponse, setDataResponse] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [listCareStaff, setListStaff] = useState([]);
  const [showBtn, setShowBtn] = useState([]);
  const typingSearch = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    getListCareStaff()
  }, [pagination, search, isModalCreate])

  useEffect(() => {
    const checkShow = [];
    selectedRowKeys.forEach((item) => {
      const label = listCareStaff?.find((elm) => elm.id === item);
      if (label) checkShow.push(label);
    });
    const btnArray = [];
    if (checkShow.some((item) => item.status === 1)) {
      btnArray.push(
        <Button
          className='btn__active'
          icon={<EyeInvisibleOutlined style={{ transform: 'translateY(-1px)' }} />}
        // onClick={() => {
        //   mutationActionLabel.mutate({
        //     type: TypeActionLabel.ENABLE_HIDE_ALL,
        //     labelIds: selectedRowKeysPriority,
        //   });
        // }}
        >
          <span className='ml_8'>Ẩn tất cả</span>
        </Button>,
      );
    }
    if (checkShow.some((item) => item.status === 0)) {
      btnArray.push(
        <Button
          className='btn_active'
          icon={<EyeOutlined style={{ transform: 'translateY(-1px)' }} />}
        // onClick={() => {
        //   mutationActionLabel.mutate({
        //     type: TypeActionLabel.ENABLE_SHOW_ALL,
        //     labelIds: selectedRowKeysPriority,
        //   });
        // }}
        >
          <span className='ml_8'>Hiện tất cả</span>
        </Button>,
      );
    }

    setShowBtn([...btnArray]);
  }, [selectedRowKeys]);

  const getListCareStaff = async () => {
    setLoading(true);
    try {
      const dataRes = await CareStaffApis.getCareStaff({
        page: pagination.page,
        take: pagination.pageSize,
        q: search || undefined,
        role: 'ADMIN',
      })

      console.log('dataRes: ', dataRes);
      if (dataRes && dataRes.status === 200) {
        const { data } = dataRes;
        const listStaff = data?.data?.map(item => {
          const name = `${item.firstName ? item.firstName : ''} ${item.middleName ? item.middleName : ''} ${item.lastName ? item.lastName : ''}`;
          return {
            id: item.id || '',
            status: 0,
            name: name || '',
            email: item.email || '',
            gender: item.gender === 'FEMALE' ? 'Nữ' : item.gender === 'MALE' ? 'Nam' : 'Khác' || '',
            birthday: item.birthday ? moment(item.birthday).format('DD/MM/YYYY') : '',
            phoneNumber: item.phoneNumber || '',
            address: item.address || '',
            identityCardNumber: item.identityCardNumber || ''
          }
        })
        setListStaff(listStaff || []);
        setDataResponse(data || {});
        setLoading(false);
      }
    } catch (error) {
      setLoading(false)
      console.log('error:', error);
    }
  }

  const columns = [
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 50,
      align: 'center',
      render: (_, record) => (
        <Switch
          checked={record?.status === 1}
        // onChange={() =>
        //   mutationUpdateLabel.mutate({
        //     enable: record.enable === 1 ? 0 : 1,
        //     label_id: record?.id,
        //   })
        // }
        />
      ),
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      ellipsis: true,
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
      width: 40
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      width: 65
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 75
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      width: 100,
      render: (value) => (
        <div className='three_dot'>{value}</div>
      ),
    },
    {
      title: 'CCCD/CMT',
      dataIndex: 'identityCardNumber',
      key: 'identityCardNumber',
      ellipsis: true,
      width: 80,
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
      <h1>Danh sách nhân viên</h1>

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

      {selectedRowKeys.length > 0 && (
        <Alert
          className='fontSizeAlert'
          message={
            <div>
              <Space>
                <span>Đã chọn: {selectedRowKeys.length}</span>

                {showBtn}

                <Button
                  className='btn_active'
                  icon={<Stroke className='transformY_2' />}
                // onClick={() => {
                //   setShowModalDelete(true);
                //   setDeleteLabelIds(selectedRowKeys);
                // }}
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
        dataSource={listCareStaff}
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
      // scroll={{ x: 'max-content' }}
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
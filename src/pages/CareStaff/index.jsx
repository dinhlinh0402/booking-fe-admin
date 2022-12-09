import { EyeInvisibleOutlined, EyeOutlined, FilterOutlined, LockOutlined, PlusCircleOutlined, PushpinOutlined, ReconciliationFilled, SearchOutlined, UnlockOutlined } from '@ant-design/icons';
import { Alert, Button, Input, Modal, Space, Switch, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import CreateStaff from './components/CreateStaff';
import './index.scss';
import { toast } from 'react-toastify';
import CareStaffApis from '../../apis/CareStaff/index';
import moment from 'moment';
import Stroke from '../../components/Icon/CareStaff/Stoke';
import UserApis from '../../apis/User';

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
  const [isShowModalDelete, setShowModalDelete] = useState(false);

  useEffect(() => {
    if (!isModalCreate || !isShowModalDelete)
      getListCareStaff()
  }, [pagination, search, isModalCreate, isShowModalDelete])

  useEffect(() => {
    const checkShow = [];
    selectedRowKeys.forEach((item) => {
      const label = listCareStaff?.find((elm) => elm.id === item);
      if (label) checkShow.push(label);
    });
    const btnArray = [];
    if (checkShow.some((item) => item.status === true)) {
      btnArray.push(
        <Button
          className='btn_active'
          icon={<LockOutlined style={{ transform: 'translateY(-1px)' }} />}
          onClick={() => {
            handleChangeStatus({
              userIds: selectedRowKeys,
              status: false,
            })
          }}
        >
          <span className='ml_8'>Khoá tất cả</span>
        </Button>,
      );
    }
    if (checkShow.some((item) => item.status === false)) {
      btnArray.push(
        <Button
          className='btn_active'
          icon={<UnlockOutlined style={{ transform: 'translateY(-1px)' }} />}
          onClick={() => {
            handleChangeStatus({
              userIds: selectedRowKeys,
              status: true,
            })
          }}
        >
          <span className='ml_8'>Mở tất cả</span>
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
            status: item.status,
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

  const handleChangeStatus = async ({ userIds, status }) => {
    try {
      const dataRes = await UserApis.changeStatus({ userIds, status });
      console.log('dataRes: ', dataRes);
      if (dataRes?.data === true && dataRes?.status === 200) {
        toast.success('Thay đổi trạng thái thành công!');
        getListCareStaff();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error('Thay đổi trạng thái không thành công!');
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
          checked={record?.status === true}
          onChange={() => handleChangeStatus({
            userIds: [record.id],
            status: record.status === true ? false : true
          })}
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
  console.log('button: ', showBtn);
  return (
    <div>
      <h1>Danh sách nhân viên</h1>

      <div className="header_staff">
        <Input
          className='search_staff'
          size="large"
          placeholder="Tìm kiếm"
          suffix={<SearchOutlined />}
          onChange={(e) => handleSearch(e)}
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
        dataSource={listCareStaff}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
        pagination={{
          current: dataResponse?.meta?.page || 1, // so trang
          total: dataResponse?.meta?.itemCount || 10, // tong tat ca 
          defaultPageSize: dataResponse?.meta?.take || 10,
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
  )
}

export default CareStaff;
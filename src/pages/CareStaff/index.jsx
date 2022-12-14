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
  const [typeModal, setTypeModal] = useState('create');
  const [detailStaff, setDetailStaff] = useState({});

  useEffect(() => {
    if (!isModalCreate && !isShowModalDelete)
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
          <span className='ml_8'>Kho?? t???t c???</span>
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
          <span className='ml_8'>M??? t???t c???</span>
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
            firstName: item.firstName || '',
            middleName: item.middleName || '',
            lastName: item.lastName || '',
            status: item.status,
            name: name || '',
            email: item.email || '',
            gender: item.gender || '',
            birthday: item.birthday || null,
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
        toast.success('Thay ?????i tr???ng th??i th??nh c??ng!');
        getListCareStaff();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error('Thay ?????i tr???ng th??i kh??ng th??nh c??ng!');
    }
  }

  const columns = [
    {
      title: 'Tr???ng th??i',
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
      title: 'H??? t??n',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      ellipsis: true,
      render: (_, record) => (
        <div>
          <span
            className='name_staff'
            onClick={() => {
              setTypeModal('update');
              setDetailStaff(record);
              setModalCreate(true);
            }}
          >{record.name}</span>
        </div>
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
      title: 'Gi???i t??nh',
      dataIndex: 'gender',
      key: 'gender',
      width: 40,
      render: (value) => (
        <div>{value === 'FEMALE' ? 'N???' : value === 'MALE' ? 'Nam' : 'Kh??c' || ''}</div>
      )
    },
    {
      title: 'Ng??y sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      width: 65,
      render: (value) => (
        <div>{value ? moment(value).format('DD/MM/YYYY') : ''}</div>
      )
    },
    {
      title: 'S??? ??i???n tho???i',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 75
    },
    {
      title: '?????a ch???',
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
          toast.success('Xo?? kh??ch h??ng th??nh c??ng!');
        }
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error('Xo?? kh??ch h??ng kh??ng th??nh c??ng!');
    }
    setShowModalDelete(false);
    setSelectedRowKeys([]);
  };

  return (
    <div>
      <h1>Danh s??ch nh??n vi??n</h1>

      <div className="header_staff">
        <Input
          className='search_staff'
          size="large"
          placeholder="T??m ki???m"
          suffix={<SearchOutlined />}
          onChange={(e) => handleSearch(e)}
        />
        <div className='list_button'>
          <Button className='button' size="large" icon={<FilterOutlined />}>L???c</Button>
          <Button
            className='button'
            size="large"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setTypeModal('create');
              setModalCreate(true);
            }}
          >
            Th??m m???i
          </Button>
        </div>
      </div>

      {selectedRowKeys.length > 0 && (
        <Alert
          className='fontSizeAlert'
          message={
            <div>
              <Space>
                <span>???? ch???n: {selectedRowKeys.length}</span>

                {showBtn}

                <Button
                  className='btn_active'
                  icon={<Stroke className='transformY_2' />}
                  onClick={() => {
                    setShowModalDelete(true);
                  }}
                >
                  <span className='ml_8'>X??a</span>
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
          locale: { items_per_page: ' k???t qu???/trang' },
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
        type={typeModal}
        detailStaff={detailStaff}
        handleCancelModal={() => setModalCreate(false)}
      />

      <Modal
        open={isShowModalDelete}
        onOk={handleDeleteCustomer}
        onCancel={() => setShowModalDelete(false)}
        cancelText={'H???y'}
        okText={'X??a'}
        className='confirm_delete_label'
        width={370}
      >
        <h2 style={{ color: '#595959', fontWeight: 700, textAlign: 'center' }}>
          B???n c?? mu???n x??a kh??ch h??ng?
        </h2>
        {/* <Space direction='vertical'>
          <Text>
            Sau khi x??a nh??n, h??? th???ng s??? t??? ?????ng g??? nh??n kh???i c??c l?????t t????ng t??c ???? ???????c g???n nh??n
            tr?????c ????y.
            <br /> Vui l??ng c??n nh???c tr?????c khi x??a.
          </Text>

          <div style={{ background: '#fdefe4', padding: '10px', borderRadius: '3px' }}>
            <Text style={{ fontWeight: 600, color: '#e59935' }}>
              <WarningFilled /> L??u ??:
              <br />
            </Text>
            <Text>C??c nh??n t???o t??? Facebook ???????c h??? th???ng t??? ?????ng ?????ng b???, kh??ng th??? x??a.</Text>
          </div>
        </Space> */}
      </Modal>
    </div>
  )
}

export default CareStaff;
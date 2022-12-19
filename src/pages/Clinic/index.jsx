import { LockOutlined, PlusCircleOutlined, SearchOutlined, UnlockOutlined } from '@ant-design/icons';
import { Alert, Button, Input, Modal, Space, Switch, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ClinicApis from '../../apis/Clinic';
import FilterObjDropDown from '../../components/Filter/FilterObjDropDown';
import FilterIcon from '../../components/Icon/Doctor/FilterIcon';
import Stroke from '../../components/Icon/CareStaff/Stoke';
import CreateClinic from './components/CreateClinic';
import './index.scss';


const listStatus = [
  {
    id: 0,
    name: 'Khoá'
  },
  {
    id: 1,
    name: 'Kích hoạt'
  },
]

const Clinic = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState('');
  const typingSearch = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [isModalCreate, setModalCreate] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listClinic, setListClinic] = useState([]);
  const [showBtn, setShowBtn] = useState([]);
  const [checkedList, setCheckedList] = useState({
    active: [],
  })
  const [dataResponse, setDataResponse] = useState({});
  const [isShowModalDelete, setShowModalDelete] = useState(false);

  useEffect(() => {
    const checkShow = [];
    selectedRowKeys.forEach((item) => {
      const label = listClinic.find((elm) => elm.id === item);
      if (label) checkShow.push(label);
    });
    const btnArray = [];
    if (checkShow.some((item) => item.active === true)) {
      btnArray.push(
        <Button
          className='btn_active'
          icon={<LockOutlined style={{ transform: 'translateY(-1px)' }} />}
          onClick={() => {
            handleChangeActive({
              clinicIds: selectedRowKeys,
              active: false
            })
          }}
        >
          <span className='ml_8'>Khoá tất cả</span>
        </Button>,
      );
    }
    if (checkShow.some((item) => item.active === false)) {
      btnArray.push(
        <Button
          className='btn_active'
          icon={<UnlockOutlined style={{ transform: 'translateY(-1px)' }} />}
          onClick={() => {
            handleChangeActive({
              clinicIds: selectedRowKeys,
              active: true
            })
          }}
        >
          <span className='ml_8'>Mở tất cả</span>
        </Button>,
      );
    }

    setShowBtn([...btnArray]);
  }, [selectedRowKeys]);

  useEffect(() => {
    if (!isShowModalDelete && !isModalCreate)
      getListClinic();
  }, [checkedList, pagination, search, isShowModalDelete, isModalCreate])

  const getListClinic = async () => {
    try {
      setLoading(true);
      const dataRes = await ClinicApis.getClinics({
        page: pagination.page,
        take: pagination.pageSize,
        active: checkedList.active || undefined,
        q: search || undefined,
      })
      if (dataRes?.data?.data) {
        const { data } = dataRes?.data;
        const listClinic = data.map(item => {
          return {
            id: item.id,
            active: item.active,
            name: item.name || '',
            email: item.email || '',
            phone: item.phone || '',
            address: item.address || '',
            createdDate: item.createdDate ? moment(item.createdDate).format('DD/MM/YYYY') : '',
          }
        })
        setListClinic(listClinic || []);
        setDataResponse(dataRes?.data ? dataRes.data : {});
        setLoading(false);
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  const handleChangeActive = async ({ clinicIds, active }) => {
    try {
      const dataRes = await ClinicApis.changeActive({ clinicIds, active });
      if (dataRes?.status === 200 && dataRes.data === true) {
        toast.success('Thay đổI trạng thái thành công')
        getListClinic();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error('Thay đổi trạng thái không thành công!')
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
          checked={record?.active === true}
          onChange={() =>
            handleChangeActive({
              clinicIds: [record.id],
              active: record.active === true ? false : true,
            })
          }
        />
      ),
      fixed: true,
    },
    {
      title: 'Tên phòng khám',
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
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdDate',
      key: 'createdDate',
      ellipsis: true,
      width: 100,
    }
  ]

  const onSelectChange = (newSelectedRowKeys) => {
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

  const handleDeleteClinic = async () => {
    try {
      const dataRes = await ClinicApis.deleteClinic({
        clinicIds: selectedRowKeys,
      })
      if (dataRes?.data === true && dataRes.status === 200) {
        toast.success('Xoá phòng khám thành công');
        setShowModalDelete(false);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error('Xoá phòng khám không thành công!');
    }
  }

  return (
    <div>
      <h1>Danh sách phòng khám</h1>

      <div className="header_clinic">
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
            className='search_clinic'
            size="large"
            placeholder="Tìm kiếm"
            suffix={<SearchOutlined />}
            onChange={(e) => handleSearch(e)}
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
            checkedList={checkedList.active}
            keyFilter={'active'}
            handleCheckAll={handleCheckAll}
            handleCheck={handleCheck}
          />
        </Space>
      )}

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
                  onClick={() => setShowModalDelete(true)}
                >
                  <span className='ml_8'>Xóa</span>
                </Button>
              </Space>
            </div>
          }
        />
      )}

      <Table
        loading={loading}
        rowKey={'id'}
        dataSource={listClinic}
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
        scroll={{ x: 'max-content' }}
      />

      <CreateClinic
        isShowModal={isModalCreate}
        handleCancelModal={() => setModalCreate(false)}
      />

      <Modal
        visible={isShowModalDelete}
        onOk={handleDeleteClinic}
        onCancel={() => setShowModalDelete(false)}
        cancelText={'Hủy'}
        okText={'Xóa'}
        className='confirm_delete_label'
        width={370}
      >
        <h2 style={{ color: '#595959', fontWeight: 700, textAlign: 'center' }}>
          Bạn có muốn xóa bác sĩ?
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

export default Clinic;
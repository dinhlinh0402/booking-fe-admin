import { DownOutlined, FilterOutlined, LockOutlined, PlusCircleOutlined, SearchOutlined, UnlockOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Dropdown, Input, Space, Switch, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import FilterObjDropDown from '../../components/Filter/FilterObjDropDown';
import FilterIcon from '../../components/Icon/CareStaff/Doctor/FilterIcon';
import CreateDoctor from './components/CreateDoctor';
import './index.scss';
import DoctorApis from '../../apis/Doctor';
import moment from 'moment';
import Stroke from '../../components/Icon/CareStaff/Stoke';
import ClinicApis from '../../apis/Clinic';
import SpecialtyApis from '../../apis/Specialty';

const listRole = [
  {
    id: 'HEAD_OF_DOCTOR',
    name: 'Trưởng khoa'
  },
  {
    id: 'DOCTOR',
    name: 'Bác sĩ'
  },
  {
    id: 'MANAGER_CLINIC',
    name: 'Quản lý phòng khám'
  }
]

const role = {
  HEAD_OF_DOCTOR: 'Trưởng khoa',
  DOCTOR: 'Bác sĩ',
  MANAGER_CLINIC: 'Quản lý phòng khám',
}

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
  const [loading, setLoading] = useState(false);
  const [listClinic, setListClinic] = useState([]);
  const [listSpecialty, setListSpecialty] = useState([]);
  const [checkedList, setCheckedList] = useState({
    role: [],
    status: [],
    clinic: [],
    specialty: [],
  })
  const [listDoctor, setListDoctor] = useState([]);
  const [dataResponse, setDataResponse] = useState({});
  const [showBtn, setShowBtn] = useState([]);

  useEffect(() => {
    !isModalCreate && getListDoctor();
  }, [checkedList, pagination, isModalCreate])


  const getListDoctor = async () => {
    try {
      setLoading(true);
      const dataRes = await DoctorApis.getListDoctor({
        page: pagination.page,
        take: pagination.pageSize,
        name: search || undefined,
        status: checkedList.status || undefined,
        role: checkedList.role.length ? checkedList.role : ['DOCTOR', 'MANAGER_CLINIC', 'HEAD_OF_DOCTOR'],
        clinicIds: checkedList.clinic || undefined,
        specialtyIds: checkedList.specialty || undefined,
      })
      if (dataRes?.data?.data) {
        const { data } = dataRes?.data;
        const listDoctor = data.map(item => {
          const name = `${item.firstName ? item.firstName : ''} ${item.middleName ? item.middleName : ''} ${item.lastName ? item.lastName : ''}`;
          return {
            id: item.id,
            status: item.status,
            name: name,
            email: item.email || '',
            gender: item.gender === 'FEMALE' ? 'Nữ' : item.gender === 'MALE' ? 'Nam' : 'Khác' || '',
            birthday: item.birthday ? moment(item.birthday).format('DD/MM/YYYY') : '',
            phoneNumber: item.phoneNumber || '',
            role: item.role ? role[item.role] : '',
            clinic: item.clinic ? item.clinic.name : '',
            specialty: item.specialty ? item.specialty.name : '',
          }
        })
        setListDoctor(listDoctor || []);
        setDataResponse(dataRes?.data ? dataRes?.data : {});
        setLoading(false);
      }
    } catch (error) {
      console.log('erroe: ', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getListClinic();
    getListSpecialty();
  }, [])

  const getListClinic = async () => {
    try {
      const dataRes = await ClinicApis.getClinics({
        pages: 1,
        take: 100,
      })
      // console.log('dataRes: ', dataRes);
      if (dataRes?.data?.data) {
        const { data } = dataRes?.data;
        const listOptionsClinic = data.map(item => {
          return {
            id: item.id,
            name: item?.name || '',
          }
        })
        setListClinic(listOptionsClinic || []);
      }
    } catch (error) {
      console.log('error: ', error);
      setListClinic([]);
    }
  }

  const getListSpecialty = async () => {
    try {
      const dataSpecialty = await SpecialtyApis.getListSpecialty({
        pages: 1,
        take: 100,
      });
      if (dataSpecialty?.data?.data) {
        const { data } = dataSpecialty?.data;
        const listSpecialty = data?.map(item => {
          return {
            id: item.id,
            name: item?.name,
          }
        })

        setListSpecialty(listSpecialty || []);
      }
    } catch (error) {
      console.log('error: ', error);
      setListSpecialty([]);
    }
  }

  useEffect(() => {
    const checkShow = [];
    selectedRowKeys.forEach((item) => {
      const label = listDoctor?.find((elm) => elm.id === item);
      if (label) checkShow.push(label);
    });
    const btnArray = [];
    if (checkShow.some((item) => item.status === true)) {
      btnArray.push(
        <Button
          className='btn__active'
          icon={<LockOutlined style={{ transform: 'translateY(-1px)' }} />}
        // onClick={() => {
        //   mutationActionLabel.mutate({
        //     type: TypeActionLabel.ENABLE_HIDE_ALL,
        //     labelIds: selectedRowKeysPriority,
        //   });
        // }}
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
        // onClick={() => {
        //   mutationActionLabel.mutate({
        //     type: TypeActionLabel.ENABLE_SHOW_ALL,
        //     labelIds: selectedRowKeysPriority,
        //   });
        // }}
        >
          <span className='ml_8'>Mở tất cả</span>
        </Button>,
      );
    }

    setShowBtn([...btnArray]);
  }, [selectedRowKeys]);

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
        // onChange={() =>
        //   mutationUpdateLabel.mutate({
        //     enable: record.enable === 1 ? 0 : 1,
        //     label_id: record?.id,
        //   })
        // }
        />
      ),
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
      dataIndex: 'clinic',
      key: 'clinic',
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
            plainOptions={listClinic || []}
            checkedList={checkedList.clinic}
            keyFilter={'clinic'}
            handleCheckAll={handleCheckAll}
            handleCheck={handleCheck}
          />

          <FilterObjDropDown
            displayName={'Chuyên khoa'}
            placeholder={'Chuyên khoa'}
            placeholderSearch={false}
            plainOptions={listSpecialty || []}
            checkedList={checkedList.specialty}
            keyFilter={'specialty'}
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
        loading={loading}
        rowKey={'id'}
        dataSource={listDoctor}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
        pagination={{
          current: dataResponse?.meta?.page || 2, // so trang
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

      <CreateDoctor
        isShowModal={isModalCreate}
        handleCancelModal={() => setModalCreate(false)}
      />
    </div>
  )
}

export default Doctor;
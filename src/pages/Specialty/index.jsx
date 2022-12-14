import React, { useEffect, useRef, useState } from 'react';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Alert, Button, Input, Modal, Space, Table } from 'antd';
import SpecialtyApis from '../../apis/Specialty';
import './index.scss';
import Stroke from '../../components/Icon/CareStaff/Stoke';
import moment from 'moment';
import CreateEditSpecialty from './components/CreateEdit';
import { toast } from 'react-toastify';

const Specialty = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState('');
  const typingSearch = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [listSpecialty, setListSpecialty] = useState([]);
  const [dataResponse, setDataResponse] = useState({});
  const [isShowModal, setShowModal] = useState(false);
  const [isShowModalDelete, setShowModalDelete] = useState(false);
  const [typeModal, setTypeModal] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});

  useEffect(() => {
    if (!isShowModal && !isShowModalDelete)
      getListSpecialty();
  }, [pagination, search, isShowModal, isShowModalDelete])

  const getListSpecialty = async () => {
    setLoading(true);
    try {
      const dataRes = await SpecialtyApis.getListSpecialty({
        page: pagination.page,
        take: pagination.pageSize,
        q: search || undefined,
      })
      if (dataRes?.data?.data) {
        const { data } = dataRes.data;
        const listSpecialtyData = data?.map(item => {
          return {
            id: item.id,
            name: item.name || '',
            description: item.description || '',
            createdDate: item.createdDate ? moment(item.createdDate).format('DD/MM/YYYY') : '',
            lastModifiedDate: item.lastModifiedDate ? moment(item.lastModifiedDate).format('DD/MM/YYYY') : '',
            image: item.image || '',
          }
        })
        setListSpecialty(listSpecialtyData || []);
        setDataResponse(dataRes?.data ? dataRes.data || {} : {});
        setLoading(false);
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    if (typingSearch.current) {
      clearTimeout(typingSearch.current);
    }
    typingSearch.current = setTimeout(() => {
      setSearch(e.target.value);
    }, 500)
  }

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns = [
    {
      title: 'T??n chuy??n khoa',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '20%',
      fixed: true,
      render: (_, record) => (
        <div
          className='name_specialty'
          onClick={() => {
            setTypeModal('update');
            setShowModal(true);
            setDataUpdate(record);
          }}
        >
          {record.name}
        </div>
      )
    },
    {
      title: 'M?? t???',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: '50%',
      // render: (value) => (
      //   <div>{value}</div>
      // ),
    },
    {
      title: 'Ng??y t???o',
      dataIndex: 'createdDate',
      key: 'createdDate',
      ellipsis: true,
      width: '15%',
    },
    {
      title: 'Ng??y s???a',
      dataIndex: 'lastModifiedDate',
      key: 'lastModifiedDate',
      ellipsis: true,
      width: '15%',
    }
  ]

  const handleDeleteSpecialty = async () => {
    try {
      const dataRes = await SpecialtyApis.deleteSpecialty({
        specialtyIds: selectedRowKeys,
      })
      if (dataRes?.data === true && dataRes.status === 200) {
        toast.success('Xo?? chuy??n khoa th??nh c??ng!');
        setShowModalDelete(false);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error('Xo?? chuy??n khoa kh??ng th??nh c??ng!');
    }
  }

  return (
    <div>
      <h1>Danh s??ch chuy??n khoa</h1>

      <div className="header_specialty">
        <Space>
          {/* <Button
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
          /> */}
          <Input
            className='search_specialty'
            size="large"
            placeholder="T??m ki???m"
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
            onClick={() => {
              setTypeModal('create');
              setShowModal(true);
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
                <Button
                  className='btn_active'
                  icon={<Stroke className='transformY_2' />}
                  onClick={() => setShowModalDelete(true)}
                >
                  <span className='ml_8'>X??a</span>
                </Button>
              </Space>
            </div>
          }
        />
      )}

      <Table
        loading={loading}
        rowKey={'id'}
        dataSource={listSpecialty}
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

      {isShowModal && (
        <CreateEditSpecialty
          isShowModal={isShowModal}
          handleCancelModal={() => {
            setShowModal(false);
            setDataUpdate({});
          }}
          type={typeModal}
          dataUpdate={dataUpdate}
        />
      )}

      <Modal
        open={isShowModalDelete}
        onOk={handleDeleteSpecialty}
        onCancel={() => setShowModalDelete(false)}
        cancelText={'H???y'}
        okText={'X??a'}
        className='confirm_delete_label'
        width={370}
      >
        <h2 style={{ color: '#595959', fontWeight: 700, textAlign: 'center' }}>
          B???n c?? mu???n x??a chuy??n khoa?
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

export default Specialty;
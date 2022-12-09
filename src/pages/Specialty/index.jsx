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
      title: 'Tên chuyên khoa',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '20%',
      fixed: true
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: '50%',
      // render: (value) => (
      //   <div>{value}</div>
      // ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      ellipsis: true,
      width: '15%',
    },
    {
      title: 'Ngày sửa',
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
        toast.success('Xoá chuyên khoa thành công!');
        setShowModalDelete(false);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error('Xoá chuyên khoa không thành công!');
    }
  }

  return (
    <div>
      <h1>Danh sách chuyên khoa</h1>

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
            onClick={() => setShowModal(true)}
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

      {isShowModal && (
        <CreateEditSpecialty
          isShowModal={isShowModal}
          handleCancelModal={() => setShowModal(false)}
          type={'create'}
        />
      )}

      <Modal
        visible={isShowModalDelete}
        onOk={handleDeleteSpecialty}
        onCancel={() => setShowModalDelete(false)}
        cancelText={'Hủy'}
        okText={'Xóa'}
        className='confirm_delete_label'
        width={370}
      >
        <h2 style={{ color: '#595959', fontWeight: 700, textAlign: 'center' }}>
          Bạn có muốn xóa chuyên khoa?
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

export default Specialty;
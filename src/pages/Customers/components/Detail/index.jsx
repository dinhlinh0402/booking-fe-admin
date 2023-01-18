import { DownOutlined, EditOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Dropdown, Input, Space, Spin, Table, Tag } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useParams, useHistory } from "react-router-dom";
import BookingApis from '../../../../apis/Bookings';
import UserApis from '../../../../apis/User';
import BackIcon from '../../../../components/Icon/Common/BackIcon';
import FilterIcon from '../../../../components/Icon/Doctor/FilterIcon';
import baseURL from '../../../../utils/url';
import AddEditUser from '../AddEditUser';
import './index.scss';
const { RangePicker } = DatePicker;


const DetailCustomer = () => {
  const [search, setSearch] = useState('');
  const typingSearch = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [showFilter, setShowFilter] = useState(false);
  const [examinationDay, setExaminationDay] = useState([]);
  const [isModalUpdate, setModalUpdate] = useState(false);
  const [dataCustomerModal, setDataCustomerModal] = useState({});
  const [dataInfoCustomer, setDataInfoCustomer] = useState({});
  const [loading, setLoading] = useState(false);
  const [listHistory, setListHistory] = useState([]);

  let date1 = moment('2023-01-08T10:29:23');
  let date2 = moment('2023-01-09T12:06:55');
  let diff = date2.diff(date1, 'hours');
  console.log('diff: ', diff);
  let { customerId } = useParams();

  useEffect(() => {
    document.title = 'Thông tin khách khàng'
  }, [])

  useEffect(() => {
    if (customerId && !isModalUpdate) {
      getInfoCustomer(customerId);
      getHistory();
    }
  }, [customerId, isModalUpdate])

  const getInfoCustomer = async (customerId) => {
    try {
      setLoading(true);
      const dataRes = await UserApis.getUserById(customerId);
      if (dataRes.status === 200) {
        const { data } = dataRes
        setDataCustomerModal({
          id: data.id,
          firstName: data?.firstName || '',
          middleName: data?.middleName || '',
          lastName: data?.lastName || '',
          email: data?.email || '',
          gender: data?.gender || null,
          phoneNumber: data?.phoneNumber || '',
          birthday: data?.birthday || '',
          address: data?.address || '',
        })
        setDataInfoCustomer(data);
      }
      setLoading(false);
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  const getHistory = async () => {
    try {
      setLoading(true);
      const dataHistory = await BookingApis.getBookings({
        page: 1,
        take: 100,
        patientId: customerId,
      });
      console.log('dataHistory: ', dataHistory);
      if (dataHistory?.data?.data.length) {
        const { data } = dataHistory?.data;
        const mapData = data?.map((item, idx) => {

          const doctor = `${item?.doctor.firstName ? item?.doctor.firstName : ''} ${item?.doctor?.middleName ? item?.doctor?.middleName : ''} ${item?.doctor?.lastName ? item?.doctor?.lastName : ''}`.trim();
          return {
            id: item.id,
            stt: idx + 1,
            date: `${moment(item?.schedule?.timeStart).format('HH:mm')} - ${moment(item?.schedule?.timeEnd).format('HH:mm')} ${moment(item?.schedule?.timeEnd).format('DD/MM/YYYY')}`,
            doctor: doctor,
            clinic: item?.doctor?.clinic?.name || '',
            prescription: 'Chua lay dc',
            status: item.status,
            type: item.type === 'FOR_MYSELF' ? 'Đặt cho bản thân' : `Đặt hộ: ${item.bookingRelatives.name}`,
            reason: item?.reason || '',
            prescription: item?.history?.prescription ? `${baseURL}${item?.history?.prescription}` : '',
            doctorNote: item?.history?.doctorNote || '',
          }
        })
        setListHistory(mapData || [])
      }
      setLoading(false);
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }
  }

  const handleBack = () => {
    // const partName = location.pathname.split('/').slice(0, 3).join('/');
    // console.log('partName: ', partName);
    // history.push(partName);
    window.history.back();
  }

  const handleSearch = (e) => {
    if (typingSearch.current) {
      clearTimeout(typingSearch.current);
    }
    typingSearch.current = setTimeout(() => {
      setSearch(e.target.value);
    }, 500)
  }

  const handleChangePickerExaminationDay = (value) => {
    if (!value) {
      setExaminationDay([]);
      setPagination({
        ...pagination,
        page: 1,
      });
    } else if (value && value[0] && value[1]) {
      setExaminationDay([moment(value[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss'), moment(value[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss')]);
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 20,
    },
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      key: 'date',
      width: 50,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 50,
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      width: 50,
    },
    {
      title: 'Tên bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
      ellipsis: true,
      width: 55
    },
    {
      title: 'Tên phòng khám',
      dataIndex: 'clinic',
      key: 'clinic',
      ellipsis: true,
      width: 55
    },
    {
      title: 'Đơn thuốc',
      dataIndex: 'prescription',
      key: 'prescription',
      ellipsis: true,
      width: 55,
      render: (value) => (
        <>
          {value ? (
            <a download href={value}>
              <div style={{
                color: '#1890ff'
              }}>Xem đơn thuốc</div>
            </a>
          ) : ''}
        </>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 50,
      align: 'center',
      render: (_, record) => {
        let color = '';
        let text = '';
        if (record.status === 'WAITING') {
          color = 'warning';
          text = 'Chưa xác nhận';
        }
        else if (record.status === 'CANCEL') {
          color = 'error';
          text = 'Đã hủy';
        }
        else if (record.status === 'DONE') {
          color = 'success';
          text = 'Đã hoàn thành';
        }
        else if (record.status === 'CONFIRMED') {
          color = 'processing';
          text = 'Đã xác nhận';
        }
        else color = 'red';

        return (
          <>
            <Tag color={color} key={record.status}>
              {text}
            </Tag>
          </>
        )
      }
    }
  ]

  return (
    <>
      {loading ? (
        <div className="spin">
          <Spin />
        </div>
      ) : (
        <>
          <div className='header_detail_customer'>
            <Space>
              <BackIcon
                onClick={handleBack}
                style={{
                  cursor: 'pointer',
                  height: '100%'
                }}
              />
              <span className='name_customer'>
                {`${dataInfoCustomer.firstName || ''} ${dataInfoCustomer.middleName || ''} ${dataInfoCustomer.lastName || ''}`.trim()}
              </span>
            </Space>
          </div>

          <div className="detail_customer_container">
            <div className="detail_customer_function">
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
                  icon={<EditOutlined />}
                  onClick={() => setModalUpdate(true)}
                >
                  Sửa thông tin
                </Button>
              </div>
            </div>

            {showFilter && (
              <Space
                size={24}
                style={{ marginTop: '10px', marginBottom: '20px', color: 'rgba(17, 17, 17, 0.45)' }}
              >
                <Dropdown
                  overlay={
                    <Card className='cardBody'>
                      <span>Thời gian tạo</span>
                      <br />
                      <RangePicker
                        ranges={{
                          Now: [moment(), moment()],
                        }}
                        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                        // showTime={{ format: 'HH:mm' }}
                        format='DD-MM-YYYY'
                        disabledDate={(current) => moment() <= current}
                        // onOk={onOkCreatedAt}
                        onChange={handleChangePickerExaminationDay}
                      />
                    </Card>
                  }
                  className='filter__dropdown'
                  overlayStyle={{ width: '300px' }}
                  trigger={['click']}
                >
                  <a>
                    <Space
                      style={{
                        color: `${(examinationDay || []).length > 0 ? 'rgba(17, 17, 17, 0.75)' : ''
                          }`,
                      }}
                    >
                      Thời gian tạo
                      <DownOutlined />
                      {(examinationDay || []).length > 0 && <span id='dot__active' />}
                    </Space>
                  </a>
                </Dropdown>
              </Space>
            )}

            {/* TABLE */}
            <Table
              loading={loading}
              rowKey={'id'}
              dataSource={listHistory}
              columns={columns}
            />
          </div>
        </>
      )}

      {isModalUpdate && (
        <AddEditUser
          isShowModal={isModalUpdate}
          handleCancelModal={() => setModalUpdate(false)}
          type={'update'}
          dataCustomer={dataCustomerModal}
        />
      )}
    </>
  )
}

export default DetailCustomer;
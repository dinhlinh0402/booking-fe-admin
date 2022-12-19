import { DownOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Dropdown, Input, Space } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useParams, useHistory } from "react-router-dom";
import UserApis from '../../../../apis/User';
import BackIcon from '../../../../components/Icon/Common/BackIcon';
import FilterIcon from '../../../../components/Icon/Doctor/FilterIcon';
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

  const history = useHistory();
  let location = useLocation();
  // console.log('location: ', location);

  let { customerId } = useParams();

  useEffect(() => {
    document.title = 'Thông tin khách khàng'
  }, [])

  useEffect(() => {
    if (customerId && !isModalUpdate)
      getInfoCustomer(customerId);
  }, [customerId, isModalUpdate])

  const getInfoCustomer = async (customerId) => {
    try {
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
    } catch (error) {
      console.log('error: ', error);
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

  return (
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
      </div>

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
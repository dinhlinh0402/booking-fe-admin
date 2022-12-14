import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Select, Space, Table, Tag } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import ClinicApis from "../../../apis/Clinic";
import ScheduleApis from "../../../apis/Schedules";
import UserApis from "../../../apis/User";
import './index.scss';

const { Option } = Select;

const WatchScheduleForAdmin = () => {
  const [selectDate, setSelectDate] = useState(moment(new Date()).format('YYYY-MM-DDT08:00:00'));
  const [loading, setLoading] = useState(false);
  const [optionsClinic, setOptionsClinic] = useState([]);
  const [optionsDoctor, setOptionsDoctor] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dataResponse, setDataResponse] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [listSchedule, setListSchedule] = useState([]);

  useEffect(() => {
    getListClinic()
  }, [])

  const getListClinic = async () => {
    try {
      const dataRes = await ClinicApis.getClinics({
        pages: 1,
        take: 100,
        active: true,
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
        setOptionsClinic(listOptionsClinic || []);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }

  const handleChangSelectClinic = async (value) => {
    try {
      setSelectedClinic(value);
      const dataDoctor = await UserApis.getListUser({
        clinicId: value,
      });
      if (dataDoctor?.data?.data?.length > 0) {
        const { data } = dataDoctor?.data;
        const listDoctor = data?.map(item => {
          return {
            id: item.id,
            name: `${item.firstName ? item.firstName : ''} ${item.middleName ? item.middleName : ''} ${item.lastName ? item.lastName : ''}`.trim(),
          }
        })

        setOptionsDoctor(listDoctor || [])
      } else if (dataDoctor?.data?.data?.length === 0) {
        setOptionsDoctor([]);
        setSelectedDoctor('');
      }
    } catch (error) {
      // console.log('error: ', error);
      setOptionsDoctor([]);
      setSelectedDoctor('');
    }
  }

  const handleChangSelectDoctor = (value) => {
    setSelectedDoctor(value);
  }

  const onChangeDate = (date, stringDate) => {
    setSelectDate(moment(date).format('YYYY-MM-DDTHH:mm:ss'));
  };

  const columns = [
    {
      title: 'Th???i gian',
      dataIndex: 'time',
      key: 'time',
      width: 100,
    },
    {
      title: 'Ng??y kh??m',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: 'S??? l?????ng b???nh nh??n',
      dataIndex: 'maxCount',
      key: 'maxCount',
      width: 50,
    },
    {
      title: '???? ?????t',
      dataIndex: 'booked',
      key: 'booked',
      width: 50,
    },
    {
      title: 'Tr???ng th??i',
      dataIndex: 'status',
      key: 'status',
      width: 50,
      align: 'center',
      render: (_, record) => {
        let color = '';
        if (record.status === 'ACTIVE') color = 'green';
        else if (record.status === 'CANCLE') color = 'red';
        else if (record.status === 'WAITING') color = 'orange';
        else color = 'red';

        return (
          <>
            <Tag color={color} key={record.status}>
              {record.status}
            </Tag>
          </>
        )
      }
    }
  ]

  const handleGetListSchedule = async () => {
    if (!selectedDoctor) {
      toast.warning('B???n ch??a ch???n b??c s??!');
      return;
    }

    try {
      setLoading(true);
      const dataSchedule = await ScheduleApis.getListSchedule({
        page: pagination.page,
        take: pagination.pageSize,
        doctorId: selectedDoctor,
        date: selectDate,
      })
      // console.log('dataSchedule: ', dataSchedule);
      if (dataSchedule.data.data) {
        // setListSchedule(dataSchedule.data.data || []);
        const { data } = dataSchedule.data;
        const newData = data.map(item => {
          return {
            id: item.id,
            time: `${moment(item.timeStart).format('HH:mm')} - ${moment(item.timeEnd).format('HH:mm')}`,
            date: moment(new Date(parseInt(item.date))).format('DD/MM/YYYY'),
            status: item.status,
            maxCount: item?.maxCount || 0,
            booked: item?.booked || 0,
          }
        })
        setListSchedule(newData || []);
        setDataResponse(dataSchedule.data || null)
        setLoading(false);
      } else {
        setListSchedule([]);
        setLoading(false);
      }
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
    }

  }

  return (
    <div>
      <h1>Danh s??ch l???ch kh??m</h1>

      <div className="input_filter">
        <Space>
          <DatePicker
            className='date_picker'
            picker="date"
            defaultValue={moment(selectDate, 'YYYY-MM-DD')}
            format={'DD/MM/YYYY'}
            showNow={true}
            showTime={false}
            style={{
              borderRadius: '0px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            showToday={false}
            disabledDate={(current) => moment() >= current}
            onChange={onChangeDate}
            size='large'
          />

          <Select
            showSearch
            // style={{ width: '' }}
            size='large'
            placeholder={'Ch???n ph??ng kh??m'}
            className='select'
            // optionLabelProp='label'
            // optionFilterProp={'label'}
            value={selectedClinic}
            filterOption={(input, option) =>
              option?.label !== null && option?.label?.toLowerCase().includes(input.trim().toLowerCase())
            }
            onChange={handleChangSelectClinic}
          >
            {optionsClinic.length && optionsClinic.map((item) => (
              <Option
                key={item.id}
                value={item.id || ''}
                label={item.name}
              >
                {item.name}
              </Option>

            ))}
          </Select>

          <Select
            showSearch
            style={{ height: '100%' }}
            size='large'
            value={selectedDoctor}
            placeholder='Ch???n b??c s??'
            className='select'
            onChange={handleChangSelectDoctor}
            filterOption={(input, option) =>
              option?.label !== null && option?.label?.toLowerCase().includes(input.trim().toLowerCase())
            }
          >
            {optionsDoctor.length && optionsDoctor.map((item) => (
              <Option key={item.id} value={item.id} label={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>

          <Button
            size='large'
            type='primary'
            icon={<SearchOutlined />}
            onClick={handleGetListSchedule}
          >T??m ki???m</Button>
        </Space>
      </div>

      <div className="table_list_schdule">
        <Table
          loading={loading}
          rowKey={'id'}
          dataSource={listSchedule}
          columns={columns}
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
        />
      </div>
    </div>
  )
}

export default WatchScheduleForAdmin;
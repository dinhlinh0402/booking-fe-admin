import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Select, Space, Table, Tag } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ScheduleApis from "../../../apis/Schedules";
import UserApis from "../../../apis/User";

const { Option } = Select;

const WatchScheduleForManagerClinic = () => {
  const [selectDate, setSelectDate] = useState(moment(new Date()).format('YYYY-MM-DDT08:00:00'));
  const [optionsDoctor, setOptionsDoctor] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [listSchedule, setListSchedule] = useState([]);
  const [dataResponse, setDataResponse] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      getListDoctor(user?.clinic?.id);
    }
  }, [])

  const getListDoctor = async (clinicId) => {
    try {
      const dataDoctor = await UserApis.getListUser({
        clinicId: clinicId,
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
  const onChangeDate = (date, stringDate) => {
    setSelectDate(moment(date).format('YYYY-MM-DDTHH:mm:ss'));
  };

  const handleChangSelectDoctor = (value) => {
    setSelectedDoctor(value);
  }

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      width: 100,
    },
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: 'Số lượng bệnh nhân',
      dataIndex: 'count',
      key: 'count',
      width: 50,
    },
    // {
    //   title: 'Đã đặt',
    //   dataIndex: 'booked',
    //   key: 'booked',
    //   width: 50,
    // },
    {
      title: 'Trạng thái',
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
      toast.warning('Bạn chưa chọn bác sĩ!');
      return;
    }

    try {
      setLoading(true);
      const dataSchedule = await ScheduleApis.getListSchedule({
        page: pagination.page,
        take: pagination.pageSize,
        doctorId: selectedDoctor,
        date: selectDate
      })
      console.log('dataSchedule: ', dataSchedule);
      if (dataSchedule.data.data) {
        // setListSchedule(dataSchedule.data.data || []);
        const { data } = dataSchedule.data;
        const newData = data.map(item => {
          return {
            id: item.id,
            time: `${moment(item.timeStart).format('HH:mm')} - ${moment(item.timeStart).format('HH:mm')}`,
            date: moment(new Date(parseInt(item.date))).format('DD/MM/YYYY'),
            count: 'chua tra ve',
            status: item.status,
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
      <h1>Danh sách lịch khám</h1>

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
            style={{ height: '100%' }}
            size='large'
            value={selectedDoctor}
            placeholder='Chọn bác sĩ'
            className='select'
            onChange={handleChangSelectDoctor}
            filterOption={(input, option) =>
              option?.label !== null && option?.label?.toLowerCase().includes(input.trim().toLowerCase())
            }
          >
            {optionsDoctor.length && optionsDoctor.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>

          <Button
            size='large'
            type='primary'
            icon={<SearchOutlined />}
            onClick={handleGetListSchedule}
          >Tìm kiếm</Button>
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
            locale: { items_per_page: ' kết quả/trang' },
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

export default WatchScheduleForManagerClinic;
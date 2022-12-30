import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Select, Space } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import UserApis from "../../../apis/User";

const { Option } = Select;

const WatchScheduleForManagerClinic = () => {
  const [selectDate, setSelectDate] = useState(moment(new Date()).format('YYYY-MM-DDT08:00:00'));
  const [isLoading, setLoading] = useState(false);
  const [optionsDoctor, setOptionsDoctor] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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

          <Button size='large' type='primary' icon={<SearchOutlined />}>Tìm kiếm</Button>
        </Space>
      </div>
    </div>
  )
}

export default WatchScheduleForManagerClinic;
import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Select, Space } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import ClinicApis from "../../../apis/Clinic";
import UserApis from "../../../apis/User";
import './index.scss';

const { Option } = Select;

const WatchScheduleForAdmin = () => {
  const [selectDate, setSelectDate] = useState(moment(new Date()).format('YYYY-MM-DDT08:00:00'));
  const [isLoading, setLoading] = useState(false);
  const [optionsClinic, setOptionsClinic] = useState([]);
  const [optionsDoctor, setOptionsDoctor] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);


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
            name: `${item.firstName ? item.firstName : ''} ${item.middleName ? item.middleName : ''} ${item.lastName ? item.lastName : ''}`.trim()  ,
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
            // style={{ width: '' }}
            size='large'
            placeholder={'Chọn phòng khám'}
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

export default WatchScheduleForAdmin;
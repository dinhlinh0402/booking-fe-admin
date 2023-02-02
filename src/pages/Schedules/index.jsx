import { Alert, Button, DatePicker, Empty, Modal, Space, Table, Tag, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { PlusCircleOutlined, WarningFilled } from '@ant-design/icons';
import ScheduleApis from '../../apis/Schedules';
import './index.scss';
import CreateSchedule from './components/CreateSchedule';
import { toast } from 'react-toastify';
import Stroke from '../../components/Icon/CareStaff/Stoke';

const { Text } = Typography;

const timeStartDay = '2022-12-14T08:00:00';
const timeEndDay = '2022-12-14T18:00:00';
const dateNow = new Date();

const Schedules = () => {
  const [selectDate, setSelectDate] = useState(moment(dateNow).add(1, 'day').format('YYYY-MM-DDT08:00:00'));
  const [listSchedule, setListSchedule] = useState([]);
  const [isModalCreate, setModalCreate] = useState(false);
  const [listScheduleDisable, setListScheduleDisable] = useState([]);
  const [isShowChangeSchedule, setShowChangeSchedule] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataResponse, setDataResponse] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem('user'));
    if (userLocal)
      setUser(userLocal)
  }, [])

  useEffect(() => {
    if (!isModalCreate && user)
      getSchedules();
  }, [selectDate, isModalCreate, user]);

  const getSchedules = async () => {
    setLoading(true);
    try {
      const dataRes = await ScheduleApis.getListSchedule({
        page: 1,
        take: 100,
        doctorId: user.id,
        date: selectDate,
      })
      if (dataRes?.data?.data) {
        const { data } = dataRes?.data;
        const listScheduleMap = data.map(item => {
          return {
            id: item.id,
            timeStart: item.timeStart ? moment(item?.timeStart).format('YYYY-MM-DDTHH:mm:ss') : '',
            timeEnd: item.timeEnd ? moment(item?.timeEnd).format('YYYY-MM-DDTHH:mm:ss') : '',
            checked: true,
            status: item.status,
            date: moment(new Date(parseInt(item.date))).format('DD/MM/YYYY'),
            maxCount: item?.maxCount || 0,
            booked: item?.booked || 0,
          }
        })
        setListSchedule(listScheduleMap || []);
        setDataResponse(dataRes?.data || null);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error: ', error);
    }
  }

  useEffect(() => {
    // console.log(timeStartDay > timeEndDay);
    const listTime = [];
    let timeStartDayClone = timeStartDay
    while (timeStartDayClone < timeEndDay) {
      // console.log('timeStartDayClone: ', timeStartDayClone);
      const time = {
        timeStart: timeStartDayClone,
        timeEnd: moment(timeStartDayClone).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
      }
      timeStartDayClone = moment(timeStartDayClone).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
      listTime.push(time);
    }
    // setListSchedule(listTime);
  }, [])

  const onChange = (date, stringDate) => {
    // console.log('date: ', date);
    // console.log('stringDate: ', stringDate);
    setSelectDate(moment(date).format('YYYY-MM-DDTHH:mm:ss'));
  };

  const handleCheckedSchedule = (schedule) => {
    // const {timeStart, timeEnd, checked} = schedule;
    const listScheduleClone = listSchedule;
    const listScheduleDisableNew = new Set([...listScheduleDisable]);
    const listScheduleNew = listScheduleClone.map(item => {
      if (item.id === schedule.id && schedule.checked === item.checked) {
        if (schedule.checked === true && item.checked === true) {
          listScheduleDisableNew.add(schedule.id);
        } else {
          listScheduleDisableNew.delete(schedule.id);
        }
        return {
          ...item,
          checked: !schedule.checked,
        }
      }
      return item;
    })
    setListSchedule(listScheduleNew);
    setListScheduleDisable([...listScheduleDisableNew]);
  }

  const handleDeleteDoctor = async () => {
    if (isShowChangeSchedule && (listScheduleDisable.length || selectedRowKeys.length)) {
      try {
        const dataDelete = await ScheduleApis.deleteManySchedule({
          scheduleIds: listScheduleDisable.length ? listScheduleDisable : selectedRowKeys,
        });
        if (dataDelete.status === 200 && dataDelete.data === true) {
          getSchedules();
          toast.success('Thay đổi kế hoạch khám thành công');
          setShowChangeSchedule(false);
          setSelectedRowKeys([]);
        }
      } catch (error) {
        console.log('error: ', error);
        if (error?.response?.data?.error === 'APPOINTMENT_HAS_BEEN_BOOKED') {
          toast.warning('Lịch hẹn đã có người đặt, không thể thay đổi!')
          return;
        }
        toast.error('Thay đổi kế hoạch khám không thành công!')
      }
    }
  }

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      width: 100,
      render: (_, record) => (
        <span>{`${moment(record.timeStart).format('HH:mm')} - ${moment(record.timeEnd).format('HH:mm')}`}</span>
      )
    },
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: 'Số lượng bệnh nhân',
      dataIndex: 'maxCount',
      key: 'maxCount',
      width: 50,
    },
    {
      title: 'Đã đặt',
      dataIndex: 'booked',
      key: 'booked',
      width: 50,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 50,
      align: 'center',
      render: (_, record) => {
        let color = '', text = '';
        if (record.status === 'ACTIVE') {
          color = 'green';
          text = 'Hoạt động';
        }
        else if (record.status === 'CANCLE') {
          color = 'red';
          text = 'Đã huỷ';
        }
        else if (record.status === 'WAITING') {
          color = 'orange';
          text = 'Đang chờ';
        }
        else {
          color = 'red';
          text = 'Lỗi';
        }

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

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  return (
    <div>
      <h1>Quản lý lịch khám</h1>

      <div className='header_schedule'>
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
          onChange={onChange}
        />

        <div className='list_button'>
          <Button
            className='button'
            size="large"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setModalCreate(true)}
          >
            Thêm kế hoạch khám
          </Button>
        </div>
      </div>

      <div className='list_schedule'>
        <div className="title_list_schedule">
          Danh sách giờ khám
        </div>
        {/* <div className="description_list_schedule">Bấm vào từng khung giờ để có thể cập nhật lại kế hoạch khám.</div>
        {listSchedule && listSchedule.length ? (
          <Space wrap>
            {listSchedule.map((item, idx) => (
              <Button
                key={`button-${idx}`}
                type={item.checked ? 'primary' : ''}
                className={item.checked ? '' : 'button_origin'}
                onClick={() => handleCheckedSchedule(item)}
              >
                {moment(item.timeStart).format('HH:mm')} - {moment(item.timeEnd).format('HH:mm')}
              </Button>
            ))}
          </Space>
        ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<div>Không có giờ khám</div>} />} */}
      </div>

      {listScheduleDisable && listScheduleDisable.length > 0 && (
        <div className="button_update_schedules">
          <Button
            type='primary'
            onClick={() => setShowChangeSchedule(true)}
          >
            Cập nhật kế hoạch khám
          </Button>
        </div>
      )}

      {/* <CreateSchedule
        isShowModal={isModalCreate}
        handleCancelModal={() => setModalCreate(false)}
      /> */}

      <div className="table_list_schdule">

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
                    onClick={() => {
                      setShowChangeSchedule(true);
                    }}
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
          dataSource={listSchedule}
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
            // onChange: (page, pageSize) => {
            //   setPagination({
            //     ...pagination,
            //     page,
            //     pageSize,
            //   });
            // },
          }}
        />
      </div>

      <CreateSchedule
        isShowModal={isModalCreate}
        doctor={user}
        handleCancelModal={() => setModalCreate(false)}
      />

      <Modal
        open={isShowChangeSchedule}
        onOk={handleDeleteDoctor}
        onCancel={() => setShowChangeSchedule(false)}
        cancelText={'Hủy'}
        okText={'Cập nhật'}
        className='confirm_delete_label'
        width={400}
      >
        <h2 style={{ color: '#595959', fontWeight: 700, textAlign: 'center' }}>
          Bạn có muốn thay đổi kế hoạch khám không?
        </h2>
        <Space direction='vertical'>
          <Text>


          </Text>

          <div style={{ background: '#fdefe4', padding: '10px', borderRadius: '3px' }}>
            <Text style={{ fontWeight: 600, color: '#e59935' }}>
              <WarningFilled /> Lưu ý:
              <br />
            </Text>
            <Text> Sau khi thay đổi, hệ thống sẽ tự động gỡ giờ khám đã đươc bỏ chọn trong danh sách.
              <br /> Vui lòng cân nhắc trước khi cập nhật.
            </Text>
          </div>
        </Space>
      </Modal>
    </div>
  )
}

export default Schedules;
import React, { useEffect } from 'react'

import './topnav.css'

import { Link, useHistory, useLocation } from 'react-router-dom'

// import Dropdown from '../dropdown/Dropdown'

import ThemeMenu from '../thememenu/ThemeMenu'

import notifications from '../../assets/JsonData/notification.json'

import user_image from '../../assets/images/tuat.png'

import user_menu from '../../assets/JsonData/user_menus.json'
import { Avatar, Dropdown, Space, Table } from 'antd'
import { useState } from 'react'
import baseURL from '../../utils/url'
import { KeyOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'

const curr_user = {
    display_name: 'Tuat Tran',
    image: user_image
}

const renderNotificationItem = (item, index) => (
    <div className="notification-item" key={index}>
        <i className={item.icon}></i>
        <span>{item.content}</span>
    </div>
)

const renderUserToggle = (user) => (
    <div className="topnav__right-user">
        <div className="topnav__right-user__image">
            {user.image ? (
                <img src={user.image} alt="" />
            ) : (
                <Avatar style={{
                    color: '#f56a00',
                    backgroundColor: '#fde3cf'
                }}>
                    {user.display_name[0]}
                    {/* {`abc`.toLocaleUpperCase()} */}
                </Avatar>
            )}


        </div>
        <div className="topnav__right-user__name">
            {user.display_name}
        </div>
    </div>
)

const renderUserMenu = (item, index) => (
    <Link to='/' key={index}>
        <div className="notification-item">
            <i className={item.icon}></i>
            <span>{item.content}</span>
        </div>
    </Link>
)

const Topnav = ({ userData }) => {
    let location = useLocation();
    let history = useHistory();
    // const userDa = JSON.parse(localStorage.getItem('user'));
    const [name, setName] = useState('');

    useEffect(() => {
        if (userData && Object.keys(userData).length) {
            const nameUser = `${userData.firstName ? userData.firstName : ''} ${userData.middleName ? userData.middleName : ''} ${userData.lastName ? userData.lastName : ''}`.trim();
            setName(nameUser)
        }
    }, [userData])

    const PersonalInformation = () => {
        const pathName = location.pathname.split('/').slice(0, 2).join('/');
        history.push(`${pathName}/thong-tin-ca-nhan`);
    }

    const ChangePassword = () => {
        const pathName = location.pathname.split('/').slice(0, 2).join('/');
        history.push(`${pathName}/doi-mat-khau`);
    }

    const handleLogOut = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        history.push('/login');
    }

    const items = [
        {
            key: 'personal_information',
            label: (
                <div
                    // onClick={() => history.push('admin/thong-tin-ca-nhan')}
                    onClick={PersonalInformation}
                >
                    Thông tin cá nhân</div>
            ),
            icon: <UserOutlined style={{ fontSize: '17px', margin: '0 20px 0 10px' }} />,
        },
        {
            key: 'change_password',
            label: (
                <div
                    // onClick={() => history.push('admin/thong-tin-ca-nhan')}
                    onClick={ChangePassword}
                >
                    Đổi mật khẩu</div>
            ),
            icon: <KeyOutlined style={{ fontSize: '17px', margin: '0 20px 0 10px' }} />,
        },
        {
            key: 'log_out',
            label: (
                <div
                    onClick={handleLogOut}
                >
                    Đăng xuất</div>
            ),
            icon: <LogoutOutlined style={{ fontSize: '17px', margin: '0 20px 0 10px' }} />,
        },
    ];

    return (
        <div className='topnav'>
            <div className="topnav__search">
                {/* <input type="text" placeholder='Search here...' />
                <i className='bx bx-search'></i> */}
            </div>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    {/* dropdown here */}
                    {/* <Dropdown
                        customToggle={() => renderUserToggle({
                            display_name: name,
                            image: userData.avatar ? `${baseURL}${userData.avatar}` : null,
                        })}
                        contentData={user_menu}
                        renderItems={(item, index) => renderUserMenu(item, index)}
                    /> */}
                    <Dropdown menu={{ items }}>
                        <Space style={{ cursor: 'pointer' }}>
                            {userData?.avatar ? (
                                <Avatar src={`${baseURL}${userData?.avatar}`} />
                            ) : (
                                <Avatar style={{
                                    color: '#f56a00',
                                    backgroundColor: '#fde3cf'
                                }}>
                                    {name[0]}
                                    {/* {`abc`.toLocaleUpperCase()} */}
                                </Avatar>
                            )}
                            <span>{name}</span>
                        </Space>
                    </Dropdown>
                </div>
                <div className="topnav__right-item">
                    {/* <Dropdown
                        icon='bx bx-bell'
                        badge='12'
                        contentData={notifications}
                        renderItems={(item, index) => renderNotificationItem(item, index)}
                        renderFooter={() => <Link to='/'>View All</Link>}
                    /> */}
                    {/* dropdown here */}
                </div>
                <div className="topnav__right-item">
                    <ThemeMenu />
                </div>
            </div>
        </div>
    )
}

export default Topnav

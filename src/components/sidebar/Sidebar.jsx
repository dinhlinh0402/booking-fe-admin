import React, { useEffect } from 'react';

import { Link } from 'react-router-dom'

import './sidebar.css'

import logo from '../../assets/images/logo.png'

import sidebar_items_admin from '../../assets/JsonData/sidebar_routes.json';
import sidebar_items_doctor from '../../assets/JsonData/sidebar_routes_doctor.json';
import sidebar_items_manage_clinic from '../../assets/JsonData/sidebar_routers_manage_clinic.json';
import { useState } from 'react'

const SidebarItem = props => {

    const active = props.active ? 'active' : ''

    return (
        <div className="sidebar__item">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>
                    {props.title}
                </span>
            </div>
        </div>
    )
}

const Sidebar = props => {
    const [sidebarItems, setSidebarItems] = useState([]);

    useEffect(() => {
        console.log('role: ', props?.user?.role);
        if (props?.user?.role === 'ADMIN')
            setSidebarItems(sidebar_items_admin);
        else if (props && props.user && props.user.role === 'DOCTOR') {
            setSidebarItems(sidebar_items_doctor);
        } else if (props && props.user && props.user.role === 'MANAGER_CLINIC')
            setSidebarItems(sidebar_items_manage_clinic);
    }, [])

    const activeItem = sidebarItems?.findIndex(item => item.route === props.location.pathname)
    // console.log('props: ', props);
    // console.log('sidebarItems: ', sidebarItems);


    return (
        <div className='sidebar'>
            <div className="sidebar__logo">
                <img src={logo} alt="company logo" />
            </div>
            {sidebarItems && sidebarItems.length && sidebarItems.map((item, index) => (
                <Link to={item.route} key={index}>
                    <SidebarItem
                        title={item.display_name}
                        icon={item.icon}
                        active={index === activeItem}
                    />
                </Link>
            ))
            }
        </div>
    )
}

export default Sidebar
import React, { useEffect, useState } from 'react'

import { Redirect, Route, Switch, useHistory } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import CustomersTest from '../pages/Customers-2';
import Customers from '../pages/Customers/index';
import Products from '../pages/Products'
import TestRouter from '../pages/TestRouter'
import RequireAuth from '../router/AuthRouter';
import Doctor from '../pages/Doctor';
import CareStaff from '../pages/CareStaff';
import Clinic from '../pages/Clinic';
import Specialty from '../pages/Specialty';
import Schedules from '../pages/Schedules';
import DetailCustomer from '../pages/Customers/components/Detail';
import DetailDoctor from '../pages/Doctor/components/DetailDoctor';
import DetailClinic from '../pages/Clinic/components/DetailClinic';
import AuthApis from '../apis/Auth';
import { toast } from 'react-toastify';
import Topnav from './topnav/TopNav';

const RoutesDoctor = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    let history = useHistory();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        console.log('router admin: ', accessToken);
        if (accessToken)
            checkToken();
    }, []);
    // const user = JSON.parse(localStorage.getItem('user'));

    const checkToken = async () => {
        try {
            console.log('getme', localStorage.getItem('accessToken'));
            const dataCheckToken = await AuthApis.authMe();
            if (dataCheckToken?.data) {
                setUser(dataCheckToken.data);
            }
            console.log('asdasd: ', dataCheckToken);
        } catch (error) {
            console.log('error: ', error);
            toast.error('Hết phiên đăng nhập!');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            history.push('/login');
        }
    }
    return (
        <div className="layout__content">
            <Topnav userData={user} />
            <div className="layout__content-main">
                <Switch>
                    <RequireAuth>
                        <Route path='/he-thong' exact render={() => <div>bac si hoac manage clinic</div>} />
                    </RequireAuth>


                    <Route path='*' render={() => <div>404</div>} />
                </Switch>
            </div>
        </div>

    )
}

export default RoutesDoctor;
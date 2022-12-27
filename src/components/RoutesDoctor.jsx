import React, { useEffect } from 'react'

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

const RoutesDoctor = () => {
    let history = useHistory();

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async() => {
        try {
            const dataCheckToken = await AuthApis.authMe();
        } catch (error) {
            console.log('error: ', error);
            toast.error('Hết phiên đăng nhập!');
            localStorage.removeItem('accessToken');   
            localStorage.removeItem('user');   
            history.push('/login'); 
        } 
    }
    return (
        <Switch>
          <Route path='/he-thong' exact render={() => <div>bac si hoac manage clinic</div>} />
          <Route path='*' render={() => <div>404</div>} />
        </Switch>
    )
}

export default RoutesDoctor;

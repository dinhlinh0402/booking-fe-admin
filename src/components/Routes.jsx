import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import CustomersTest from '../pages/Customers-2';
import Customers from '../pages/Customers/index';
import Products from '../pages/Products'
import TestRouter from '../pages/TestRouter'
import RequireAuth from '../router/AuthRouter';
import Doctor from '../pages/Doctor';
import CareStaff from '../pages/CareStaff';
import Clinic from '../pages/Clinic';

const RoutesAdmin = () => {
    return (
        <Switch>
            <Route path='/admin' exact component={Dashboard} />
            {/* <Route path='/admin/quan-ly-khach-hang' component={Customers} /> */}
            <Route path='/admin/quan-ly-khach-hang'>
                <RequireAuth>
                    <Customers />
                </RequireAuth>
            </Route>
            <Route path='/admin/quan-ly-bac-si'>
                <RequireAuth>
                    <Doctor />
                </RequireAuth>
            </Route>

            <Route path='/admin/nhan-vien-cham-soc'>
                <RequireAuth>
                    <CareStaff />
                </RequireAuth>
            </Route>

            <Route path='/admin/quan-ly-phong-kham'>
                <RequireAuth>
                    <Clinic />
                </RequireAuth>
            </Route>

            <Route path='/admin/test' component={TestRouter} />
            <Route path='*' render={() => <div>404</div>} />
        </Switch>
    )
}

export default RoutesAdmin;

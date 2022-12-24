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
import Specialty from '../pages/Specialty';
import Schedules from '../pages/Schedules';
import DetailCustomer from '../pages/Customers/components/Detail';
import DetailDoctor from '../pages/Doctor/components/DetailDoctor';
import DetailClinic from '../pages/Clinic/components/DetailClinic';

const RoutesAdmin = () => {
    return (
        <Switch>
            <Route path='/admin' exact component={Dashboard} />
            {/* <Route path='/admin/quan-ly-khach-hang' component={Customers} /> */}
            {/* <Route path='/admin/quan-ly-khach-hang'>
                <RequireAuth>
                    <Customers />
                </RequireAuth>
            </Route> */}
            <Route path='/admin/quan-ly-khach-hang'>
                <Switch>
                    <Route exact path='/admin/quan-ly-khach-hang'>
                        <RequireAuth>
                            <Customers />
                        </RequireAuth>
                    </Route>
                    <Route exact path='/admin/quan-ly-khach-hang/chi-tiet/:customerId'>
                        <RequireAuth>
                            <DetailCustomer />
                        </RequireAuth>
                    </Route>
                    <Route path='*' render={() => <div>404</div>} />
                </Switch>
            </Route>
            <Route path='/admin/quan-ly-bac-si'>
                <Switch>
                    <Route exact path='/admin/quan-ly-bac-si'>
                        <RequireAuth>
                            <Doctor />
                        </RequireAuth>
                    </Route>
                    <Route exact path='/admin/quan-ly-bac-si/chi-tiet/:doctorId'>
                        <RequireAuth>
                            <DetailDoctor />
                        </RequireAuth>
                    </Route>
                    <Route path='*' render={() => <div>404</div>} />
                </Switch>

            </Route>

            <Route path='/admin/nhan-vien-cham-soc'>
                <RequireAuth>
                    <CareStaff />
                </RequireAuth>
            </Route>

            <Route path='/admin/quan-ly-phong-kham'>
                <Switch>
                    <Route exact path='/admin/quan-ly-phong-kham'>
                        <RequireAuth>
                            <Clinic />
                        </RequireAuth>
                    </Route>
                    <Route exact path='/admin/quan-ly-phong-kham/chi-tiet/:clinicId'>
                        <RequireAuth>
                            <DetailClinic />
                        </RequireAuth>
                    </Route>
                    <Route path='*' render={() => <div>404</div>} />
                </Switch>
            </Route>

            <Route path='/admin/quan-ly-chuyen-khoa'>
                <RequireAuth>
                    <Specialty />
                </RequireAuth>
            </Route>

            <Route path='/admin/quan-ly-lich-kham'>
                <RequireAuth>
                    <Schedules />
                </RequireAuth>
            </Route>

            <Route path='/admin/test' component={TestRouter} />
            <Route path='*' render={() => <div>404</div>} />
        </Switch>
    )
}

export default RoutesAdmin;

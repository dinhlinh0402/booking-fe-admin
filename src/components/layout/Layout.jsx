import React, { useEffect } from 'react'

import './layout.scss';

import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
// import Routes from '../Routes'

import { BrowserRouter, Redirect, Route, Switch, useHistory } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import ThemeAction from '../../redux/actions/ThemeAction';
import TestRouter from '../../pages/TestRouter';
import RoutesAdmin from '../Routes';
import Login from '../../pages/Auth/Login';
import RoutesDoctor from '../RoutesDoctor';
import AuthApis from '../../apis/Auth';
import { toast } from 'react-toastify';
import ForgotPassword from '../../pages/Auth/ForgotPassword';
import NotFoundPage from '../../pages/NotFound';

const Layout = () => {
    // const [user, setUser] = useState({})
    let history = useHistory();
    // let location = useLocation();
    console.log('history: ', history);

    const themeReducer = useSelector(state => state.ThemeReducer)

    const dispatch = useDispatch();

    useEffect(() => {
        const themeClass = localStorage.getItem('themeMode', 'theme-mode-light');
        const colorClass = localStorage.getItem('colorMode', 'theme-mode-light');

        dispatch(ThemeAction.setMode(themeClass))
        dispatch(ThemeAction.setColor(colorClass))
    }, [dispatch])

    // useEffect(() => {
    //     checkToken();
    // }, []);

    /// check user ở đây
    const checkToken = async () => {
        try {
            const dataCheckToken = await AuthApis.authMe();
            console.log('dataCheckToken: ', dataCheckToken);
        } catch (error) {
            console.log('error: ', error);
            toast.error('Hết phiên đăng nhập!');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            history.push('/login');
        }
    }

    // const user = JSON.parse(localStorage.getItem('user'));
    // const accessToken = localStorage.getItem('accessToken');
    // console.log('use: ', user);

    return (
        <>
            <BrowserRouter>
                {/* <Route path='/test-router-3'>
                    <TestRouter />
                </Route> */}


                <Switch>
                    <Redirect exact from="/" to='/login' />
                    <Route path='/quen-mat-khau' component={ForgotPassword} />

                    {/* <Route path='/' exact render={() => <div>home</div>} /> */}

                    <Route path='/login' exact component={Login} />

                    {/* {user && user.role && user.role === 'ADMIN' && ( */}
                    {/* <Route path='/admin' render={(props) => (
                        <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                            <Sidebar {...{ ...props, user }} />
                            <div className="layout__content">
                                <TopNav userData={user} />
                                <div className="layout__content-main">
                                    <Switch>
                                        <RoutesAdmin />
                                    </Switch>

                                </div>
                            </div>
                        </div>
                    )} /> */}

                    <Route path='/admin' render={(props) => (
                        <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                            <Sidebar {...{ ...props }} />
                            <RoutesAdmin />
                        </div>
                    )} />


                    {/* <Route path='/test-router' render={() => <div style={{marginBottom: '10px'}}>Test</div>}/> */}
                    {/* {user && user.role && (user.role === 'DOCTOR' || user.role === 'MANAGER_CLINIC') && (
                        <Route path='/he-thong' render={(props) => (
                            <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                                <Sidebar {...{ ...props, user }} />
                                <div className="layout__content">
                                    <TopNav userData={user} />
                                    <div className="layout__content-main">
                                        <Switch>
                                            <RoutesDoctor />
                                        </Switch>
                                    </div>
                                </div>
                            </div>
                        )} />
                    )} */}

                    <Route path='/he-thong' render={(props) => (
                        <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                            <Sidebar {...{ ...props }} />
                            <RoutesDoctor />
                        </div>
                    )} />

                    <Route path='*' component={NotFoundPage} />
                </Switch>
            </BrowserRouter>

        </>
    )
}

export default Layout

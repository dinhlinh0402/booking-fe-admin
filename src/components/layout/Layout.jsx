import React, { useEffect } from 'react'

import './layout.scss';

import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
// import Routes from '../Routes'

import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import ThemeAction from '../../redux/actions/ThemeAction';
import TestRouter from '../../pages/TestRouter';
import RoutesAdmin from '../Routes';

const Layout = () => {

    const themeReducer = useSelector(state => state.ThemeReducer)

    const dispatch = useDispatch()

    useEffect(() => {
        const themeClass = localStorage.getItem('themeMode', 'theme-mode-light')

        const colorClass = localStorage.getItem('colorMode', 'theme-mode-light')

        dispatch(ThemeAction.setMode(themeClass))

        dispatch(ThemeAction.setColor(colorClass))
    }, [dispatch])

    const user = JSON.parse(localStorage.getItem('user'));
    console.log('user: ', user);

    return (
        <>
            <BrowserRouter>
                {/* <Route path='/test-router-3'>
                    <TestRouter />
                </Route> */}

                <Switch>
                    <Route path='/' exact render={() => <div>login</div>} />

                    {user && user.role && user.role === 'ADMIN' && (
                        <Route path='/admin' render={(props) => (
                            <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                                <Sidebar {...{ ...props, user }} />
                                <div className="layout__content">
                                    <TopNav />
                                    <div className="layout__content-main">
                                        <Switch>
                                            <RoutesAdmin />
                                        </Switch>

                                    </div>
                                </div>
                            </div>
                        )} />
                    )}


                    {/* <Route path='/test-router' render={() => <div style={{marginBottom: '10px'}}>Test</div>}/> */}
                    {user && user.role && (user.role === 'DOCTOR' || user.role === 'MANAGER_CLINIC') && (
                        <Route path='/he-thong' render={(props) => (
                            <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                                <Sidebar {...{ ...props, user }} />
                                <div className="layout__content">
                                    <TopNav />
                                    <div className="layout__content-main">
                                        <Switch>
                                            <Route path='/he-thong' exact render={() => <div>bac si hoac manage clinic</div>} />
                                            <Route path='*' render={() => <div>404</div>} />
                                        </Switch>
                                    </div>
                                </div>
                            </div>
                        )} />
                    )}

                    <Route path='*' render={() => <div>404</div>} />
                </Switch>
            </BrowserRouter>

        </>
    )
}

export default Layout

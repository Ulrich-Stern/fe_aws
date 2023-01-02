import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux';
import { ToastContainer } from 'react-toastify';
import 'antd/dist/antd.css';
import './App.scss';

import {
    userIsAuthenticated,
    userIsNotAuthenticated,
} from '../hoc/authentication';

import { path } from '../utils';

// import Login from "../routes/Login";
import Dashboard from './home/Dashboard/Dashboard';
import Login from './home/Login/Login';
// import Homepage1 from './home/homepage';
import Signup from '../containers/home/Signup/Signup';
import System from '../routes/System';
import Addressbook from './home/Addressbook/Addressbook';
import Trackings from './home/Tracking/Trackings';
import Tracking from './home/Tracking/Tracking';
import Orders from './home/Order/Orders';
import Order from './home/Order/Order';
import Invoices from './home/Invoice/Invoices';
import NewOrder from './home/NewOrder/NewOrder';
import NewOrderMulti from './home/NewOrderMulti/NewOrderMulti';
import Setting from './home/Setting/Setting';
import ChangePass from './home/Setting/ChangePass';
import Payment from './home/Setting/Payment/Payment';
import PaymentDetail from './home/Setting/Payment/PaymentDetail';
import ConfidentScore from './home/Setting/ConfidentScore';

import { CustomToastCloseButton } from '../components/CustomToast';
import ConfirmModal from '../components/ConfirmModal';

class App extends Component {
    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                {/* lưu lại lịch sử của các api, cache dữ liệu lại trên phía frontend */}
                <Router history={history}>
                    <div className="main-container">
                        <ConfirmModal />
                        {/* {this.props.isLoggedIn && <Header />} */}

                        <span className="content-container">
                            {/* Quản lý đường link, route đều ở đây */}
                            <Switch>
                                {/* route này không cần đều kiện */}
                                <Route
                                    path={path.LOGIN}
                                    component={userIsNotAuthenticated(Login)}
                                />
                                <Route
                                    path={path.SIGNUP}
                                    component={userIsNotAuthenticated(Signup)}
                                />
                                {/* route này cần đều kiện đã login, nếu không sẽ redirect về login page */}
                                <Route
                                    path={path.HOME}
                                    exact
                                    component={userIsAuthenticated(Dashboard)}
                                />
                                {/* admin page */}
                                <Route
                                    path={path.SYSTEM}
                                    component={userIsAuthenticated(System)}
                                />
                                {/* <Route
                                    path="/homepage1"
                                    exact
                                    component={userIsAuthenticated(Homepage1)}
                                /> */}
                                <Route
                                    path="/address-book"
                                    exact
                                    component={userIsAuthenticated(Addressbook)}
                                />
                                <Route
                                    path="/trackings"
                                    exact
                                    component={userIsAuthenticated(Trackings)}
                                />
                                <Route
                                    path="/tracking"
                                    exact
                                    component={userIsAuthenticated(Tracking)}
                                />
                                <Route
                                    path="/orders"
                                    exact
                                    component={userIsAuthenticated(Orders)}
                                />
                                {/* Chi tiết đơn hàng */}
                                <Route
                                    path="/order"
                                    exact
                                    component={userIsAuthenticated(Order)}
                                />
                                <Route
                                    path="/invoices"
                                    exact
                                    component={userIsAuthenticated(Invoices)}
                                />
                                <Route
                                    path="/new-order"
                                    exact
                                    component={userIsAuthenticated(NewOrder)}
                                />
                                <Route
                                    path="/new-order-multi"
                                    exact
                                    component={userIsAuthenticated(
                                        NewOrderMulti
                                    )}
                                />
                                <Route
                                    path="/setting"
                                    exact
                                    component={userIsAuthenticated(Setting)}
                                />
                                <Route
                                    path="/change-pass"
                                    exact
                                    component={userIsAuthenticated(ChangePass)}
                                />
                                <Route
                                    path="/confident-score"
                                    exact
                                    component={userIsAuthenticated(
                                        ConfidentScore
                                    )}
                                />
                                <Route
                                    path="/payment"
                                    exact
                                    component={userIsAuthenticated(Payment)}
                                />
                                <Route
                                    path="/payment-detail"
                                    exact
                                    component={userIsAuthenticated(
                                        PaymentDetail
                                    )}
                                />

                                <Route
                                    component={() => {
                                        return <Redirect to={path.HOME} />;
                                    }}
                                />
                            </Switch>
                        </span>

                        <ToastContainer
                            className="toast-container"
                            toastClassName="toast-item"
                            bodyClassName="toast-item-body"
                            autoClose={3000}
                            hideProgressBar={true}
                            pauseOnHover={true}
                            pauseOnFocusLoss={true}
                            closeOnClick={true}
                            draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        />
                    </div>
                </Router>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        started: state.app.started,
        // truyền từ redux, điều kiện để có login
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

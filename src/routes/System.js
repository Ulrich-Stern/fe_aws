import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/admin/UserManage/UserManage';
import UserManageDetail from '../containers/admin/UserManage/UserManageDetail';
import ProductManage from '../containers/admin/ProductManage';
import RegisterPackageGroupOrAcc from '../containers/admin/RegisterPackageGroupOrAcc';
import Header from '../containers/admin/Header/Header';
import { path } from '../utils/constant';
import OrderManageProcess from '../containers/admin/OrderManage/OrderManageProcess/OrderManageProcess';
import OrderManageDetail from '../containers/admin/OrderManage/OrderManageDetail/OrderManageDetail';
import UserPayment from '../containers/admin/UserManage/UserPayment';
import UserAddr from '../containers/admin/UserManage/UserAddr';
import VehicleManage from '../containers/admin/VehicleManage/VehicleManage';
import InvoiceManage from '../containers/admin/InvoiceManage/InvoiceManage';
import PriceManage from '../containers/admin/PriceManage/PriceManage';
import AdminHome from '../containers/admin/AdminHome/AdminHome';
import PriceCodeManage from '../containers/admin/PriceCodeManage/PriceCodeManage';

class System extends Component {
    render() {
        const { systemMenuPath } = this.props;
        if (
            this.props &&
            this.props.userInfo &&
            this.props.userInfo.role !== 'admin'
        ) {
            // console.log('ko phai admin');
            return <Redirect to={path.HOME} />;
        }
        return (
            <>
                <div className="custom-background">
                    {this.props.isLoggedIn && <Header />}

                    <div className="system-list">
                        <Switch>
                            {/* admin home */}
                            <Route
                                path={path.ADMIN_HOME}
                                component={AdminHome}
                            />
                            {/* user manage */}
                            <Route
                                path={path.USER_MANAGE}
                                component={UserManage}
                            />
                            <Route
                                path={path.USER_MANAGE_DETAIL}
                                component={UserManageDetail}
                            />
                            <Route path={path.USER_ADDR} component={UserAddr} />

                            <Route
                                path={path.USER_PAYMENT}
                                component={UserPayment}
                            />

                            {/* order manage */}
                            <Route
                                path={path.ORDER_MANAGE_PROCESS}
                                component={OrderManageProcess}
                            />
                            <Route
                                path={path.ORDER_MANAGE_DETAIL}
                                component={OrderManageDetail}
                            />

                            {/* vehicle manage */}
                            <Route
                                path={path.VEHICLE_MANAGE}
                                component={VehicleManage}
                            />

                            <Route
                                path="/system/product-manage"
                                component={ProductManage}
                            />
                            <Route
                                path="/system/register-package-group-or-account"
                                component={RegisterPackageGroupOrAcc}
                            />

                            {/* Invoice Manage */}
                            <Route
                                path={path.INVOICE_MANAGE}
                                component={InvoiceManage}
                            />

                            {/* Price Manage */}
                            <Route
                                path={path.PRICE_MANAGE}
                                component={PriceManage}
                            />

                            {/* Price code manage */}
                            <Route
                                path={path.PRICE_CODE_MANAGE}
                                component={PriceCodeManage}
                            />

                            <Route
                                component={() => {
                                    return <Redirect to={systemMenuPath} />;
                                }}
                            />
                        </Switch>
                    </div>
                    {/* footer */}
                    <div className="custom-footer">
                        <p>
                            <strong>PN Logistic</strong> - version 1.0
                        </p>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);

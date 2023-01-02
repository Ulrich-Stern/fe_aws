import React, { Component } from 'react';

import { connect } from 'react-redux';

import { path } from '../../../utils/constant';

class AdminHome extends Component {
    state = {};

    componentDidMount() {}

    render() {
        return (
            <div className="custom-container">
                {/* title */}
                <div className="text-center">
                    <div className="cf-title-02 cf-title-alt-two">
                        <h3>Trang chủ</h3>
                    </div>
                </div>

                {/* content */}
                <div class="container-fluid px-4">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Vận đơn</h5>
                                    <p className="card-text">
                                        Quản lý các đơn vận chuyển của khách
                                        hàng
                                    </p>

                                    <a
                                        href={path.ORDER_MANAGE_PROCESS}
                                        className="btn btn-primary"
                                    >
                                        Danh sách vận đơn
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Khách hàng</h5>
                                    <p className="card-text">
                                        Quản lý danh sách khách hàng của PN
                                        Logistic
                                    </p>
                                    <a
                                        href={path.USER_MANAGE}
                                        className="btn btn-primary"
                                    >
                                        Danh sách khách hàng
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Hóa đơn</h5>
                                    <p className="card-text">
                                        Quản lý các hóa đơn vận chuyển của khách
                                        hàng
                                    </p>
                                    <a
                                        href={path.INVOICE_MANAGE}
                                        className="btn btn-primary"
                                    >
                                        Danh sách hóa đơn
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Quản lý chung
                                    </h5>
                                    <p className="card-text">
                                        Quản lý giá cước, giá dịch vụ và đội xe
                                    </p>
                                    <a
                                        href={path.PRICE_MANAGE}
                                        className="btn btn-primary"
                                    >
                                        Bảng giá cước xe
                                    </a>
                                    &nbsp;
                                    <a
                                        href={path.PRICE_CODE_MANAGE}
                                        className="btn btn-primary"
                                    >
                                        Bảng giá dịch vụ
                                    </a>
                                    &nbsp;
                                    <a
                                        href={path.VEHICLE_MANAGE}
                                        className="btn btn-primary"
                                    >
                                        Đội xe
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminHome);

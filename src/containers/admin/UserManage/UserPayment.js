import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import HeaderTagAdmin from '../../common/HeaderTag/HeaderTagAdmin';
import { Menu, Button } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

import { Table } from 'antd';

import { getAllPayerByOwnUserService } from '../../../services/payerService';
import { path } from '../../../utils/constant';

const { Column } = Table;

class UserPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            isError: false,
            dataFromApi: [],
        };
    }

    async componentDidMount() {
        try {
            // lấy userId từ component cha
            // console.log('check addr prop', this.props);
            // let locationState = this.props.location.state;
            // console.log('check locationStte:   ', locationState);
            // let userId = locationState.userId;
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('userId');
            // console.log('check userId', userId);
            // lấy user theo id
            let usersData = await getAllPayerByOwnUserService(userId);
            let copyState = { ...this.state };
            copyState.dataFromApi = usersData.payer;

            this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
            this.setState({ ...copyState, userId });
            // console.log('check state123', this.state);
        } catch (error) {
            console.log('eror');
            this.setState({ isError: true });
        }
    }

    render() {
        // case: undefined user id
        if (this.state.isError) {
            return <Redirect to="/system/user-manage" />;
        }
        // normal case
        else {
            let paymentData = this.state.dataFromApi;
            // console.log(addressData);
            return (
                <>
                    <div className="custom-container">
                        {/* <HeaderTagAdmin
                            breadcrumb1="Quản lý Khách hàng"
                            breadcrumb2="Thong tin thanh toan"
                        /> */}

                        <br></br>
                        <Link to={path.USER_MANAGE}>
                            <Button>
                                <RollbackOutlined /> Quay lại
                            </Button>
                        </Link>
                        <br></br>

                        <Menu
                            mode="horizontal"
                            className="menu-option"
                            selectedKeys={path.USER_PAYMENT}
                        >
                            <Menu.Item key={path.USER_MANAGE_DETAIL}>
                                <Link
                                    to={
                                        path.USER_MANAGE_DETAIL +
                                        '?userId=' +
                                        this.state.userId
                                    }
                                >
                                    {' '}
                                    Chi tiết
                                </Link>
                            </Menu.Item>

                            <Menu.Item key={path.USER_ADDR}>
                                <Link
                                    to={
                                        path.USER_ADDR +
                                        '?userId=' +
                                        this.state.userId
                                    }
                                >
                                    {' '}
                                    Sổ địa chỉ{' '}
                                </Link>
                            </Menu.Item>

                            <Menu.Item key={path.USER_PAYMENT}>
                                <Link
                                    to={
                                        path.USER_PAYMENT +
                                        '?userId=' +
                                        this.state.userId
                                    }
                                >
                                    {' '}
                                    Thông tin thanh toán{' '}
                                </Link>
                            </Menu.Item>
                        </Menu>
                        <div className="tab-container">
                            <Table
                                dataSource={paymentData}
                                scroll={{
                                    x: 'calc(550px + 50%)',
                                    y: 440,
                                }}
                                size="middle"
                                style={{ height: '540px' }}
                                selectedRowKeys="abc"
                            >
                                <Column
                                    title="#"
                                    key="no"
                                    dataIndex="no"
                                    width="50px"
                                    render={(text, object, index) => index + 1}
                                />
                                <Column
                                    title="Tên"
                                    key="payer_name"
                                    dataIndex="payer_name"
                                    width="100px"
                                    rowSpan="3"
                                    className="moreInfo-listOrder"
                                />
                                <Column
                                    title="Phương thức thanh toán"
                                    key="payment_type"
                                    dataIndex="payment_type"
                                    width="100px"
                                    rowSpan="3"
                                    className="moreInfo-listOrder"
                                />
                                <Column
                                    title="Số điện thoại"
                                    key="phone"
                                    dataIndex="phone"
                                    width="100px"
                                    rowSpan="3"
                                    className="moreInfo-listOrder"
                                />
                                <Column
                                    title="Ngân hàng"
                                    key="bank"
                                    dataIndex="bank"
                                    width="100px"
                                    rowSpan="3"
                                    className="moreInfo-listOrder"
                                />
                                <Column
                                    title="Số tài khoản"
                                    key="atm_id"
                                    dataIndex="atm_id"
                                    width="100px"
                                    rowSpan="3"
                                    className="moreInfo-listOrder"
                                />
                            </Table>
                        </div>
                    </div>
                </>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPayment);

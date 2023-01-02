import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Layout, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import HeaderTag from '../../common/HeaderTag/HeaderTag';
import MenuOption from '../../common/MenuOption/MenuOption';
import { FormattedMessage } from 'react-intl';

import { Card, Avatar, Tag } from 'antd';
import {
    WarningOutlined,
    CheckCircleOutlined,
    DollarCircleOutlined,
    PhoneOutlined,
    HomeOutlined,
    UserOutlined,
    CodeSandboxOutlined,
    SlidersOutlined,
    ColumnWidthOutlined,
    FieldTimeOutlined,
    BankOutlined,
    CarOutlined,
    CarryOutOutlined,
    ShoppingCartOutlined,
    ArrowRightOutlined,
    FormOutlined,
} from '@ant-design/icons';
import {
    getOrderByStatusService,
    getOrderByStatusInProcessService,
    initTableOrderService,
    getAllOrderByOwnUserInitTableService,
} from '../../../services/orderService';
import { ORDER_STATUS } from '../../../utils/constant';
import { path } from '../../../utils/constant';
import { dateFormat, CommonUtils } from '../../../utils';

import * as actions from '../../../store/actions';

import external_confirm_data_xnimrodx_lineal_xnimrodx from '../../../assets/images/external-confirm-data-xnimrodx-lineal-xnimrodx.png';

import external_Confirm_accept_others_inmotus_design_3 from '../../../assets/images/external-Confirm-accept-others-inmotus-design-3.png';

import calendar_week12 from '../../../assets/images/calendar-week12.png';

import handcart from '../../../assets/images/handcart.png';

import truck_v1 from '../../../assets/images/truck--v1.png';

import checkmark from '../../../assets/images/checkmark.png';

import error_v1 from '../../../assets/images/error--v1.png';

const { Sider, Content } = Layout;

class Trackings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            own_user: this.props.userInfo._id,

            // List order tracking
            dataFromApi: [],
            orderList: [],

            // Statistical
            no_ORDER_STATUS_1: 0,
            no_ORDER_STATUS_2: 0,
            no_ORDER_STATUS_3: 0,
            no_ORDER_STATUS_4: 0,
            no_ORDER_STATUS_5: 0,
            no_ORDER_STATUS_6: 0,
            no_ORDER_STATUS_7: 0,
            no_ORDER_STATUS_8: 0,
            no_ORDER_STATUS_9: 0,
        };
    }

    async componentDidMount() {
        // handle data of order list
        await this.getAllOrderByOwnUser();

        await this.getNumberOfOrder();

        await this.props.initTableOrderRedux(this.state.dataFromApi);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.orderListRedux !== this.props.orderListRedux) {
            this.setState(
                {
                    orderList: this.props.orderListRedux,
                },
                () => {}
            );
        }
    }

    getNumberOfOrder = async () => {
        try {
            let own_user = this.state.own_user;
            let no_ORDER_STATUS_1 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_1,
                own_user
            );
            no_ORDER_STATUS_1 = no_ORDER_STATUS_1.order.length;

            let no_ORDER_STATUS_2 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_2,
                own_user
            );
            no_ORDER_STATUS_2 = no_ORDER_STATUS_2.order.length;

            let no_ORDER_STATUS_3 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_3,
                own_user
            );
            no_ORDER_STATUS_3 = no_ORDER_STATUS_3.order.length;

            let no_ORDER_STATUS_4 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_4,
                own_user
            );
            no_ORDER_STATUS_4 = no_ORDER_STATUS_4.order.length;

            let no_ORDER_STATUS_5 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_5,
                own_user
            );
            no_ORDER_STATUS_5 = no_ORDER_STATUS_5.order.length;

            let no_ORDER_STATUS_6 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_6,
                own_user
            );
            no_ORDER_STATUS_6 = no_ORDER_STATUS_6.order.length;

            let no_ORDER_STATUS_7 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_7,
                own_user
            );
            no_ORDER_STATUS_7 = no_ORDER_STATUS_7.order.length;

            let no_ORDER_STATUS_8 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_8,
                own_user
            );
            no_ORDER_STATUS_8 = no_ORDER_STATUS_8.order.length;

            let no_ORDER_STATUS_9 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_9,
                own_user
            );
            no_ORDER_STATUS_9 = no_ORDER_STATUS_9.order.length;

            let copyState = { ...this.state };
            copyState.no_ORDER_STATUS_1 = no_ORDER_STATUS_1;
            copyState.no_ORDER_STATUS_2 = no_ORDER_STATUS_2;
            copyState.no_ORDER_STATUS_3 = no_ORDER_STATUS_3;
            copyState.no_ORDER_STATUS_4 = no_ORDER_STATUS_4;
            copyState.no_ORDER_STATUS_5 = no_ORDER_STATUS_5;
            copyState.no_ORDER_STATUS_6 = no_ORDER_STATUS_6;
            copyState.no_ORDER_STATUS_7 = no_ORDER_STATUS_7;
            copyState.no_ORDER_STATUS_8 = no_ORDER_STATUS_8;
            copyState.no_ORDER_STATUS_9 = no_ORDER_STATUS_9;

            this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
        } catch (error) {
            console.log('Error:', error);
        }
    };

    getAllOrderByOwnUser = async () => {
        try {
            let userId = this.props.userInfo._id;
            let orders = await getAllOrderByOwnUserInitTableService(userId);
            // console.log('orders:', orders);
            let copyState = { ...this.state };
            copyState.dataFromApi = orders.order;

            this.setState(
                {
                    ...copyState,
                },
                () => {
                    // console.log('state:', this.state);
                }
            );
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    render() {
        let orderList = this.state.orderList;
        return (
            <>
                <Layout>
                    <HeaderTag
                        breadcrumb1={<FormattedMessage id="common.dashboard" />}
                        breadcrumb2={
                            <FormattedMessage id="menu.pages.tracking" />
                        }
                    />
                    <Layout>
                        <Sider width="256" id="main">
                            <MenuOption />
                        </Sider>
                        <Layout
                            className="site-layout-background-neworder"
                            style={{
                                padding: '24px 24px',
                                // height: 'calc(~"100vh - 50px")',
                            }}
                        >
                            <Content>
                                {/* Label status order */}
                                <Row justify="start" gutter={[24, 12]}>
                                    {/* Chờ xác nhận */}
                                    <Col span={4} className="card_right">
                                        <Card
                                            className="fa_card"
                                            bordered={false}
                                            bodyStyle={{
                                                padding: '12px 0',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Avatar
                                                // src="https://img.icons8.com/external-xnimrodx-lineal-xnimrodx/64/000000/external-confirm-data-xnimrodx-lineal-xnimrodx.png"
                                                src={
                                                    external_confirm_data_xnimrodx_lineal_xnimrodx
                                                }
                                                className="icon_tracking"
                                            />
                                            <span className="fa_text">
                                                <FormattedMessage id="order.wait_confirm" />
                                            </span>
                                            <span className="fa_number">
                                                {this.state.no_ORDER_STATUS_2}
                                            </span>
                                        </Card>
                                    </Col>
                                    {/* Đã xác nhận */}
                                    <Col span={4} className="card_right">
                                        <Card
                                            className="fa_card"
                                            bordered={false}
                                            bodyStyle={{
                                                padding: '12px 0',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Avatar
                                                // src="https://img.icons8.com/external-others-inmotus-design/67/000000/external-Confirm-accept-others-inmotus-design-3.png"
                                                src={
                                                    external_Confirm_accept_others_inmotus_design_3
                                                }
                                                className="icon_tracking"
                                            />
                                            <span className="fa_text">
                                                <FormattedMessage id="order.confirmed" />
                                            </span>
                                            <span className="fa_number">
                                                {this.state.no_ORDER_STATUS_3}
                                            </span>
                                        </Card>
                                    </Col>
                                    {/* Đang lên lịch */}
                                    <Col span={4} className="card_right">
                                        <Card
                                            className="fa_card"
                                            bordered={false}
                                            bodyStyle={{
                                                padding: '12px 0',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Avatar
                                                // src="https://img.icons8.com/color/48/7950F2/calendar-week12.png"
                                                src={calendar_week12}
                                                className="icon_tracking"
                                            />
                                            <span className="fa_text">
                                                <FormattedMessage id="order.scheduling" />
                                            </span>
                                            <span className="fa_number">
                                                {this.state.no_ORDER_STATUS_4}
                                            </span>
                                        </Card>
                                    </Col>
                                    {/* Đang bốc hàng */}
                                    <Col span={4} className="card_right">
                                        <Card
                                            className="fa_card"
                                            bordered={false}
                                            bodyStyle={{
                                                padding: '12px 0',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Avatar
                                                // src="https://img.icons8.com/ios-glyphs/30/000000/handcart.png"
                                                src={handcart}
                                                className="icon_tracking"
                                            />
                                            <span className="fa_text">
                                                <FormattedMessage id="order.uploading" />
                                            </span>
                                            <span className="fa_number">
                                                {this.state.no_ORDER_STATUS_5}
                                            </span>
                                        </Card>
                                    </Col>

                                    {/* Đang vận chuyển  */}
                                    <Col span={4} className="card_right">
                                        <Card
                                            className="fa_card"
                                            bordered={false}
                                            bodyStyle={{
                                                padding: '12px 0',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Avatar
                                                // src="https://img.icons8.com/color/48/000000/truck--v1.png"
                                                src={truck_v1}
                                                className="icon_tracking"
                                            />
                                            <span className="fa_text">
                                                <FormattedMessage id="order.shipping" />
                                            </span>
                                            <span className="fa_number">
                                                {this.state.no_ORDER_STATUS_6}
                                            </span>
                                        </Card>
                                    </Col>

                                    {/* Đang dỡ hàng */}
                                    <Col span={4} className="card_right">
                                        <Card
                                            className="fa_card"
                                            bordered={false}
                                            bodyStyle={{
                                                padding: '12px 0',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Avatar
                                                // src="https://img.icons8.com/ios-glyphs/30/000000/handcart.png"
                                                src={handcart}
                                                className="icon_tracking"
                                            />
                                            <span className="fa_text">
                                                <FormattedMessage id="order.downloading" />
                                            </span>
                                            <span className="fa_number">
                                                {this.state.no_ORDER_STATUS_7}
                                            </span>
                                        </Card>
                                    </Col>

                                    {/* Hoàn tất */}

                                    <Col span={4} className="card_right">
                                        <Card
                                            className="fa_card"
                                            bordered={false}
                                            bodyStyle={{
                                                padding: '12px 0',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Avatar
                                                // src="https://img.icons8.com/flat-round/64/000000/checkmark.png"
                                                src={checkmark}
                                                className="icon_tracking"
                                            />
                                            <span className="fa_text">
                                                <FormattedMessage id="order.finish" />
                                            </span>
                                            <span className="fa_number">
                                                {this.state.no_ORDER_STATUS_8}
                                            </span>
                                        </Card>
                                    </Col>

                                    {/* đã hủy */}
                                    <Col span={4} className="card_right">
                                        <Card
                                            className="fa_card"
                                            bordered={false}
                                            bodyStyle={{
                                                padding: '12px 0',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Avatar
                                                // src="https://img.icons8.com/color/48/000000/error--v1.png"
                                                src={error_v1}
                                                className="icon_tracking"
                                            />
                                            <span className="fa_text">
                                                <FormattedMessage id="order.canceled" />
                                            </span>
                                            <span className="fa_number">
                                                {this.state.no_ORDER_STATUS_9}
                                            </span>
                                        </Card>
                                    </Col>
                                </Row>
                                {/* Order Tracking List */}
                                <Row
                                    gutter={[24, 24]}
                                    style={{ marginTop: '40px' }}
                                >
                                    {orderList &&
                                        orderList.length > 0 &&
                                        orderList.map((i) => {
                                            return (
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={12}
                                                    key={i.key}
                                                >
                                                    <Card
                                                        className="tracking_item"
                                                        bordered={false}
                                                        bodyStyle={{
                                                            padding:
                                                                '12px 12px',
                                                        }}
                                                    >
                                                        {/* status & order code */}
                                                        <div className="item_title">
                                                            <p>
                                                                <Link
                                                                    to={
                                                                        path.DETAIL_ORDER +
                                                                        '?orderId=' +
                                                                        i
                                                                            .order_code
                                                                            .key +
                                                                        '&tabId=3'
                                                                    }
                                                                >
                                                                    <FormattedMessage id="order.#order" />{' '}
                                                                    {
                                                                        i
                                                                            .order_code
                                                                            .order_code
                                                                    }
                                                                </Link>
                                                            </p>
                                                            <p>
                                                                {
                                                                    i.status
                                                                        .status_name_input
                                                                }
                                                            </p>
                                                        </div>
                                                        {/* thông tin tracking */}

                                                        <div className="item_payment">
                                                            <div>
                                                                <CarOutlined />{' '}
                                                                {
                                                                    i.vehicle
                                                                        .vehicle_name
                                                                }
                                                                {'  '}
                                                                &nbsp;
                                                            </div>
                                                            <div>
                                                                <ShoppingCartOutlined />{' '}
                                                                {
                                                                    i.vehicle
                                                                        .tonage_name
                                                                }
                                                                &nbsp;&nbsp;
                                                            </div>
                                                            <div>
                                                                <CarryOutOutlined />{' '}
                                                                <FormattedMessage id="order.#vehicle" />
                                                                :{' '}
                                                                {
                                                                    i.vehicle
                                                                        .number_of_vehicle
                                                                }
                                                            </div>
                                                        </div>
                                                        {/* total */}
                                                        <div className="item_payment">
                                                            <DollarCircleOutlined
                                                                style={{
                                                                    paddingTop:
                                                                        '5px',
                                                                }}
                                                            />
                                                            <p>
                                                                {i.fee
                                                                    .total_price ? (
                                                                    CommonUtils.formattedValue(
                                                                        i.fee
                                                                            .total_price
                                                                    )
                                                                ) : (
                                                                    <>0 VNĐ</>
                                                                )}
                                                            </p>
                                                        </div>
                                                        {/* goods */}
                                                        <div className="item_payment">
                                                            <div>
                                                                <CodeSandboxOutlined />{' '}
                                                                <FormattedMessage id="order.package" />
                                                                :{' '}
                                                                {
                                                                    i.goods
                                                                        .number_package
                                                                }
                                                                &nbsp;
                                                            </div>
                                                            <div>
                                                                <SlidersOutlined />{' '}
                                                                <FormattedMessage id="order.weight" />
                                                                :{' '}
                                                                {i.goods.weight}{' '}
                                                                <FormattedMessage id="order.tons" />{' '}
                                                                &nbsp; -{' '}
                                                                <FormOutlined />{' '}
                                                                {i.description ||
                                                                    '...'}
                                                            </div>
                                                        </div>
                                                        {/* address */}
                                                        <div className="item_location">
                                                            <div>
                                                                <p>
                                                                    {
                                                                        i.sender
                                                                            .sender_addr_city
                                                                    }
                                                                </p>
                                                                <p>
                                                                    {
                                                                        i.sender
                                                                            .sender_addr_district
                                                                    }
                                                                </p>
                                                                {/* <p>
                                                                    04/03/2022
                                                                </p> */}
                                                            </div>
                                                            <div className="right-arrow">
                                                                <p>&#8594;</p>
                                                            </div>

                                                            <div>
                                                                <p>
                                                                    {
                                                                        i
                                                                            .receiver
                                                                            .receiver_addr_city
                                                                    }
                                                                </p>
                                                                <p>
                                                                    {
                                                                        i
                                                                            .receiver
                                                                            .receiver_addr_district
                                                                    }
                                                                </p>
                                                                {/* <p>
                                                                    08/03/2022
                                                                </p> */}
                                                            </div>
                                                        </div>
                                                        {/* <div className="item_container">
                                                            <div className="progress-segment">
                                                                <div className="item progress-color"></div>
                                                                <div className="item"></div>
                                                                <div className="item"></div>
                                                            </div>
                                                        </div> */}
                                                    </Card>
                                                </Col>
                                            );
                                        })}
                                </Row>
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language,
        userInfo: state.user.userInfo,
        orderListRedux: state.admin.orderListRedux,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        initTableOrderRedux: (dataFromApi) =>
            dispatch(actions.initTableOrderRedux(dataFromApi)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Trackings);

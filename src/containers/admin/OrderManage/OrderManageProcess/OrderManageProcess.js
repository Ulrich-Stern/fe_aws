import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Tabs, Card, Row, Col } from 'antd';

import TableInProcessing from './TableInProcessing';
import { Badge } from 'antd';

import {
    getOrderByStatusService,
    getOrderByStatusInProcessService,
    initTableOrderService,
} from '../../../../services/orderService';
import { ORDER_STATUS } from '../../../../utils/constant';
import TableOrderAdmin from './TableOrderAdmin';

const { TabPane } = Tabs;
const gridStyle = {
    width: '1/3',
    textAlign: 'center',
    height: '100px',
};

class OrderManageProcess extends Component {
    state = {
        // Chờ xác nhận
        dataFromApi: [],
        orderList: [],

        // Đang xử lý
        dataProcessFromAPi: [],
        orderProcessList: [],

        // Statistical
        no_ORDER_STATUS_1: 0,
        no_ORDER_STATUS_2: 0,
        no_ORDER_STATUS_3: 0,
        no_ORDER_STATUS_4: 0,
        no_ORDER_STATUS_5: 0,
        no_ORDER_STATUS_6: 0,
        no_ORDER_STATUS_7: 0,
        no_ORDER_STATUS_8: 0,
    };

    async componentDidMount() {
        await this.getAllOrderByStatus();

        // handle data of order list
        await this.initTable();

        await this.getNumberOfOrder();
    }

    initTable = async () => {
        try {
            let orderList = await initTableOrderService(this.state.dataFromApi);

            let orderProcessList = await initTableOrderService(
                this.state.dataProcessFromAPi
            );

            let copyState = { ...this.state };
            copyState.orderList = orderList;
            copyState.orderProcessList = orderProcessList;
            copyState.loadingDone = true;
            await this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
        } catch (error) {
            console.log('Error:', error);
        }
    };

    getAllOrderByStatus = async () => {
        try {
            let orders = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_2
            );

            let orders2 = await getOrderByStatusInProcessService();

            let copyState = { ...this.state };
            copyState.dataFromApi = orders.order;
            copyState.dataProcessFromAPi = orders2.order;

            this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    getNumberOfOrder = async () => {
        try {
            let no_ORDER_STATUS_1 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_1
            );
            no_ORDER_STATUS_1 = no_ORDER_STATUS_1.order.length;

            let no_ORDER_STATUS_2 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_2
            );
            no_ORDER_STATUS_2 = no_ORDER_STATUS_2.order.length;

            let no_ORDER_STATUS_3 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_3
            );
            no_ORDER_STATUS_3 = no_ORDER_STATUS_3.order.length;

            let no_ORDER_STATUS_4 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_4
            );
            no_ORDER_STATUS_4 = no_ORDER_STATUS_4.order.length;

            let no_ORDER_STATUS_5 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_5
            );
            no_ORDER_STATUS_5 = no_ORDER_STATUS_5.order.length;

            let no_ORDER_STATUS_6 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_6
            );
            no_ORDER_STATUS_6 = no_ORDER_STATUS_6.order.length;

            let no_ORDER_STATUS_7 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_7
            );
            no_ORDER_STATUS_7 = no_ORDER_STATUS_7.order.length;

            let no_ORDER_STATUS_8 = await getOrderByStatusService(
                ORDER_STATUS.ORDER_STATUS_8
            );
            no_ORDER_STATUS_8 = no_ORDER_STATUS_8.order.length;

            let copyState = { ...this.state };
            copyState.no_ORDER_STATUS_1 = no_ORDER_STATUS_1;
            copyState.no_ORDER_STATUS_2 = no_ORDER_STATUS_2;
            copyState.no_ORDER_STATUS_3 = no_ORDER_STATUS_3;
            copyState.no_ORDER_STATUS_4 = no_ORDER_STATUS_4;
            copyState.no_ORDER_STATUS_5 = no_ORDER_STATUS_5;
            copyState.no_ORDER_STATUS_6 = no_ORDER_STATUS_6;
            copyState.no_ORDER_STATUS_7 = no_ORDER_STATUS_7;
            copyState.no_ORDER_STATUS_8 = no_ORDER_STATUS_8;

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

    render() {
        return (
            <div className="custom-container">
                {/* title */}
                <div className="text-center">
                    <div className="cf-title-02 cf-title-alt-two">
                        <h3>Quản lý vận đơn</h3>
                    </div>
                </div>
                {/* content */}
                <div>
                    <Row gutter={[12, 12]}>
                        <Col span={24}>
                            {/* thống kế các vận đơn đang chờ, đang vận chuyển */}
                            <Card title="Thống kê vận đơn">
                                <Card.Grid style={gridStyle}>
                                    <div className="box_statistic">
                                        <p>Đơn chờ xác nhận</p>
                                        <p>{this.state.no_ORDER_STATUS_2}</p>
                                    </div>
                                </Card.Grid>

                                <Card.Grid style={gridStyle}>
                                    <div className="box_statistic">
                                        <p>Đơn chờ lên lịch</p>
                                        <p>{this.state.no_ORDER_STATUS_3}</p>
                                    </div>
                                </Card.Grid>
                                <Card.Grid style={gridStyle}>
                                    <div className="box_statistic">
                                        <p>Đơn chờ bốc hàng</p>
                                        <p>{this.state.no_ORDER_STATUS_4}</p>
                                    </div>
                                </Card.Grid>
                                <Card.Grid style={gridStyle}>
                                    <div className="box_statistic">
                                        <p>Đơn đang bốc hàng</p>
                                        <p>{this.state.no_ORDER_STATUS_5}</p>
                                    </div>
                                </Card.Grid>
                                <Card.Grid style={gridStyle}>
                                    <div className="box_statistic">
                                        <p>Đơn đang vận chuyển</p>
                                        <p>{this.state.no_ORDER_STATUS_6}</p>
                                    </div>
                                </Card.Grid>
                                <Card.Grid style={gridStyle}>
                                    <div className="box_statistic">
                                        <p>Đơn đang dỡ hàng</p>
                                        <p>{this.state.no_ORDER_STATUS_7}</p>
                                    </div>
                                </Card.Grid>
                            </Card>
                        </Col>

                        <Col span={24}>
                            <Card bordered={false}>
                                {/* table order */}
                                <Tabs type="card" size="large">
                                    {/* Tất cả */}
                                    <TabPane tab="Tất cả" key="1">
                                        {this.state.loadingDone == true ? (
                                            <TableInProcessing
                                                orderProcessList={
                                                    this.state.orderProcessList
                                                }
                                            />
                                        ) : (
                                            <></>
                                        )}
                                    </TabPane>
                                    {/* Đơn mới */}
                                    <TabPane
                                        tab={
                                            <Badge
                                                count={
                                                    this.state
                                                        .no_ORDER_STATUS_2 ||
                                                    '0'
                                                }
                                            >
                                                Đơn mới &nbsp;{'    '} &nbsp;
                                            </Badge>
                                        }
                                        key="2"
                                    >
                                        {this.state.loadingDone == true ? (
                                            <TableOrderAdmin
                                                orderList={this.state.orderList}
                                            />
                                        ) : (
                                            <></>
                                        )}
                                    </TabPane>
                                </Tabs>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { userInfo: state.user.userInfo };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderManageProcess);

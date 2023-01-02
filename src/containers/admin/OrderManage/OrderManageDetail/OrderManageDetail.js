import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { Tabs } from 'antd';
import { Button } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

import { path } from '../../../../utils/constant';
import OrderTab from './Tab/OrderTab';
import TrackingTab from './Tab/TrackingTab';
import { checkIsMultipleOrderService } from '../../../../services/orderService';
import MultipleOrderTab from './MultipleOrderTab/MultipleOrderTab';
import InvoiceManageDetail from '../../InvoiceManage/InvoiceManageDetail';

const { TabPane } = Tabs;

class OrderManageDetail extends Component {
    state = { isMultipleOrder: false };

    async componentDidMount() {
        try {
            await this.checkIsMultipleOrder();
        } catch (error) {
            console.log('Error:', error);
        }
    }

    checkIsMultipleOrder = async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const orderId = urlParams.get('orderId');

            let isMultipleOrder = await checkIsMultipleOrderService(orderId);

            let copyState = { ...this.state };

            copyState['isMultipleOrder'] = isMultipleOrder;

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

    render() {
        // lấy order id từ url
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');

        const tabId = urlParams.get('tabId');

        // case: undefined order id
        if (!orderId) {
            return <Redirect to={path.ORDER_MANAGE_PROCESS} />;
        }
        // normal case
        else {
            return (
                <div className="custom-container">
                    {/* title */}
                    <div className="text-center">
                        <div className="cf-title-02 cf-title-alt-two">
                            <h3>Chi tiết vận đơn</h3>
                        </div>
                    </div>
                    {/* content */}
                    <div>
                        <Link to={path.ORDER_MANAGE_PROCESS}>
                            <Button>
                                <RollbackOutlined /> Quay lại
                            </Button>
                        </Link>

                        <Tabs
                            defaultActiveKey={tabId || '1'}
                            size={'large'}
                            style={{
                                marginBottom: 32,
                            }}
                        >
                            <TabPane tab="Thông tin" key="1">
                                {this.state.isMultipleOrder == true ? (
                                    <MultipleOrderTab orderId={orderId} />
                                ) : (
                                    <OrderTab orderId={orderId} />
                                )}
                            </TabPane>
                            <TabPane tab="Hóa đơn" key="2">
                                <InvoiceManageDetail
                                    orderId={orderId}
                                    isMultipleOrder={this.state.isMultipleOrder}
                                />
                            </TabPane>
                            <TabPane tab="Theo dõi" key="3">
                                <TrackingTab
                                    orderId={orderId}
                                    isMultipleOrder={this.state.isMultipleOrder}
                                />
                            </TabPane>
                        </Tabs>
                    </div>
                    <br />
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return { userInfo: state.user.userInfo };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderManageDetail);

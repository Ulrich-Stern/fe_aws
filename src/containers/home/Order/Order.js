import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { Layout, Button, Tabs } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import HeaderTag from '../../common/HeaderTag/HeaderTag';
import MenuOption from '../../common/MenuOption/MenuOption';
import DetailTracking from '../Tracking/DetailTracking';
import DetailOrder from './DetailOrder';
import DetailInvoice from './DetailInvoice';
import { FormattedMessage } from 'react-intl';
import { path } from '../../../utils';
import { checkIsMultipleOrderService } from '../../../services/orderService';

import DetailOrderMultiple from './MultipleOrder/DetailOrderMultiple';

import DetailInvoiceMultiple from './MultipleOrder/DetailInvoiceMultiple';

const qs = require('query-string');

const { TabPane } = Tabs;
const { Sider, Content } = Layout;

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMultipleOrder: false,
        };
    }

    async componentDidMount() {
        await this.checkIsMultipleOrder();
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
                () => {
                    // console.log('state: ', this.state);
                }
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
            return <Redirect to={path.ORDER_LIST} />;
        } else {
            return (
                <>
                    <Layout>
                        <HeaderTag
                            breadcrumb1={
                                <FormattedMessage id="common.dashboard" />
                            }
                            breadcrumb2={
                                <FormattedMessage id="menu.pages.order" />
                            }
                        />
                        <Layout>
                            <Sider width="256" id="main">
                                <MenuOption />
                            </Sider>
                            <Layout
                                // className="site-layout-background"
                                style={{ padding: '10px 24px 0px 24px' }}
                            >
                                <Content>
                                    <Link to={path.ORDER_LIST}>
                                        <Button>
                                            <RollbackOutlined />{' '}
                                            <FormattedMessage id="order.back" />
                                        </Button>
                                    </Link>

                                    <Tabs
                                        defaultActiveKey={tabId || '1'}
                                        size={'large'}
                                        style={{
                                            marginBottom: 32,
                                        }}
                                    >
                                        <TabPane
                                            tab={
                                                <FormattedMessage id="order.info" />
                                            }
                                            key="1"
                                        >
                                            {this.state.isMultipleOrder ==
                                            true ? (
                                                <DetailOrderMultiple
                                                    orderId={orderId}
                                                />
                                            ) : (
                                                <DetailOrder
                                                    orderId={orderId}
                                                />
                                            )}
                                        </TabPane>
                                        <TabPane
                                            tab={
                                                <FormattedMessage id="order.invoice" />
                                            }
                                            key="2"
                                        >
                                            {this.state.isMultipleOrder ==
                                            true ? (
                                                <DetailInvoiceMultiple
                                                    orderId={orderId}
                                                />
                                            ) : (
                                                <DetailInvoice
                                                    orderId={orderId}
                                                />
                                            )}
                                        </TabPane>
                                        <TabPane
                                            tab={
                                                <FormattedMessage id="order.tracking" />
                                            }
                                            key="3"
                                        >
                                            <DetailTracking orderId={orderId} />
                                        </TabPane>
                                        {/* <TabPane tab="Ghi chú" key="4">
                                            <Note
                                                orderId={locationState.orderId}
                                            />
                                        </TabPane> */}
                                    </Tabs>
                                </Content>
                            </Layout>
                        </Layout>
                    </Layout>
                </>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);

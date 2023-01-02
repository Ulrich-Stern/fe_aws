import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { Layout, Row, Col, Menu, Select, Card, Collapse } from 'antd';
import {
    CheckCircleOutlined,
    UserOutlined,
    PhoneOutlined,
    HomeOutlined,
} from '@ant-design/icons';

import truck2 from '../../../assets/images/truck2.png';
import TrackingData from './TrackingData';
import { FormattedMessage } from 'react-intl';

import {
    getOrderService,
    initOnceOrderToDisplayService,
    searchOrderByOrderCodeService,
} from '../../../services/orderService';
import { dateFormat, CommonUtils } from '../../../utils';
import {
    getTrackingService,
    initTrackingsToDisplayService,
    displayProgressBarFollowByOrderStatusService,
} from '../../../services/trackingService';
import { getLogTripService } from '../../../services/logTripService';
import { path, ORDER_STATUS } from '../../../utils/constant';

const { Option } = Select;

const { Panel } = Collapse;
const menu = (
    <Menu
        // onClick={handleMenuClick}
        items={[
            {
                label: 'Bình Định - Tp Hồ Chí Minh',
                key: '1',
            },
            {
                label: 'Bình Định - Tp Hồ Chí Minh',
                key: '2',
            },
            {
                label: 'Bình Định - Tp Hồ Chí Minh',
                key: '3',
            },
        ]}
    />
);

const sender = (name, phone, address) => {
    return (
        <div>
            <div className="sender_title">Người gửi hàng</div>
            <div>
                <UserOutlined /> {name}
            </div>
            <div>
                {' '}
                <PhoneOutlined /> {phone}
            </div>
            <div>
                {' '}
                <HomeOutlined /> {address}
            </div>
        </div>
    );
};

const receiver = (name, phone, address) => {
    return (
        <div>
            <div className="sender_title">Người nhận hàng</div>
            <div>
                <UserOutlined /> {name}
            </div>
            <div>
                {' '}
                <PhoneOutlined /> {phone}
            </div>
            <div>
                {' '}
                <HomeOutlined /> {address}
            </div>
        </div>
    );
};

class DetailTracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: this.props.orderId,

            orderFromApi: '',
            order: '',

            // tracking & log trip
            trackingsFromApi: [],
            trackings: [],
            currentTracking: 0,
            vehicleInfo: '',

            // nhiều receiver
            receiver_list: [],
            orderList: [],
            current_order_id: this.props.orderId,

            // progress bar status
            progressBarStatus: 0,
        };
    }

    async componentDidMount() {
        // get order detail
        await this.getOrder();
        // get tracking by vehicle
        await this.getTrackings();

        await this.initDataToDisplay();

        await this.handleOnChangeVehicleTracking(0);
    }

    getOrder = async () => {
        // handle for current order
        let order = await getOrderService(this.state.orderId);
        order = order.order;

        // handle for multiple order
        let orderList = await searchOrderByOrderCodeService(order.order_code);
        orderList = orderList.order;

        let copyState = { ...this.state };
        copyState['orderFromApi'] = order;
        copyState['orderList'] = orderList;

        await this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    initDataToDisplay = async () => {
        try {
            let temp = await initOnceOrderToDisplayService(
                this.state.orderFromApi
            );

            let progressBarStatus = 0;
            if (temp && temp.status && temp.status.status) {
                progressBarStatus =
                    await displayProgressBarFollowByOrderStatusService(
                        temp.status.status
                    );
            }

            let trackings = await initTrackingsToDisplayService(
                this.state.trackingsFromApi
            );

            let copyState = { ...this.state };
            copyState.order = temp;
            copyState.progressBarStatus = progressBarStatus;
            copyState.trackings = trackings;

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

    getTrackings = async () => {
        try {
            let trackingsFromApi = await getTrackingService(
                'all',
                this.state.orderId
            );

            trackingsFromApi = trackingsFromApi.tracking;

            let copyState = { ...this.state };
            copyState.trackingsFromApi = trackingsFromApi;
            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeVehicleTracking = async (idx) => {
        try {
            let trackings = this.state.trackings;

            let vehicle = trackings[idx].vehicle;

            // log trip
            let logTrip = await getLogTripService('all', trackings[idx].key);
            logTrip = logTrip.logTrip;

            let copyState = { ...this.state };
            copyState.vehicleInfo = vehicle;
            copyState.currentTracking = idx;
            copyState.logTrip = logTrip;
            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeOrderId = async (id) => {
        try {
            window.location.href =
                path.DETAIL_ORDER + '?orderId=' + id + '&tabId=3';
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        let order = this.state.order;
        let trackings = this.state.trackings;
        let orderList = this.state.orderList;
        let progressBarStatus = this.state.progressBarStatus;

        return (
            <>
                <Row gutter={24}>
                    {/* thông tin đơn hàng */}
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div className="detail_name">
                            <p>
                                <FormattedMessage id="order.#order" />:{' '}
                                <span>
                                    {' '}
                                    {order &&
                                        order.order_code &&
                                        order.order_code.order_code}
                                </span>
                            </p>
                            <p>
                                {orderList && orderList.length > 1 ? (
                                    <FormattedMessage id="order.multi_unload" />
                                ) : (
                                    <FormattedMessage id="order.one_unload" />
                                )}
                            </p>
                        </div>
                        {/* <div>
                            <div className="detail_progress">
                                <p>Tiến độ</p>
                                <p>2/4 Kho hàng</p>
                            </div>
                            <div className="item_container">
                                <div className="progress-segment">
                                    <div className="item progress-color"></div>
                                    <div className="item progress-color"></div>
                                    <div className="item"></div>
                                    <div className="item "></div>
                                </div>
                            </div>
                        </div> */}
                        <div className="detail_head">
                            <img src={truck2} />
                            <div>
                                <p>
                                    <FormattedMessage id="order.vehicle_type" />
                                </p>
                                <p>
                                    {order &&
                                        order.vehicle &&
                                        order.vehicle.vehicle_name}{' '}
                                    -{' '}
                                    {order &&
                                        order.vehicle &&
                                        order.vehicle.tonage_name}
                                </p>
                            </div>
                        </div>
                        <Card bordered={false}>
                            <Row gutter={[16, 8]}>
                                <Col span={12}>
                                    <FormattedMessage id="order.date_created" />
                                </Col>
                                <Col span={12}>
                                    {order && order.createDate != ''
                                        ? moment(order.createDate).format(
                                              dateFormat.DATE_FORMAT
                                          )
                                        : '...'}
                                </Col>
                                <Col span={12}>
                                    <FormattedMessage id="order.loading_time" />
                                </Col>
                                <Col span={12}>
                                    {order && order.pickup_date != ''
                                        ? moment(order.pickup_date).format(
                                              dateFormat.DATE_FORMAT
                                          )
                                        : '...'}
                                </Col>
                                <Col span={12}>
                                    <FormattedMessage id="order.arrive_time" />:
                                </Col>
                                <Col span={12}>
                                    {' '}
                                    {order && order.intend_time != ''
                                        ? moment(order.intend_time).format(
                                              dateFormat.DATE_FORMAT
                                          )
                                        : '...'}
                                </Col>
                                <Col span={12}>
                                    <FormattedMessage id="order.order_status" />
                                </Col>
                                <Col span={12}>
                                    {order &&
                                        order.status &&
                                        order.status.status_name_input}
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* google maps */}
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1995036.2102375787!2d106.90991687171868!3d12.412689955517008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x316f6c65736eabd9%3A0xd362348e5af3d559!2zUXV5IE5ob24sIELDrG5oIMSQ4buLbmgsIFZpZXRuYW0!3m2!1d13.7829673!2d109.2196634!4m5!1s0x31752f3c93a9f641%3A0x514b321d8a12482a!2zMzYgQsO5aSBUaOG7iyBYdcOibiwgQuG6v24gVGjDoG5oLCBEaXN0cmljdCAxLCBIbyBDaGkgTWluaCBDaXR5!3m2!1d10.7719685!2d106.6901358!5e0!3m2!1sen!2s!4v1663904481392!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </Col>
                </Row>

                <Row gutter={24} style={{ marginTop: '30px' }}>
                    {/* choose Journeys */}
                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                        <div className="detail_route">
                            <p>
                                <FormattedMessage id="order.route" />:{' '}
                            </p>

                            <Select
                                style={{
                                    width: '100%',
                                    padding: '0 5px',
                                    fontSize: '11px',
                                }}
                                value={this.state.current_order_id}
                                onChange={(key) => {
                                    this.handleOnChangeOrderId(key);
                                }}
                                id="order_route"
                            >
                                {orderList &&
                                    orderList.length > 0 &&
                                    orderList.map((i) => {
                                        return (
                                            <Option
                                                key={i._id}
                                                value={i._id}
                                                style={{ fontSize: '11px' }}
                                                id={i._id}
                                            >
                                                {order &&
                                                    order.sender &&
                                                    order.sender
                                                        .sender_addr_city}{' '}
                                                -
                                                {i.receiver_addr_city &&
                                                    i.receiver_addr_city.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </div>
                        {/* block chuyến */}
                        <Card
                            title={<FormattedMessage id="order.info" />}
                            bordered={false}
                        >
                            <Row gutter={[12, 24]}>
                                <Col
                                    span={2}
                                    className={
                                        progressBarStatus !== 0
                                            ? 'detail_check tracking_done'
                                            : 'detail_check tracking_not_done'
                                    }
                                >
                                    <div>
                                        <CheckCircleOutlined
                                            className={
                                                progressBarStatus !== 0
                                                    ? 'tracking_active'
                                                    : ''
                                            }
                                        />
                                    </div>
                                </Col>
                                {/* sender */}
                                <Col span={22}>
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={['1']}
                                        expandIconPosition="right"
                                    >
                                        <Panel
                                            header={`Bốc hàng tại kho ${
                                                order &&
                                                order.sender &&
                                                order.sender.sender_addr_city
                                            }`}
                                            key="1"
                                        >
                                            {order &&
                                                order.sender &&
                                                sender(
                                                    order.sender.contact_name,
                                                    order.sender.phone,
                                                    order.sender.address
                                                )}
                                        </Panel>
                                    </Collapse>
                                </Col>

                                <Col
                                    span={2}
                                    className={
                                        progressBarStatus !== 0 &&
                                        progressBarStatus !== 1
                                            ? 'detail_check tracking_done'
                                            : 'detail_check tracking_not_done'
                                    }
                                >
                                    <div>
                                        <CheckCircleOutlined
                                            className={
                                                progressBarStatus !== 0 &&
                                                progressBarStatus !== 1
                                                    ? 'tracking_active'
                                                    : ''
                                            }
                                        />
                                    </div>
                                </Col>
                                {/* receiver */}
                                <Col span={22}>
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={['1']}
                                        expandIconPosition="right"
                                    >
                                        <Panel
                                            header={`Dỡ hàng tại kho ${
                                                order &&
                                                order.receiver &&
                                                order.receiver
                                                    .receiver_addr_city
                                            }`}
                                            key="1"
                                        >
                                            {order &&
                                                order.receiver &&
                                                receiver(
                                                    order.receiver.contact_name,
                                                    order.receiver.phone,
                                                    order.receiver.address
                                                )}
                                        </Panel>
                                    </Collapse>
                                </Col>

                                <Col span={2}>
                                    <CheckCircleOutlined
                                        className={
                                            progressBarStatus === 3
                                                ? 'tracking_active'
                                                : ''
                                        }
                                    />
                                </Col>
                                {/* finish */}
                                <Col span={22}>
                                    <p className="sender_title finish">
                                        <FormattedMessage id="order.finish" />
                                    </p>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    {/* Log by Vehicle */}
                    <Col xs={24} sm={24} md={24} lg={14} xl={14}>
                        <div className="detail_log">
                            <p>
                                <FormattedMessage id="order.log" />
                            </p>
                            <Select
                                style={{
                                    width: '150px',
                                }}
                                value={this.state.currentTracking}
                                onChange={(key) => {
                                    this.handleOnChangeVehicleTracking(key);
                                }}
                                id="order_log"
                            >
                                {trackings &&
                                    trackings.map((i) => {
                                        return (
                                            <Option
                                                key={i.key}
                                                value={i.idx}
                                                id={i.idx}
                                            >
                                                <FormattedMessage id="order.vehicle_no" />{' '}
                                                {i.idx + 1}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </div>
                        {/* log hành trình */}
                        <TrackingData
                            vehicleInfo={this.state.vehicleInfo}
                            logTrip={this.state.logTrip || null}
                        />
                    </Col>
                </Row>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailTracking);

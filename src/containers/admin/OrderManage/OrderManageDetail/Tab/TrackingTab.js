import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { toast } from 'react-toastify';

import { Row, Col, Space, Button, Card, Select, Collapse } from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    HomeOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { Popconfirm } from 'antd';

import { dateFormat } from '../../../../../utils';
import truck2 from '../../../../../assets/images/truck2.png';
import TrackingData from '../../../../home/Tracking/TrackingData';
import AddLogTripModal from './AddLogTripModal';

import {
    getOrderService,
    initOnceOrderToDisplayService,
    searchOrderByOrderCodeService,
} from '../../../../../services/orderService';
import {
    getTrackingService,
    initTrackingsToDisplayService,
    deleteTrackingService,
} from '../../../../../services/trackingService';
import { getLogTripService } from '../../../../../services/logTripService';
import { emitter } from '../../../../../utils/emitter';
import AddVehicleTrackingModal from './AddVehicleTrackingModal';
import { path } from '../../../../../utils/constant';

const { Option } = Select;
const { Panel } = Collapse;

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

class TrackingTab extends Component {
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

            // for add modal
            isOpenAddModal: false,

            // AddVehicleTrackingModal
            isOpenAddModalVehicle: false,

            // nhiều receiver
            receiver_list: [],
            orderList: [],
            current_order_id: this.props.orderId,
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

    refreshAfterAddLogTrip = async () => {
        // get order detail
        await this.getOrder();
        // get tracking by vehicle
        await this.getTrackings();

        await this.initDataToDisplay();

        await this.handleOnChangeVehicleTracking(0);
    };

    getOrder = async () => {
        let order = await getOrderService(this.state.orderId);
        order = order.order;

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

            let trackings = await initTrackingsToDisplayService(
                this.state.trackingsFromApi
            );

            let copyState = { ...this.state };
            copyState.order = temp;
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
            this.setState({ ...copyState });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    showModal = () => {
        this.setState({ isOpenAddModal: true });
    };

    handleCancel = () => {
        try {
            // call event from child
            emitter.emit('EVENT_CLEAR_ADD_LOG_TRIP_MODAL_DATA', {
                id: 'your id',
            });
            this.setState({ isOpenAddModal: false });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    showModalVehicle = () => {
        this.setState({ isOpenAddModalVehicle: true });
    };

    handleCancelVehicle = () => {
        try {
            this.setState({ isOpenAddModalVehicle: false });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    deleteCurrentTracking = async () => {
        try {
            let currentTracking = this.state.currentTracking;
            let key = this.state.trackings[currentTracking].key;
            let result = await deleteTrackingService(key);
            if (result.errCode !== 0) {
                toast.error(result.errMessage);
            }
            // successful case
            else {
                toast.success('Delete coordinator successful');
                await this.refreshAfterAddLogTrip();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeOrderId = async (id) => {
        try {
            window.location.href =
                path.ORDER_MANAGE_DETAIL + '?orderId=' + id + '&tabId=3';
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        let order = this.state.order;
        let trackings = this.state.trackings;
        let orderList = this.state.orderList;

        return (
            <>
                {' '}
                <Row gutter={24}>
                    {/* thông tin đơn hàng */}
                    <Col span={12}>
                        <div className="detail_name">
                            <p>
                                Mã vận đơn:{' '}
                                <span>
                                    {' '}
                                    {order &&
                                        order.order_code &&
                                        order.order_code.order_code}
                                </span>
                            </p>
                            <p>
                                {this.props.isMultipleOrder == false
                                    ? 'Một điểm dỡ'
                                    : 'Nhiều điểm dỡ'}
                            </p>
                        </div>

                        <div className="detail_head">
                            <img src={truck2} />
                            <div>
                                <p>Loại dịch vụ</p>
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
                                <Col span={12}>Ngày tạo đơn</Col>
                                <Col span={12}>
                                    {order && order.createDate != ''
                                        ? moment(order.createDate).format(
                                              dateFormat.DATE_FORMAT
                                          )
                                        : '...'}
                                </Col>
                                <Col span={12}>Ngày bốc hàng</Col>
                                <Col span={12}>
                                    {order && order.pickup_date != ''
                                        ? moment(order.pickup_date).format(
                                              dateFormat.DATE_FORMAT
                                          )
                                        : '...'}
                                </Col>
                                <Col span={12}>Ngày dự kiến hoàn thành:</Col>
                                <Col span={12}>
                                    {' '}
                                    {order && order.intend_time != ''
                                        ? moment(order.intend_time).format(
                                              dateFormat.DATE_FORMAT
                                          )
                                        : '...'}
                                </Col>
                                <Col span={12}>Trạng thái đơn hàng</Col>
                                <Col span={12}>
                                    {order &&
                                        order.status &&
                                        order.status.status_name_input}
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* google maps */}
                    <Col span={12}>
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
                    <Col span={8}>
                        <div className="detail_route">
                            <p>Lộ trình: </p>

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
                            >
                                {orderList &&
                                    orderList.length > 0 &&
                                    orderList.map((i) => {
                                        return (
                                            <Option
                                                key={i._id}
                                                value={i._id}
                                                style={{ fontSize: '11px' }}
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
                        <Card title="Địa chỉ bốc/dỡ hàng" bordered={false}>
                            <Row gutter={[12, 24]}>
                                <Col
                                    span={2}
                                    className="detail_check tracking_done"
                                >
                                    <div>
                                        <CheckCircleOutlined className="tracking_active" />
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
                                    className="detail_check tracking_not_done"
                                >
                                    <div>
                                        <CheckCircleOutlined />
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
                                    <CheckCircleOutlined />
                                </Col>
                                <Col span={22}>
                                    <p className="sender_title finish">
                                        Hoàn tất
                                    </p>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* Log by Vehicle */}
                    <Col span={16}>
                        <div className="container_detail_log">
                            <div className="detail_log">
                                <p>Log hành trình</p>
                                <Select
                                    style={{
                                        width: '150px',
                                    }}
                                    value={this.state.currentTracking}
                                    onChange={(key) => {
                                        this.handleOnChangeVehicleTracking(key);
                                    }}
                                >
                                    {trackings &&
                                        trackings.map((i) => {
                                            return (
                                                <Option
                                                    key={i.key}
                                                    value={i.idx}
                                                >
                                                    Xe số {i.idx + 1}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </div>

                            {/* add log trip button */}
                            {this.state.isOpenAddModal ? (
                                // wait -> render after get tracking at TrackingTab
                                <AddLogTripModal
                                    isOpenAddModal={this.state.isOpenAddModal}
                                    showModal={this.showModal}
                                    handleCancel={this.handleCancel}
                                    trackings={
                                        this.state.trackings &&
                                        this.state.trackings.length > 0
                                            ? this.state.trackings
                                            : null
                                    }
                                    refreshAfterAddLogTrip={
                                        this.refreshAfterAddLogTrip
                                    }
                                />
                            ) : (
                                <></>
                            )}
                            {this.state.isOpenAddModalVehicle ? (
                                // wait -> render after get tracking at TrackingTab
                                <AddVehicleTrackingModal
                                    isOpenAddModal={
                                        this.state.isOpenAddModalVehicle
                                    }
                                    showModal={this.showModalVehicle}
                                    handleCancel={this.handleCancelVehicle}
                                    order_id={this.state.orderId}
                                    vehicle_code={
                                        this.state.orderFromApi.vehicle_code
                                    }
                                    orderFromApi={this.state.orderFromApi}
                                    refreshAfterAddLogTrip={
                                        this.refreshAfterAddLogTrip
                                    }
                                />
                            ) : (
                                <></>
                            )}

                            <Space className="button-right" size="large">
                                <Button
                                    type="primary"
                                    onClick={this.showModalVehicle}
                                >
                                    Thêm Xe
                                </Button>
                                {this.state.trackingsFromApi &&
                                this.state.trackingsFromApi.length > 0 ? (
                                    <>
                                        <Popconfirm
                                            title={`Bạn có chắc chắn xóa điều phối xe số ${
                                                this.state.currentTracking + 1
                                            } ?`}
                                            onConfirm={
                                                this.deleteCurrentTracking
                                            }
                                            // onCancel={cancel}
                                            okText="Ok"
                                            cancelText="No"
                                        >
                                            <Button
                                                style={{
                                                    backgroundColor: '#DC3030',
                                                    color: 'white',
                                                }}
                                            >
                                                Xóa xe
                                            </Button>
                                        </Popconfirm>

                                        <Button
                                            type="primary"
                                            onClick={this.showModal}
                                        >
                                            Thêm log
                                        </Button>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Space>
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
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackingTab);

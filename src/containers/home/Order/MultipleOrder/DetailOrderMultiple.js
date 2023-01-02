import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
    Row,
    Col,
    Space,
    Typography,
    Button,
    Card,
    Descriptions,
    Tag,
} from 'antd';
import {
    UserOutlined,
    DeleteOutlined,
    EditOutlined,
    PhoneOutlined,
    HomeOutlined,
    CheckOutlined,
    StopOutlined,
} from '@ant-design/icons';

import { FormattedMessage } from 'react-intl';
import {
    getOrderService,
    searchOrderByOrderCodeService,
} from '../../../../services/orderService';
import { getAddressBookService } from '../../../../services/addressBookService';
import { getAllCodeByKeyService } from '../../../../services/allCodeService';
import { getAllPayerService } from '../../../../services/payerService';
import { dateFormat, CommonUtils } from '../../../../utils';

import Data from '../../NewOrderMulti/Data';

const { Text } = Typography;
const { Title } = Typography;

class DetailOrderMultiple extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: this.props.orderId,
            order: '',
            sender: '',
            sender_address: '',
            sender_contact_name: '',
            sender_phone: '',
            receiver_address: '',
            vehicle_name_input: '',
            tonage_name_input: '',
            size_input: '',
            payer_name_input: '',
            payment_code_input: '',
            goods_code_input: '',
            status_name_input: '',

            // list receiver
            receiver_list: [],
            orderList: [],
            total_all: '0',
        };
    }

    async componentDidMount() {
        await this.getOrder();
        await this.initData();
        await this.initTableReceiver();
        await this.updateTotalAll();
    }

    getOrder = async () => {
        let order = await getOrderService(this.state.orderId);
        order = order.order;

        let orderList = await searchOrderByOrderCodeService(order.order_code);
        orderList = orderList.order;

        let copyState = { ...this.state };
        copyState['order'] = order;
        copyState['orderList'] = orderList;
        await this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    handleStringFormatAddress = (street, ward, district, city) => {
        return `${street}, ${ward}, ${district}, ${city}`;
    };

    initData = async () => {
        let order = this.state.order;
        // vehicle
        // handle data
        // order_status
        let status = await getAllCodeByKeyService(order.status);
        status = status.allCode;
        let status_name_input = status[0].value_vi;

        // sender
        let sender = await getAddressBookService(order.sender_id);
        sender = sender.ab;
        let sender_address = this.handleStringFormatAddress(
            sender.addr_street,
            sender.addr_ward.name,
            sender.addr_district.name,
            sender.addr_city.name
        );
        let sender_contact_name = sender.contact_name;
        let sender_phone = sender.phone;

        //receiver
        let receiver_address = this.handleStringFormatAddress(
            order.receiver_addr_street,
            order.receiver_addr_ward.name,
            order.receiver_addr_district.name,
            order.receiver_addr_city.name
        );

        //  vehicle
        let vehicle = await getAllCodeByKeyService(order.vehicle_code);
        vehicle = vehicle.allCode;
        let vehicle_name_input = vehicle[0].value_vi;

        let tonage = await getAllCodeByKeyService(order.tonage_code);
        tonage = tonage.allCode;
        let tonage_name_input = tonage[0].value_vi;

        // size
        let size_input = `${order.length} x ${order.width} x ${order.height}`;

        // payer
        let payer = await getAllPayerService(order.payer_id);

        payer = payer.payer;
        let payer_name_input = '';
        if (payer.payment_type == 'atm') {
            payer_name_input = `${payer.payer_name} - ${payer.bank} - ATM: ${payer.atm_id}`;
        } else {
            payer_name_input = `${payer.payer_name} - Momo: ${payer.phone}`;
        }

        // payment_code
        let payment_code = await getAllCodeByKeyService(order.payment_code);
        payment_code = await payment_code.allCode;

        let payment_code_input = payment_code[0].value_vi;

        // goods_code
        let goods_code = await getAllCodeByKeyService(order.goods_code);
        goods_code = await goods_code.allCode;
        let goods_code_input = goods_code[0].value_vi;

        let copyState = { ...this.state };
        copyState.sender = sender;
        copyState.sender_address = sender_address;
        copyState.sender_contact_name = sender_contact_name;
        copyState.sender_phone = sender_phone;
        copyState.receiver_address = receiver_address;
        copyState.vehicle_name_input = vehicle_name_input;
        copyState.tonage_name_input = tonage_name_input;
        copyState.size_input = size_input;
        copyState.payer_name_input = payer_name_input;
        copyState.payment_code_input = payment_code_input;
        copyState.goods_code_input = goods_code_input;
        copyState.status_name_input = status_name_input;

        await this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    initTableReceiver = async () => {
        try {
            let orderList = this.state.orderList;
            let obj = [];
            await orderList.forEach((i) => {
                obj.push({
                    receiver_id: i.receiver_id,

                    address: {
                        receiver_contact_name: i.receiver_contact_name,
                        receiver_alias: i.receiver_alias,
                        receiver_phone: i.receiver_phone,

                        address: `${i.receiver_addr_street}, ${i.receiver_addr_ward.name}, ${i.receiver_addr_district.name}, ${i.receiver_addr_city.name}`,
                    },

                    number_of_vehicle: i.number_of_vehicle,
                    total_fee: i.total_price,
                    intend_time: i.intend_time,
                    distance: i.distance,
                });
            });

            // console.log('obj:', obj);
            let copyState = { ...this.state };
            copyState['receiver_list'] = obj;
            await this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    updateTotalAll = () => {
        let temp = 0;

        this.state.receiver_list.forEach((i) => {
            temp = temp + parseInt(i.total_fee);
        });
        temp = temp.toString();

        let copyState = { ...this.state };
        copyState.total_all = temp;

        this.setState({ ...copyState }, () => {});
    };

    render() {
        let order = this.state.order;
        return (
            <>
                <Row gutter={[24, 24]}>
                    {/* cụm button hủy đơn */}
                    <Col span={24}>
                        <Card>
                            <Row gutter={[12, 12]}>
                                <Col span={18}>
                                    {/* <Title level={3}>
                                            Mã vận đơn: ORD-1001
                                        </Title> */}
                                    <h3 className="not_margin_bottom">
                                        <FormattedMessage id="order.#order" />:{' '}
                                        <Text mark>{order.order_code}</Text>{' '}
                                        <Tag color="#87d068">
                                            <FormattedMessage id="order.multi_unload" />
                                        </Tag>
                                    </h3>
                                </Col>
                                {/* hủy đơn */}
                                <Col span={6}>
                                    <Space
                                        className="button-right"
                                        size="small"
                                    >
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<DeleteOutlined />}
                                        >
                                            <span className="button_text">
                                                <FormattedMessage id="order.cancel_order" />
                                            </span>
                                        </Button>
                                        {/* <Button
                                                type="primary"
                                                size="middle"
                                                icon={<PrinterOutlined />}
                                                style={{
                                                    background: '#FDE036',
                                                    borderColor: '#FDE036',
                                                    color: '#000000',
                                                }}
                                            >
                                                In
                                            </Button> */}
                                        {/* <Button
                                            size="large"
                                            icon={<EditOutlined />}
                                            style={{
                                                background: '#B0FAA0',
                                                borderColor: '#B0FAA0',
                                                color: '#000000',
                                            }}
                                        >
                                            <span className="button_text">
                                                Yêu cầu chỉnh sửa
                                            </span>
                                        </Button> */}
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    {/* bên trái */}
                    <Col span={12}>
                        <Row gutter={[24, 24]}>
                            {/* Thông tin đơn hàng */}
                            <Col span={24}>
                                <Card bordered={false}>
                                    <Title level={4}>
                                        <FormattedMessage id="order.order_info" />
                                    </Title>
                                    <Row gutter={[12, 12]}>
                                        {/* phía loại xe */}
                                        <Col span={12}>
                                            <Descriptions
                                                title=""
                                                contentStyle={{
                                                    fontWeight: 'bold',
                                                    position: 'absolute',
                                                    right: '20px',
                                                }}
                                            >
                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.vehicle_type" />
                                                    }
                                                    span={3}
                                                >
                                                    {
                                                        this.state
                                                            .vehicle_name_input
                                                    }
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.weight_type" />
                                                    }
                                                    span={3}
                                                >
                                                    {
                                                        this.state
                                                            .tonage_name_input
                                                    }
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.goods_value" />
                                                    }
                                                    span={3}
                                                >
                                                    200.000.000 VNĐ
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.package" />
                                                    }
                                                    span={3}
                                                >
                                                    {order.number_package}
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.total_weight" />
                                                    }
                                                    span={3}
                                                >
                                                    {order.weight}{' '}
                                                    <FormattedMessage id="order.tons" />
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Col>
                                        {/* Phía ngày tạo đơn */}
                                        <Col span={12}>
                                            <Descriptions
                                                title=""
                                                contentStyle={{
                                                    fontWeight: 'bold',
                                                    position: 'absolute',
                                                    right: '10px',
                                                }}
                                            >
                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.date_created" />
                                                    }
                                                    span={3}
                                                >
                                                    {order &&
                                                    order.created != '' &&
                                                    order.created.time != ''
                                                        ? moment(
                                                              order.created.time
                                                          ).format(
                                                              dateFormat.DATE_FORMAT
                                                          )
                                                        : '...'}
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.loading_time" />
                                                    }
                                                    span={3}
                                                >
                                                    {this.state.pickup_date !=
                                                    ''
                                                        ? moment(
                                                              this.state
                                                                  .pickup_date
                                                          ).format(
                                                              dateFormat.DATE_FORMAT
                                                          )
                                                        : '...'}
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.finish_time" />
                                                    }
                                                    span={3}
                                                >
                                                    {this.state.intend_time !=
                                                    ''
                                                        ? moment(
                                                              this.state
                                                                  .finish_date
                                                          ).format(
                                                              dateFormat.DATE_FORMAT
                                                          )
                                                        : '...'}
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.order_status" />
                                                    }
                                                    span={3}
                                                    // contentStyle={{
                                                    //     color: 'red',
                                                    // }}
                                                >
                                                    <Tag
                                                        color={
                                                            order.status ===
                                                            'ORDER_STATUS_1'
                                                                ? 'pink'
                                                                : 'blue'
                                                        }
                                                        key={order.status}
                                                    >
                                                        {
                                                            this.state
                                                                .status_name_input
                                                        }
                                                    </Tag>
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Col>
                                        {/* phần tổng trọng lượng quy đổi */}
                                        <Col span={24}>
                                            <Descriptions
                                                title=""
                                                contentStyle={{
                                                    fontWeight: 'bold',
                                                    position: 'absolute',
                                                    right: '10px',
                                                }}
                                            >
                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.converted_weight" />
                                                    }
                                                    span={3}
                                                >
                                                    {this.state.size_input} (m)
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.goods_type" />
                                                    }
                                                    span={3}
                                                >
                                                    {
                                                        this.state
                                                            .goods_code_input
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.goods_description" />
                                                    }
                                                    span={3}
                                                >
                                                    {order.description}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Col>
                                    </Row>
                                    {/* span = 1 là chia 3
                                                                    span = 2 là chia 2
                                                                    span = 3 là chia 1 */}
                                </Card>
                            </Col>
                            {/* Dịch vụ vận tải */}
                            <Col span={24}>
                                <Card className="left_desc" bordered={false}>
                                    <Title level={4}>
                                        <FormattedMessage id="order.service" />
                                    </Title>
                                    <Row gutter={[12, 12]}>
                                        <Col span={12}>
                                            <Descriptions
                                                title=""
                                                contentStyle={{
                                                    fontWeight: 'bold',
                                                    position: 'absolute',
                                                    right: '10px',
                                                }}
                                            >
                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.insurance" />
                                                    }
                                                    span={3}
                                                >
                                                    {order.do_buy_insurance ==
                                                    true ? (
                                                        <CheckOutlined />
                                                    ) : (
                                                        <StopOutlined />
                                                    )}
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.hire_loading" />
                                                    }
                                                    span={3}
                                                >
                                                    {order.hire_loading_uploading ==
                                                    true ? (
                                                        <CheckOutlined />
                                                    ) : (
                                                        <StopOutlined />
                                                    )}
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.only_tow_head" />
                                                    }
                                                    span={3}
                                                >
                                                    {order.empty_loading_uploading ==
                                                    true ? (
                                                        <CheckOutlined />
                                                    ) : (
                                                        <StopOutlined />
                                                    )}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Col>
                                        <Col span={12}>
                                            <Descriptions
                                                title=""
                                                contentStyle={{
                                                    fontWeight: 'bold',
                                                    position: 'absolute',
                                                    right: '10px',
                                                }}
                                            >
                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.cod" />
                                                    }
                                                    span={3}
                                                >
                                                    {order.cod_fee == true ? (
                                                        <CheckOutlined />
                                                    ) : (
                                                        <StopOutlined />
                                                    )}
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label={
                                                        <FormattedMessage id="order.freight" />
                                                    }
                                                    span={3}
                                                >
                                                    {order.is_frozen_storage ==
                                                    true ? (
                                                        <CheckOutlined />
                                                    ) : (
                                                        <StopOutlined />
                                                    )}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    {/* bên phải */}
                    <Col span={12}>
                        <Row gutter={[12, 12]}>
                            {/* Người gửi hàng */}
                            <Col span={24}>
                                <Card className="right_desc" bordered={false}>
                                    <Title level={4}>
                                        <FormattedMessage id="order.consignor" />
                                    </Title>
                                    <Descriptions
                                        title=""
                                        contentStyle={{
                                            fontWeight: 'normal',
                                        }}
                                    >
                                        <Descriptions.Item
                                            label={<UserOutlined />}
                                            span={3}
                                        >
                                            {this.state.sender_contact_name}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label={<PhoneOutlined />}
                                            span={3}
                                        >
                                            {this.state.sender_phone}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label={<HomeOutlined />}
                                            span={3}
                                        >
                                            {this.state.sender_address}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>

                            {/* Thông tin thanh toán */}
                            <Col span={24}>
                                <Card className="right_desc" bordered={false}>
                                    <Title level={4}>
                                        <FormattedMessage id="order.payment_info" />
                                    </Title>
                                    <Descriptions
                                        title=""
                                        contentStyle={{
                                            fontWeight: 'bold',
                                            position: 'absolute',
                                            right: '60px',
                                        }}
                                    >
                                        <Descriptions.Item
                                            label={
                                                <FormattedMessage id="order.payer" />
                                            }
                                            span={3}
                                        >
                                            {this.state.payer_name_input}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label={
                                                <FormattedMessage id="order.payment_method" />
                                            }
                                            span={3}
                                        >
                                            {this.state.payment_code_input}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label={
                                                <FormattedMessage id="order.reference_code" />
                                            }
                                            span={3}
                                        >
                                            {order.payment_reference_code}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            {/* Note */}
                            <Col span={24}>
                                <Card className="right_desc" bordered={false}>
                                    <Title level={4}>
                                        <FormattedMessage id="order.note" />
                                    </Title>

                                    <Descriptions
                                        title=""
                                        contentStyle={{
                                            fontWeight: 'bold',
                                            position: 'absolute',
                                            right: '60px',
                                        }}
                                    >
                                        <Descriptions.Item
                                            label={
                                                <FormattedMessage id="order.note_for_driver" />
                                            }
                                            span={3}
                                        >
                                            {order.note}{' '}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>

                            {/* Tổng cước */}
                            <Col span={24}>
                                <Card>
                                    <Row gutter={[12, 12]}>
                                        <Col span={12}>
                                            <Title
                                                level={4}
                                                className="not_margin_bottom"
                                            >
                                                <FormattedMessage id="order.price" />
                                            </Title>
                                        </Col>
                                        <Col span={12}>
                                            <Title
                                                level={3}
                                                className="right-align not_margin_bottom"
                                            >
                                                {this.state.total_all != '' ? (
                                                    CommonUtils.formattedValue(
                                                        this.state.total_all
                                                    )
                                                ) : (
                                                    <div>0 VNĐ</div>
                                                )}
                                            </Title>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    {/* người nhận hàng */}
                    <Col span={24}>
                        <Title level={4}>
                            <FormattedMessage id="order.unload_places" />
                        </Title>

                        <Data
                            receiver_list={this.state.receiver_list}
                            rowSelection={null}
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DetailOrderMultiple);

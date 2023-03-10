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
    Select,
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    PhoneOutlined,
    HomeOutlined,
    CheckOutlined,
    StopOutlined,
} from '@ant-design/icons';

import {
    getOrderService,
    editOrderService,
} from '../../../../../services/orderService';
import { getAddressBookService } from '../../../../../services/addressBookService';
import {
    getAllCodeByKeyService,
    getAllCodeService,
} from '../../../../../services/allCodeService';
import { getAllPayerService } from '../../../../../services/payerService';
import { dateFormat, CommonUtils } from '../../../../../utils';
import { getAllUsersService } from '../../../../../services/userService';

const { Text } = Typography;
const { Title } = Typography;
const { Option } = Select;

class OrderTab extends Component {
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

            // button set status code
            orders_code: [],
            status: '',
            // own_user of order
            own_user: '',
            user_detail: '',
        };
    }

    async componentDidMount() {
        await this.getOrder();
        await this.initData();
        await this.getOrderStatusCode();
        await this.getUserDetail();
    }

    getOrder = async () => {
        let order = await getOrderService(this.state.orderId);
        order = order.order;
        let copyState = { ...this.state };
        copyState['order'] = order;
        copyState['status'] = order.status;
        copyState['own_user'] = order.own_user;
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

    getOrderStatusCode = async () => {
        try {
            let orderStatus = await getAllCodeService('all', 'ORDER');
            orderStatus = orderStatus.allCode;

            let copyState = { ...this.state };
            copyState.orders_code = orderStatus;
            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeOrderStatus = (key) => {
        let copyState = { ...this.state };
        copyState.status = key;
        this.setState({ ...copyState }, () => {});
    };

    clickSave = async () => {
        try {
            let result = await editOrderService(this.state);

            // error case
            if (result.errCode !== 0) {
                alert(result.errMessage);
            }
            // successful case
            else {
                alert('save order successful');
                // update order status
                this.refreshOrder();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    refreshOrder = async () => {
        await this.getOrder();
        await this.initData();
        await this.getOrderStatusCode();
    };

    getUserDetail = async () => {
        try {
            let user = await getAllUsersService(this.state.own_user);
            user = user.user;

            let copyState = { ...this.state };
            copyState.user_detail = user;
            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        let order = this.state.order;
        let orders_code = this.state.orders_code;
        let user_detail = this.state.user_detail;
        return (
            <>
                <Row gutter={[24, 24]}>
                    {/* c???m button h???y ????n */}
                    <Col span={24}>
                        <Card>
                            <Row gutter={[12, 12]}>
                                <Col span={18}>
                                    {/* <Title level={3}>
                                            M?? v???n ????n: ORD-1001
                                        </Title> */}
                                    <h3 className="not_margin_bottom">
                                        M?? v???n ????n:{' '}
                                        <Text mark>{order.order_code}</Text>
                                    </h3>
                                </Col>
                                {/* h???y ????n */}
                                <Col span={6}>
                                    <Space
                                        className="button-right"
                                        size="small"
                                    >
                                        {/* <Button
                                            type="primary"
                                            size="large"
                                            icon={<DeleteOutlined />}
                                        >
                                            <span className="button_text">
                                                H???y ????n
                                            </span>
                                        </Button> */}
                                        <Select
                                            style={{
                                                width: '150px',
                                            }}
                                            value={this.state.status}
                                            onChange={(key) => {
                                                this.handleOnChangeOrderStatus(
                                                    key
                                                );
                                            }}
                                            id="handleOnChangeOrderStatus"
                                        >
                                            {orders_code &&
                                                orders_code.map((i) => {
                                                    return (
                                                        <Option
                                                            key={i.key}
                                                            value={
                                                                (i.key, i.data)
                                                            }
                                                            id={i.key}
                                                        >
                                                            {i.value_vi}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                        <Button
                                            size="large"
                                            icon={<EditOutlined />}
                                            style={{
                                                background: '#B0FAA0',
                                                borderColor: '#B0FAA0',
                                                color: '#000000',
                                            }}
                                            onClick={() => {
                                                this.clickSave();
                                            }}
                                            id="clickSave"
                                        >
                                            <span className="button_text">
                                                L??u
                                            </span>
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    {/* b??n tr??i */}
                    <Col span={12}>
                        <Row gutter={[12, 12]}>
                            {/* Th??ng tin ????n h??ng */}
                            <Col span={24}>
                                <Card bordered={false}>
                                    <Title level={4}>Th??ng tin ????n h??ng</Title>
                                    <Row gutter={[12, 12]}>
                                        {/* ph??a lo???i xe */}
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
                                                    label="Lo???i xe:"
                                                    span={3}
                                                >
                                                    {
                                                        this.state
                                                            .vehicle_name_input
                                                    }
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="S??? xe:"
                                                    span={3}
                                                >
                                                    {order.number_of_vehicle}
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="Lo???i tr???ng t???i:"
                                                    span={3}
                                                >
                                                    {
                                                        this.state
                                                            .tonage_name_input
                                                    }
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="Gi?? tr??? h??ng h??a:"
                                                    span={3}
                                                >
                                                    200.000.000 VN??
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="S??? ki???n:"
                                                    span={3}
                                                >
                                                    {order.number_package}
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="T???ng kh???i l?????ng:"
                                                    span={3}
                                                >
                                                    {order.weight} T???n
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Col>
                                        {/* Ph??a ng??y t???o ????n */}
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
                                                    label="Ng??y t???o ????n"
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
                                                    label="Ng??y b???c h??ng"
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
                                                    label="Ng??y d??? ki???n giao"
                                                    span={3}
                                                >
                                                    {this.state.intend_time !=
                                                    ''
                                                        ? moment(
                                                              this.state
                                                                  .intend_time
                                                          ).format(
                                                              dateFormat.DATE_FORMAT
                                                          )
                                                        : '...'}
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="Ng??y giao"
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
                                                    label="Tr???ng th??i v???n ????n:"
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
                                        {/* ph???n t???ng tr???ng l?????ng quy ?????i */}
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
                                                    label="T???ng tr???ng l?????ng quy ?????i (D x R x C):"
                                                    span={3}
                                                >
                                                    {this.state.size_input} (m)
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label="Lo???i h??ng h??a:"
                                                    span={3}
                                                >
                                                    {
                                                        this.state
                                                            .goods_code_input
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label="M?? t??? h??ng h??a:"
                                                    span={3}
                                                >
                                                    {order.description}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Col>
                                    </Row>
                                    {/* span = 1 l?? chia 3
                                                                    span = 2 l?? chia 2
                                                                    span = 3 l?? chia 1 */}
                                </Card>
                            </Col>
                            {/* D???ch v??? v???n t???i */}
                            <Col span={24}>
                                <Card className="left_desc" bordered={false}>
                                    <Title level={4}>D???ch v??? v???n t???i</Title>
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
                                                    label="B???o hi???m"
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
                                                    label="Thu?? b???c, d??? h??ng"
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
                                                    label="Ch??? thu?? xe, kh??ng thu?? th??ng cont"
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
                                                    label="Ti???n thu h???"
                                                    span={3}
                                                >
                                                    {order.cod_fee == true ? (
                                                        <CheckOutlined />
                                                    ) : (
                                                        <StopOutlined />
                                                    )}
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="B???o qu???n ????ng l???nh"
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

                            {/* Th??ng tin t??i kho???n ?????t */}
                            <Col span={24}>
                                <Card className="left_desc" bordered={false}>
                                    <Title level={4}>T??i kho???n ?????t ????n</Title>
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
                                                    label="T??n"
                                                    span={3}
                                                >
                                                    {user_detail
                                                        ? user_detail.name
                                                        : ''}
                                                </Descriptions.Item>

                                                {/* <Descriptions.Item
                                                    label="??i???m tin c???y"
                                                    span={3}
                                                >
                                                    {user_detail
                                                        ? user_detail.confidence_score
                                                        : ''}
                                                </Descriptions.Item> */}
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
                                                    label="Email"
                                                    span={3}
                                                >
                                                    {user_detail
                                                        ? user_detail.email
                                                        : ''}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    {/* b??n ph???i */}
                    <Col span={12}>
                        <Row gutter={[12, 12]}>
                            {/* Ng?????i g???i h??ng */}
                            <Col span={24}>
                                <Card className="right_desc" bordered={false}>
                                    <Title level={4}>Ng?????i g???i h??ng</Title>
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
                            {/* Ng?????i nh???n h??ng */}
                            <Col span={24}>
                                <Card className="right_desc" bordered={false}>
                                    <Title level={4}>Ng?????i nh???n h??ng</Title>
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
                                            {order.receiver_contact_name}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label={<PhoneOutlined />}
                                            span={3}
                                        >
                                            {order.receiver_phone}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label={<HomeOutlined />}
                                            span={3}
                                        >
                                            {this.state.receiver_address}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            {/* Th??ng tin thanh to??n */}
                            <Col span={24}>
                                <Card className="right_desc" bordered={false}>
                                    <Title level={4}>
                                        Th??ng tin thanh to??n
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
                                            label="Ng?????i thanh to??n"
                                            span={3}
                                        >
                                            {this.state.payer_name_input}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label="H??nh th???c thanh to??n"
                                            span={3}
                                        >
                                            {this.state.payment_code_input}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label="M?? tham chi???u"
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
                                    <Title level={4}>Ghi ch??</Title>

                                    <Descriptions
                                        title=""
                                        contentStyle={{
                                            fontWeight: 'bold',
                                            position: 'absolute',
                                            right: '60px',
                                        }}
                                    >
                                        <Descriptions.Item
                                            label="Ghi ch?? cho t??i x???"
                                            span={3}
                                        >
                                            {order.note}{' '}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            {/* T???ng c?????c */}
                            <Col span={24}>
                                <Card>
                                    <Row gutter={[12, 12]}>
                                        <Col span={12}>
                                            <Title
                                                level={4}
                                                className="not_margin_bottom"
                                            >
                                                T???ng c?????c:
                                            </Title>
                                        </Col>
                                        <Col span={12}>
                                            <Title
                                                level={3}
                                                className="right-align not_margin_bottom"
                                            >
                                                {order.total_price ? (
                                                    CommonUtils.formattedValue(
                                                        order.total_price
                                                    )
                                                ) : (
                                                    <>0 VN??</>
                                                )}
                                            </Title>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderTab);

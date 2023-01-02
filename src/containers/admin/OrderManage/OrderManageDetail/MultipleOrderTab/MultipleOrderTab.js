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
    searchOrderByOrderCodeService,
    editOrderByOrderCodeService,
} from '../../../../../services/orderService';
import { getAddressBookService } from '../../../../../services/addressBookService';
import {
    getAllCodeByKeyService,
    getAllCodeService,
} from '../../../../../services/allCodeService';
import { getAllPayerService } from '../../../../../services/payerService';
import { dateFormat, CommonUtils } from '../../../../../utils';
import { getAllUsersService } from '../../../../../services/userService';

import Data from '../../../../home/NewOrderMulti/Data';
import { toast } from 'react-toastify';

const { Text } = Typography;
const { Title } = Typography;
const { Option } = Select;

class MultipleOrderTab extends Component {
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

            // list receiver
            receiver_list: [],
            orderList: [],
            total_all: '0',

            // update by order_code
            order_code: '',
        };
    }

    async componentDidMount() {
        await this.getOrder();
        await this.initData();
        await this.getOrderStatusCode();
        await this.getUserDetail();
        // vận đơn đa
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
        copyState['status'] = order.status;
        copyState['own_user'] = order.own_user;
        copyState['order_code'] = order.order_code;
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

    // this function updates status by order_code
    // => all multi-point bill of lading received is updated
    // follow by order_code, not by order_id
    clickSaveMultipleOrderStatus = async () => {
        try {
            let result = await editOrderByOrderCodeService(this.state);

            // error case
            if (result.errCode !== 0) {
                toast.error(result.errMessage);
            }
            // successful case
            else {
                toast.success('save order successful');
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
            temp = temp + +i.total_fee;
        });
        temp = temp.toString();

        let copyState = { ...this.state };
        copyState.total_all = temp;

        this.setState({ ...copyState }, () => {});
    };

    render() {
        let order = this.state.order;
        let orders_code = this.state.orders_code;
        let user_detail = this.state.user_detail;
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
                                        Mã vận đơn:{' '}
                                        <Text mark>{order.order_code}</Text>{' '}
                                        {''}
                                        <Tag color="#87d068">Nhiều điểm dỡ</Tag>
                                    </h3>
                                </Col>
                                {/* hủy đơn */}
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
                                                Hủy đơn
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
                                        >
                                            {orders_code &&
                                                orders_code.map((i) => {
                                                    return (
                                                        <Option
                                                            key={i.key}
                                                            value={
                                                                (i.key, i.data)
                                                            }
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
                                                this.clickSaveMultipleOrderStatus();
                                            }}
                                        >
                                            <span className="button_text">
                                                Lưu
                                            </span>
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    {/* bên trái */}
                    <Col span={12}>
                        <Row gutter={[12, 12]}>
                            {/* Thông tin đơn hàng */}
                            <Col span={24}>
                                <Card bordered={false}>
                                    <Title level={4}>Thông tin đơn hàng</Title>
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
                                                    label="Loại xe:"
                                                    span={3}
                                                >
                                                    {
                                                        this.state
                                                            .vehicle_name_input
                                                    }
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="Số xe:"
                                                    span={3}
                                                >
                                                    {order.number_of_vehicle}
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="Loại trọng tải:"
                                                    span={3}
                                                >
                                                    {
                                                        this.state
                                                            .tonage_name_input
                                                    }
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="Giá trị hàng hóa:"
                                                    span={3}
                                                >
                                                    200.000.000 VNĐ
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="Số kiện:"
                                                    span={3}
                                                >
                                                    {order.number_package}
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="Tổng khối lượng:"
                                                    span={3}
                                                >
                                                    {order.weight} Tấn
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
                                                    label="Ngày tạo đơn"
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
                                                    label="Ngày bốc hàng"
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
                                                    label="Ngày dự kiến giao"
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
                                                    label="Ngày giao"
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
                                                    label="Trạng thái vận đơn:"
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
                                                    label="Tổng trọng lượng quy đổi (D x R x C):"
                                                    span={3}
                                                >
                                                    {this.state.size_input} (m)
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label="Loại hàng hóa:"
                                                    span={3}
                                                >
                                                    {
                                                        this.state
                                                            .goods_code_input
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label="Mô tả hàng hóa:"
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
                                    <Title level={4}>Dịch vụ vận tải</Title>
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
                                                    label="Bảo hiểm"
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
                                                    label="Thuê bốc, dỡ hàng"
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
                                                    label="Chỉ thuê xe, không thuê thùng cont"
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
                                                    label="Tiền thu hộ"
                                                    span={3}
                                                >
                                                    {order.cod_fee == true ? (
                                                        <CheckOutlined />
                                                    ) : (
                                                        <StopOutlined />
                                                    )}
                                                </Descriptions.Item>

                                                <Descriptions.Item
                                                    label="Bảo quản đông lạnh"
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

                            {/* Thông tin tài khoản đặt */}
                            <Col span={24}>
                                <Card className="left_desc" bordered={false}>
                                    <Title level={4}>Tài khoản đặt đơn</Title>
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
                                                    label="Tên"
                                                    span={3}
                                                >
                                                    {user_detail
                                                        ? user_detail.name
                                                        : ''}
                                                </Descriptions.Item>

                                                {/* <Descriptions.Item
                                                    label="Điểm tin cậy"
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
                    {/* bên phải */}
                    <Col span={12}>
                        <Row gutter={[12, 12]}>
                            {/* Người gửi hàng */}
                            <Col span={24}>
                                <Card className="right_desc" bordered={false}>
                                    <Title level={4}>Người gửi hàng</Title>
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
                                        Thông tin thanh toán
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
                                            label="Người thanh toán"
                                            span={3}
                                        >
                                            {this.state.payer_name_input}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label="Hình thức thanh toán"
                                            span={3}
                                        >
                                            {this.state.payment_code_input}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label="Mã tham chiếu"
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
                                    <Title level={4}>Ghi chú</Title>

                                    <Descriptions
                                        title=""
                                        contentStyle={{
                                            fontWeight: 'bold',
                                            position: 'absolute',
                                            right: '60px',
                                        }}
                                    >
                                        <Descriptions.Item
                                            label="Ghi chú cho tài xế"
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
                                                Tổng cước:
                                            </Title>
                                        </Col>
                                        <Col span={12}>
                                            <Title
                                                level={3}
                                                className="right-align not_margin_bottom"
                                            >
                                                {this.state.total_all ? (
                                                    CommonUtils.formattedValue(
                                                        this.state.total_all
                                                    )
                                                ) : (
                                                    <>0 VNĐ</>
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
                        <Title level={4}>Các điểm dỡ hàng</Title>

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

export default connect(mapStateToProps, mapDispatchToProps)(MultipleOrderTab);

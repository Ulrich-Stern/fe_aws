import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Layout, Row, Col, Button } from 'antd';
import MenuOption from '../../common/MenuOption/MenuOption';
import {
    SearchOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';

import { Card, Avatar } from 'antd';
import { Space } from 'antd';
import { Carousel } from 'antd';
import { Select } from 'antd';
import { DatePicker } from 'antd';

import HeaderTag from '../../common/HeaderTag/HeaderTag';
import { FormattedMessage } from 'react-intl';

import slide1 from '../../../assets/images/slide1.jpg';
import slide2 from '../../../assets/images/slide2.jpg';
import truck from '../../../assets/images/truck.png';
import money from '../../../assets/images/money.png';

import { searchOrderByMultipleCondition } from '../../../services/orderService';
import { toast } from 'react-toastify';
import { CommonUtils, INVOICE_STATUS } from '../../../utils';

const { RangePicker } = DatePicker;
const { Sider, Content } = Layout;

const { Option } = Select;

const gridStyle = {
    width: '1/3',
    textAlign: 'center',
};

const contentStyle = {
    height: '400px',
    width: '100%',
};

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            own_user: this.props.userInfo._id,

            // search mutilple condition obj
            start_date: '',
            end_date: '',
            status: 'all',
            time_filter_mode: 'is_last_7',

            // result search or filter
            orderSearchApiList: [],

            // to display
            number_of_order: 0,
            count_total_price: '',
            count_cod: '',
            count_number_of_vehicle: '',
            count_paid: 0,
            count_unpaid: 0,
        };
    }

    async componentDidMount() {
        await this.getOrderByFilter();
        await this.calculateGeneral();
    }

    getOrderByFilter = async () => {
        try {
            console.log('getOrderByFilter');
            let order = [];
            // Empty fields will be ignored
            order = await searchOrderByMultipleCondition(this.state);

            order = order.order;
            let number_of_order = order.length;

            let copyState = { ...this.state };
            copyState.orderSearchApiList = order;
            copyState.number_of_order = number_of_order;
            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeInput = (e, id) => {
        let copyState = { ...this.state };

        if (id === 'time_filter_mode') {
            copyState[id] = e;
        } else {
            copyState[id] = e.target.value;
        }
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    validateInput = () => {
        if (this.state.time_filter_mode != '') {
            this.setState({ start_date: '', end_date: '' });
        }
    };

    clickFilter = async () => {
        try {
            await this.validateInput();

            await this.getOrderByFilter();

            await this.calculateGeneral();

            toast.success('Filter order successfully!');
        } catch (error) {
            toast.error('There was an error');
            console.log('Error:', error);
        }
    };

    handleChangeRangePicker = async (e) => {
        let start_date = moment(e[0]).format('YYYY-MM-DD');
        let end_date = moment(e[1]).format('YYYY-MM-DD');

        let copyState = { ...this.state };
        copyState.start_date = start_date;
        copyState.end_date = end_date;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    calculateGeneral = async () => {
        let orderSearchApiList = this.state.orderSearchApiList;
        let count_total_price = 0;
        let count_cod = 0;
        let count_number_of_vehicle = 0;
        let count_paid = 0;

        await orderSearchApiList.forEach(async (i) => {
            count_total_price += +i.total_price;
            count_cod += +i.cod;
            count_number_of_vehicle += +i.number_of_vehicle;
            //invoice
            let current_invoice = i.invoice_record;

            if (current_invoice.length > 0) {
                if (current_invoice[0].status === INVOICE_STATUS.PAID)
                    count_paid++;
            }
        });

        let count_unpaid = orderSearchApiList.length - count_paid;

        let copyState = { ...this.state };
        copyState.count_total_price = count_total_price.toString();
        copyState.count_cod = count_cod.toString();
        copyState.count_number_of_vehicle = count_number_of_vehicle.toString();

        copyState.count_unpaid = count_unpaid.toString();
        copyState.count_paid = count_paid.toString();

        this.setState({ ...copyState }, () => {});
    };

    render() {
        return (
            <>
                <Layout>
                    <HeaderTag
                        breadcrumb1={<FormattedMessage id="common.dashboard" />}
                        breadcrumb2={
                            <FormattedMessage id="dashboard.overview" />
                        }
                    />
                    <Layout>
                        <Sider width={256} id="main">
                            <MenuOption />
                        </Sider>
                        <Layout
                            style={{ padding: '24px 24px 24px' }}
                            className="layout_background1"
                        >
                            <Content>
                                <Row gutter={[16, 24]}>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={24}
                                        xl={18}
                                    >
                                        <Row gutter={[16, 24]}>
                                            {/* slider */}

                                            <Col span={24}>
                                                <Carousel autoplay>
                                                    <div>
                                                        <img
                                                            style={contentStyle}
                                                            src={slide1}
                                                        />
                                                    </div>
                                                    <div>
                                                        <img
                                                            style={contentStyle}
                                                            src={slide2}
                                                        />
                                                    </div>
                                                </Carousel>
                                            </Col>

                                            {/* form */}
                                            <Col span={24}>
                                                <Row gutter={[16, 12]}>
                                                    {/* form search */}
                                                    <Col span={24}>
                                                        {/* input */}
                                                        <Card>
                                                            {/* <Space> */}
                                                            <Row
                                                                gutter={[
                                                                    16, 12,
                                                                ]}
                                                            >
                                                                <Col
                                                                    xs={24}
                                                                    sm={24}
                                                                    md={24}
                                                                    lg={8}
                                                                    xl={8}
                                                                >
                                                                    {/* filter by time space */}
                                                                    <Select
                                                                        style={{
                                                                            width: '100%',
                                                                        }}
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.handleOnChangeInput(
                                                                                e,
                                                                                'time_filter_mode'
                                                                            );
                                                                        }}
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .time_filter_mode
                                                                        }
                                                                        id="time_filter_mode"
                                                                    >
                                                                        <Option
                                                                            value="is_last_7"
                                                                            id="is_last_7"
                                                                        >
                                                                            <FormattedMessage id="dashboard.last7days" />
                                                                        </Option>
                                                                        <Option
                                                                            value="is_last_30"
                                                                            id="is_last_30"
                                                                        >
                                                                            <FormattedMessage id="dashboard.last30days" />
                                                                        </Option>

                                                                        <Option
                                                                            value="is_last_month"
                                                                            id="is_last_month"
                                                                        >
                                                                            <FormattedMessage id="dashboard.last_month" />
                                                                        </Option>
                                                                        <Option
                                                                            value=""
                                                                            id="other"
                                                                        >
                                                                            Chọn
                                                                            khoảng
                                                                            thời
                                                                            gian
                                                                        </Option>
                                                                    </Select>
                                                                </Col>

                                                                <Col
                                                                    xs={24}
                                                                    sm={24}
                                                                    md={12}
                                                                    lg={8}
                                                                    xl={8}
                                                                >
                                                                    {/* by range picker */}
                                                                    <RangePicker
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.handleChangeRangePicker(
                                                                                e
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            this
                                                                                .state
                                                                                .time_filter_mode !=
                                                                            ''
                                                                                ? true
                                                                                : false
                                                                        }
                                                                        id="RangePicker"
                                                                    />
                                                                </Col>

                                                                <Col
                                                                    xs={24}
                                                                    sm={24}
                                                                    md={12}
                                                                    lg={8}
                                                                    xl={8}
                                                                >
                                                                    <Button
                                                                        type="primary"
                                                                        size="middle"
                                                                        icon={
                                                                            <SearchOutlined />
                                                                        }
                                                                        onClick={() => {
                                                                            this.clickFilter();
                                                                        }}
                                                                        id="click_filter"
                                                                    >
                                                                        <FormattedMessage id="order.search" />
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                            {/* </Space> */}
                                                        </Card>
                                                    </Col>

                                                    <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={24}
                                                        lg={18}
                                                    >
                                                        {/* cụm card thống kê */}

                                                        <Card>
                                                            <Card.Grid
                                                                style={
                                                                    gridStyle
                                                                }
                                                            >
                                                                <div className="box_statistic">
                                                                    <p>
                                                                        <FormattedMessage id="dashboard.total_order" />
                                                                    </p>
                                                                    <p>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .number_of_order
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </Card.Grid>
                                                            <Card.Grid
                                                                style={
                                                                    gridStyle
                                                                }
                                                            >
                                                                <div className="box_statistic paid_order">
                                                                    <p>
                                                                        <FormattedMessage id="dashboard.paid_order" />
                                                                    </p>
                                                                    <p>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .count_paid
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </Card.Grid>
                                                            <Card.Grid
                                                                style={
                                                                    gridStyle
                                                                }
                                                            >
                                                                <div className="box_statistic unpaid_order">
                                                                    <p>
                                                                        <FormattedMessage id="dashboard.unpaid_order" />
                                                                    </p>
                                                                    <p>
                                                                        {
                                                                            this
                                                                                .state
                                                                                .count_unpaid
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </Card.Grid>
                                                        </Card>
                                                    </Col>
                                                    <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={24}
                                                        lg={6}
                                                        xl={6}
                                                    >
                                                        <Card className="red_border">
                                                            <div className="box_statistic out_date_order">
                                                                <p>
                                                                    <FormattedMessage id="dashboard.out_date_order" />
                                                                </p>
                                                                <p>0</p>
                                                            </div>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    {/* tiền thu hộ
                                    &&
                                    phí vận chuyển */}
                                    <Col xs={24} sm={24} md={24} lg={24} xl={6}>
                                        <Row gutter={[16, 24]}>
                                            <Col
                                                xs={24}
                                                sm={24}
                                                md={12}
                                                lg={8}
                                                xl={24}
                                            >
                                                <Card
                                                    className="dashboard_right"
                                                    bordered={false}
                                                >
                                                    <Row gutter={[16, 24]}>
                                                        <Col span={24}>
                                                            <p className="box_title">
                                                                <FormattedMessage id="dashboard.ship_fee" />
                                                                (VNĐ)
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={[16, 24]}>
                                                        <Col span={8}>
                                                            <Avatar
                                                                // src="https://img.icons8.com/clouds/100/000000/money.png"
                                                                src={money}
                                                                className="box_image"
                                                            />
                                                        </Col>
                                                        <Col span={16}>
                                                            <p className="box_money">
                                                                {this.state
                                                                    .count_total_price &&
                                                                +this.state
                                                                    .count_total_price >
                                                                    0 ? (
                                                                    CommonUtils.formattedValueNoVND(
                                                                        this
                                                                            .state
                                                                            .count_total_price
                                                                    )
                                                                ) : (
                                                                    <>...</>
                                                                )}
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                            <Col
                                                xs={24}
                                                sm={24}
                                                md={12}
                                                lg={8}
                                                xl={24}
                                            >
                                                <Card
                                                    className="dashboard_right"
                                                    bordered={false}
                                                >
                                                    <Row gutter={[16, 24]}>
                                                        <Col span={24}>
                                                            <p className="box_title">
                                                                <FormattedMessage id="dashboard.sum_money" />
                                                                (VNĐ)
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={[16, 24]}>
                                                        <Col span={8}>
                                                            <Avatar
                                                                // src="https://img.icons8.com/clouds/100/000000/money.png"
                                                                src={money}
                                                                className="box_image"
                                                            />
                                                        </Col>
                                                        <Col span={16}>
                                                            <p className="box_money">
                                                                {this.state
                                                                    .count_cod &&
                                                                +this.state
                                                                    .count_cod >
                                                                    0 ? (
                                                                    CommonUtils.formattedValueNoVND(
                                                                        this
                                                                            .state
                                                                            .count_cod
                                                                    )
                                                                ) : (
                                                                    <>...</>
                                                                )}
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>

                                            {/* tổng số xe */}
                                            <Col
                                                xs={24}
                                                sm={24}
                                                md={12}
                                                lg={8}
                                                xl={24}
                                            >
                                                <Card
                                                    className="dashboard_right"
                                                    bordered={false}
                                                >
                                                    <Row gutter={[16, 24]}>
                                                        <Col span={24}>
                                                            <p className="box_title">
                                                                <FormattedMessage id="dashboard.sum_of_vehicle" />
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={[16, 24]}>
                                                        <Col span={8}>
                                                            <Avatar
                                                                // src="https://img.icons8.com/clouds/100/null/truck.png"
                                                                src={truck}
                                                                className="box_image"
                                                            />
                                                        </Col>
                                                        <Col span={16}>
                                                            <p className="box_money">
                                                                {this.state
                                                                    .count_number_of_vehicle &&
                                                                +this.state
                                                                    .count_total_price >=
                                                                    0 ? (
                                                                    this.state
                                                                        .count_number_of_vehicle
                                                                ) : (
                                                                    <>...</>
                                                                )}
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Content>
                            {/* <Footer>
                                <div style={{ height: '900px' }}></div>
                            </Footer> */}
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
    Layout,
    Row,
    Col,
    Space,
    DatePicker,
    Radio,
    Button,
    Card,
    Typography,
    Input,
    Select,
} from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import { LANGUAGE } from '../../../utils';
import HeaderTag from '../../common/HeaderTag/HeaderTag';
import MenuOption from '../../common/MenuOption/MenuOption';
import OrdersData from './OrdersData';
import { FormattedMessage } from 'react-intl';
import {
    searchOrderByOrderCodeService,
    searchOrderByMultipleCondition,
    getAllOrderByOwnUserInitTableService,
} from '../../../services/orderService';
import { getAllCodeService } from '../../../services/allCodeService';

import * as actions from '../../../store/actions';

const { Title } = Typography;

const { Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataFromApi: [],
            orderList: [],

            // search obj
            order_code: '',
            // search mutilple condition obj
            start_date: '',
            end_date: '',
            status: 'all',
            time_filter_mode: '',
            own_user: this.props.userInfo._id,

            // button set status code
            orders_code: [],
        };
    }

    async componentDidMount() {
        await Promise.all([
            this.getAllOrderByOwnUser(),
            this.getOrderStatusCode(),
        ]);
        // độc lập , cho phép thực hiện song song

        this.props.initTableOrderRedux(this.state.dataFromApi);
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

    getOrderByOrderCode = async function () {
        try {
            let result = await searchOrderByOrderCodeService(
                this.state.order_code
            );
            result = result.order;

            let copyState = { ...this.state };
            copyState['dataFromApi'] = result;
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

    getAllOrderByOwnUser = async () => {
        try {
            let userId = this.props.userInfo._id;
            let orders = await getAllOrderByOwnUserInitTableService(userId);

            let copyState = { ...this.state };
            copyState.dataFromApi = orders.order;

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

    getOrderByFilter = async () => {
        try {
            let order = [];
            // Empty fields will be ignored
            order = await searchOrderByMultipleCondition(this.state);

            order = order.order;

            let copyState = { ...this.state };
            copyState.dataFromApi = order;
            this.setState({ ...copyState });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeInput = (e, id) => {
        let copyState = { ...this.state };
        copyState[id] = e.target.value;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    // tách hàm để kịp render lại -> cập nhật state
    clickSearch = async () => {
        await this.getOrderByOrderCode();

        await this.props.initTableOrderRedux(this.state.dataFromApi);
    };

    handleOnChangeOrderStatus = (key) => {
        let copyState = { ...this.state };
        copyState.status = key;
        this.setState({ ...copyState }, () => {});
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

            await this.props.initTableOrderRedux(this.state.dataFromApi);
        } catch (error) {
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

    render() {
        let orders_code = this.state.orders_code;
        let lang = this.props.lang;
        return (
            <>
                <Layout>
                    <HeaderTag
                        breadcrumb1={<FormattedMessage id="common.dashboard" />}
                        breadcrumb2={
                            <FormattedMessage id="menu.pages.order_list" />
                        }
                    />
                    <Layout>
                        <Sider width="256" id="main">
                            <MenuOption />
                        </Sider>
                        <Layout
                            className="site-layout-background"
                            style={{ padding: '24px 24px' }}
                        >
                            <Content>
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <div className="site-card-border-less-wrapper">
                                            <Card
                                                bordered={false}
                                                className="order_header"
                                            >
                                                <Title
                                                    level={2}
                                                    className="order_title"
                                                >
                                                    {
                                                        <FormattedMessage id="menu.pages.order_list" />
                                                    }
                                                </Title>
                                                <Row gutter={[16, 16]}>
                                                    {/* search & filter */}
                                                    <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={12}
                                                        lg={8}
                                                        xl={8}
                                                    >
                                                        <Card className="card_border">
                                                            <Row
                                                                gutter={[
                                                                    16, 16,
                                                                ]}
                                                            >
                                                                {/* search order code */}
                                                                <Col span={24}>
                                                                    <Search
                                                                        placeholder={
                                                                            LANGUAGE.VI ===
                                                                            lang
                                                                                ? 'Nhập mã vận đơn'
                                                                                : 'Enter order code'
                                                                        }
                                                                        onSearch={() => {
                                                                            this.clickSearch();
                                                                        }}
                                                                        enterButton
                                                                        style={{
                                                                            width: '100%',
                                                                        }}
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.handleOnChangeInput(
                                                                                e,
                                                                                'order_code'
                                                                            );
                                                                        }}
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .order_code
                                                                        }
                                                                        id="search_order_code"
                                                                    />
                                                                </Col>
                                                                {/* status filter */}
                                                                <Col span={6}>
                                                                    <p>
                                                                        {
                                                                            <FormattedMessage id="order.order_status" />
                                                                        }
                                                                    </p>
                                                                </Col>
                                                                <Col span={18}>
                                                                    <Select
                                                                        style={{
                                                                            width: '100%',
                                                                        }}
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .status
                                                                        }
                                                                        onChange={(
                                                                            key
                                                                        ) => {
                                                                            this.handleOnChangeOrderStatus(
                                                                                key
                                                                            );
                                                                        }}
                                                                        id="OnChangeOrderStatus"
                                                                    >
                                                                        <Option
                                                                            key="all"
                                                                            value="all"
                                                                            id="all"
                                                                        >
                                                                            {
                                                                                <FormattedMessage id="order.all" />
                                                                            }
                                                                        </Option>
                                                                        {orders_code &&
                                                                            orders_code.map(
                                                                                (
                                                                                    i
                                                                                ) => {
                                                                                    return (
                                                                                        <Option
                                                                                            key={
                                                                                                i.key
                                                                                            }
                                                                                            value={
                                                                                                (i.key,
                                                                                                i.data)
                                                                                            }
                                                                                            id={
                                                                                                i.key
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                i.value_vi
                                                                                            }
                                                                                        </Option>
                                                                                    );
                                                                                }
                                                                            )}
                                                                    </Select>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                    {/* time picker */}
                                                    <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={12}
                                                        lg={10}
                                                        xl={10}
                                                    >
                                                        <Card className="choose-range-time-small-custom card_border box_time">
                                                            <Row
                                                                gutter={[
                                                                    16, 16,
                                                                ]}
                                                            >
                                                                <Col span={24}>
                                                                    <RangePicker
                                                                        className="range_picker"
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
                                                                        id="range_picker"
                                                                    />
                                                                </Col>
                                                                <Col span={24}>
                                                                    <Radio.Group
                                                                        size="small"
                                                                        buttonStyle="solid"
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
                                                                        <Radio.Button
                                                                            value=""
                                                                            id="other"
                                                                        >
                                                                            {
                                                                                <FormattedMessage id="order.all" />
                                                                            }
                                                                        </Radio.Button>
                                                                        <Radio.Button
                                                                            value={
                                                                                'is_last_7'
                                                                            }
                                                                            id="is_last_7"
                                                                        >
                                                                            {
                                                                                <FormattedMessage id="dashboard.last7days" />
                                                                            }
                                                                        </Radio.Button>
                                                                        <Radio.Button
                                                                            value="is_last_30"
                                                                            id="is_last_30"
                                                                        >
                                                                            {
                                                                                <FormattedMessage id="dashboard.last30days" />
                                                                            }
                                                                        </Radio.Button>
                                                                        <Radio.Button
                                                                            value="is_last_month"
                                                                            id="is_last_month"
                                                                        >
                                                                            {
                                                                                <FormattedMessage id="dashboard.last_month" />
                                                                            }
                                                                        </Radio.Button>
                                                                    </Radio.Group>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                    {/* button */}
                                                    <Col span={6}>
                                                        <Space
                                                            align="end"
                                                            className="space_button"
                                                            size="large"
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
                                                                id="clickFilter"
                                                            >
                                                                <FormattedMessage id="order.search" />
                                                            </Button>

                                                            {/* <Button
                                                                size="middle"
                                                                icon={
                                                                    <FileExcelFilled />
                                                                }
                                                                style={{
                                                                    background:
                                                                        '#B0FAA0',
                                                                    borderColor:
                                                                        '#B0FAA0',
                                                                    color: '#000000',
                                                                }}
                                                            >
                                                                <FormattedMessage id="order.export_excel" />
                                                            </Button> */}
                                                        </Space>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </div>
                                    </Col>
                                </Row>

                                <OrdersData
                                    orderList={
                                        this.state.orderList &&
                                        this.state.orderList.length > 0
                                            ? this.state.orderList
                                            : null
                                    }
                                />
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

export default connect(mapStateToProps, mapDispatchToProps)(Orders);

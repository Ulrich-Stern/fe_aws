import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
    Row,
    Col,
    Card,
    Input,
    Select,
    DatePicker,
    Radio,
    Button,
    Space,
} from 'antd';
import { FileExcelFilled, SearchOutlined } from '@ant-design/icons';

import { searchOrderByOrderCodeService } from '../../../../services/orderService';
import { searchOrderByMultipleCondition } from '../../../../services/orderService';
import { getAllCodeService } from '../../../../services/allCodeService';
import TableOrderAdmin from './TableOrderAdmin';

import * as actions from '../../../../store/actions';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

class TableInProcessing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // data source
            orderProcessList: [],
            // search obj
            order_code: '',
            // search mutilple condition obj
            start_date: '',
            end_date: '',
            status: 'all',
            time_filter_mode: '',

            // result search or filter
            orderSearchApiList: [],
            // orderSearchList: [],

            // button set status code
            orders_code: [],
        };
    }

    async componentDidMount() {
        await this.getOrderProcessList();
        await this.getOrderStatusCode();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.orderListRedux !== this.props.orderListRedux) {
            this.setState(
                {
                    orderProcessList: this.props.orderListRedux,
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
            copyState['orderSearchApiList'] = result;
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

    getOrderProcessList = async () => {
        // vấn đề là Orders Data render xong trước cái thằng Cha Orders -> nó ko cập nhật props
        let orderProcessList = this.props.orderProcessList;
        let copyState = { ...this.state };
        copyState.orderProcessList = orderProcessList;
        this.setState(
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

    getOrderByFilter = async () => {
        try {
            let order = [];
            // Empty fields will be ignored
            order = await searchOrderByMultipleCondition(this.state);

            order = order.order;

            let copyState = { ...this.state };
            copyState.orderSearchApiList = order;
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

        await this.props.initTableOrderRedux(this.state.orderSearchApiList);
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

            // await this.getOrderByOrderCode();
            await this.getOrderByFilter();

            // set data order api -> display in table
            await this.props.initTableOrderRedux(this.state.orderSearchApiList);
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

        return (
            <>
                <Row gutter={[12, 12]}>
                    {/* search & filter */}
                    <Col span={8}>
                        <Card className="card_border">
                            <Row gutter={[16, 16]}>
                                {/* search order code */}
                                <Col span={24}>
                                    <Search
                                        placeholder="Nhập mã vận đơn"
                                        onSearch={() => {
                                            this.clickSearch();
                                        }}
                                        enterButton
                                        style={{
                                            width: '100%',
                                        }}
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'order_code'
                                            );
                                        }}
                                        value={this.state.order_code}
                                        id="search_order_code"
                                    />
                                </Col>
                                {/* status filter */}
                                <Col span={6}>
                                    <p>Trạng thái</p>
                                </Col>
                                <Col span={18}>
                                    <Select
                                        style={{
                                            width: '100%',
                                        }}
                                        value={this.state.status}
                                        onChange={(key) => {
                                            this.handleOnChangeOrderStatus(key);
                                        }}
                                        id="handleOnChangeOrderStatus"
                                    >
                                        <Option key="all" value="all" id="all">
                                            Tất cả
                                        </Option>
                                        {orders_code &&
                                            orders_code.map((i) => {
                                                return (
                                                    <Option
                                                        key={i.key}
                                                        value={(i.key, i.data)}
                                                        id={i.key}
                                                    >
                                                        {i.value_vi}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    {/* time picker */}
                    <Col span={8}>
                        <Card className="choose-range-time-small-custom card_border box_time">
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <RangePicker
                                        className="range_picker"
                                        onChange={(e) => {
                                            this.handleChangeRangePicker(e);
                                        }}
                                        disabled={
                                            this.state.time_filter_mode != ''
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
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'time_filter_mode'
                                            );
                                        }}
                                        value={this.state.time_filter_mode}
                                        id="time_filter_mode"
                                    >
                                        <Radio.Button
                                            value={'is_last_7'}
                                            id="is_last_7"
                                        >
                                            7 ngày trước
                                        </Radio.Button>
                                        <Radio.Button
                                            value="is_last_30"
                                            id="is_last_30"
                                        >
                                            30 ngày trước
                                        </Radio.Button>
                                        <Radio.Button
                                            value="is_last_month"
                                            id="is_last_month"
                                        >
                                            Tháng trước
                                        </Radio.Button>
                                        <Radio.Button value="" id="all_radio">
                                            Tất cả
                                        </Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    {/* button */}
                    <Col span={8}>
                        <Space
                            align="end"
                            className="space_button"
                            size="large"
                        >
                            <Button
                                type="primary"
                                size="large"
                                icon={<SearchOutlined />}
                                onClick={() => {
                                    this.clickFilter();
                                }}
                                id="clickFilter"
                            >
                                Lọc điều kiện
                            </Button>

                            {/* <Button
                                size="large"
                                icon={<FileExcelFilled />}
                                style={{
                                    background: '#B0FAA0',
                                    borderColor: '#B0FAA0',
                                    color: '#000000',
                                }}
                            >
                                Xuất file excel
                            </Button> */}
                        </Space>
                    </Col>
                    {/* table data */}
                    <Col span={24}>
                        <TableOrderAdmin
                            orderList={this.state.orderProcessList}
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
        orderListRedux: state.admin.orderListRedux,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        initTableOrderRedux: (dataFromApi) =>
            dispatch(actions.initTableOrderRedux(dataFromApi)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableInProcessing);

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import moment from 'moment';

import { Layout, Row, Col, Card, DatePicker } from 'antd';
import { Typography, Radio, Space, Button, Input, Select } from 'antd';

import { EditFilled, PrinterFilled, FileExcelFilled } from '@ant-design/icons';

import HeaderTag from '../../common/HeaderTag/HeaderTag';
import MenuOption from '../../common/MenuOption/MenuOption';
import InvoiceTable from './InvoiceTable';
import { FormattedMessage } from 'react-intl';
import { LANGUAGE } from '../../../utils';
import {
    getInvoiceByConditionService,
    initTableInvoiceService,
    getInvoicesByOrderCodeService,
    getInvoicesByMultipleConditionCodeService,
} from '../../../services/invoiceService';

const { Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

class Invoices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            own_user: this.props.userInfo._id,
            invoicesFromApi: [],
            invoices: [],

            // search invoice
            // search obj
            order_code: '',
            // search mutilple condition obj
            start_date: '',
            end_date: '',
            status: 'all',
            time_filter_mode: '',
        };
    }

    async componentDidMount() {
        await this.getInvoices();
        await this.initTable();
    }

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

    getInvoices = async () => {
        try {
            let invoicesFromApi = await getInvoiceByConditionService(
                this.state.own_user
            );

            let copyState = { ...this.state };
            copyState.invoicesFromApi = invoicesFromApi.invoice;
            this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
        } catch (error) {
            console.log('Error:', error);
        }
    };

    initTable = async () => {
        try {
            let invoices = await initTableInvoiceService(
                this.state.invoicesFromApi
            );

            let copyState = { ...this.state };
            copyState.invoices = invoices;
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

    clickSearch = async () => {
        await this.getInvoicesByOrderCode();

        await this.initTable();
    };

    getInvoicesByOrderCode = async () => {
        try {
            let invoicesFromApi = await getInvoicesByOrderCodeService(
                this.state.order_code
            );

            let copyState = { ...this.state };
            copyState.invoicesFromApi = invoicesFromApi.invoice;
            this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeInvoiceStatus = (key) => {
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

            await this.getInvoiceByFilter();

            await this.initTable();
        } catch (error) {
            console.log('Error:', error);
        }
    };

    getInvoiceByFilter = async () => {
        try {
            let invoicesFromApi =
                await getInvoicesByMultipleConditionCodeService(this.state);

            let copyState = { ...this.state };
            copyState.invoicesFromApi = invoicesFromApi.invoice;
            this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
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
        let lang = this.props.lang;
        return (
            <>
                <Layout>
                    <HeaderTag
                        breadcrumb1={<FormattedMessage id="common.dashboard" />}
                        breadcrumb2={
                            <FormattedMessage id="menu.pages.invoice" />
                        }
                    />
                    <Layout>
                        <Sider width="256" id="main">
                            <MenuOption />
                        </Sider>
                        <Layout
                            className="site-layout-background"
                            style={{ padding: '0 24px 24px' }}
                        >
                            <Content>
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        {/* <div className="site-card-border-less-wrapper"> */}
                                        <Card
                                            bordered={false}
                                            className="order_header"
                                        >
                                            <Title
                                                level={2}
                                                className="order_title"
                                            >
                                                <FormattedMessage id="menu.pages.invoice" />
                                            </Title>
                                            <Row gutter={[16, 16]}>
                                                {/* search form */}
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={12}
                                                    lg={8}
                                                    xl={8}
                                                >
                                                    <Card className="card_border">
                                                        <Row gutter={[16, 16]}>
                                                            <Col span={24}>
                                                                <Search
                                                                    placeholder={
                                                                        LANGUAGE.VI ===
                                                                        lang
                                                                            ? 'Nhập mã vận đơn'
                                                                            : 'Enter order code'
                                                                    }
                                                                    enterButton
                                                                    style={{
                                                                        width: '100%',
                                                                    }}
                                                                    onSearch={() => {
                                                                        this.clickSearch();
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
                                                                />
                                                            </Col>
                                                            <Col span={6}>
                                                                <p>
                                                                    <FormattedMessage id="order.order_status" />
                                                                </p>
                                                            </Col>
                                                            <Col span={18}>
                                                                <Select
                                                                    defaultValue="all"
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
                                                                        this.handleOnChangeInvoiceStatus(
                                                                            key
                                                                        );
                                                                    }}
                                                                >
                                                                    <Option
                                                                        value="all"
                                                                        key="all"
                                                                    >
                                                                        <FormattedMessage id="order.all" />
                                                                    </Option>

                                                                    <Option
                                                                        value="paid"
                                                                        key="paid"
                                                                    >
                                                                        <FormattedMessage id="order.paid" />
                                                                    </Option>
                                                                    <Option
                                                                        value="unpaid"
                                                                        key="unpaid"
                                                                    >
                                                                        <FormattedMessage id="order.unpaid" />
                                                                    </Option>
                                                                </Select>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={12}
                                                    lg={10}
                                                    xl={10}
                                                >
                                                    <Card className="choose-range-time-small-custom card_border box_time">
                                                        <Row gutter={[16, 16]}>
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
                                                <Col span={6}>
                                                    <Space
                                                        align="end"
                                                        className="space_button"
                                                        size="large"
                                                    >
                                                        <Button
                                                            type="primary"
                                                            size="large"
                                                            icon={
                                                                <EditFilled />
                                                            }
                                                            onClick={() => {
                                                                this.clickFilter();
                                                            }}
                                                        >
                                                            <FormattedMessage id="order.search" />
                                                        </Button>
                                                        {/* <Button
                                                            type="primary"
                                                            size="large"
                                                            icon={
                                                                <PrinterFilled />
                                                            }
                                                            style={{
                                                                background:
                                                                    '#0099FF',
                                                                borderColor:
                                                                    '#0099FF',
                                                            }}
                                                        >
                                                            In
                                                        </Button> */}
                                                        {/* <Button
                                                            size="large"
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
                                                            Xuất file excel
                                                        </Button> */}
                                                    </Space>
                                                </Col>
                                                {/* data */}
                                                <Col span={24}>
                                                    <InvoiceTable
                                                        invoices={
                                                            this.state.invoices
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                        </Card>
                                        {/* </div> */}
                                    </Col>
                                </Row>
                            </Content>
                            <div className="footer-note">
                                <p>
                                    <strong>PN Logistic</strong> - version 1.0
                                </p>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Invoices);

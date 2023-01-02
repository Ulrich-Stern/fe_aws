import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Layout, Row, Col, Card, DatePicker } from 'antd';
import { Typography, Radio, Space, Button, Input, Select } from 'antd';
import {
    EditFilled,
    DollarCircleOutlined,
    FieldTimeOutlined,
} from '@ant-design/icons';
import { dateFormat, CommonUtils, INVOICE_STATUS } from '../../../utils';

import { Table, Tag } from 'antd';
import { FormattedMessage } from 'react-intl';
import { LANGUAGE } from '../../../utils';
import {
    getInvoiceByConditionService,
    initTableInvoiceService,
    getInvoicesByOrderCodeService,
    getInvoicesByMultipleConditionCodeService,
    getAllInvoiceService,
} from '../../../services/invoiceService';
import { path } from '../../../utils/constant';

const { Column } = Table;
const { Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

class InvoiceManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            own_user: '',
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
        try {
            await this.getInvoices();
            await this.initTable();
        } catch (error) {
            console.log('error');
            this.setState({ isError: true });
        }
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
            let invoicesFromApi = await getAllInvoiceService('all');

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
        let data = this.state.invoices;
        let lang = this.props.lang;

        return (
            <>
                <div className="custom-container">
                    {/* title */}
                    <div className="text-center">
                        <div className="cf-title-02 cf-title-alt-two">
                            <h3>Quản lý hóa đơn</h3>
                        </div>
                    </div>
                    {/* content */}
                    <div className="tab-container">
                        <>
                            <Card>
                                <Row gutter={[16, 16]}>
                                    {/* search form */}
                                    <Col span={10}>
                                        <Card className="card_border">
                                            <Row gutter={[16, 16]}>
                                                <Col span={24}>
                                                    <Search
                                                        placeholder={
                                                            LANGUAGE.VI === lang
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
                                                        onChange={(e) => {
                                                            this.handleOnChangeInput(
                                                                e,
                                                                'order_code'
                                                            );
                                                        }}
                                                        value={
                                                            this.state
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
                                                            this.state.status
                                                        }
                                                        onChange={(key) => {
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
                                    <Col span={10}>
                                        <Card className="choose-range-time-small-custom card_border box_time">
                                            <Row gutter={[16, 16]}>
                                                <Col span={24}>
                                                    <RangePicker
                                                        className="range_picker"
                                                        onChange={(e) => {
                                                            this.handleChangeRangePicker(
                                                                e
                                                            );
                                                        }}
                                                        disabled={
                                                            this.state
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
                                                        onChange={(e) => {
                                                            this.handleOnChangeInput(
                                                                e,
                                                                'time_filter_mode'
                                                            );
                                                        }}
                                                        value={
                                                            this.state
                                                                .time_filter_mode
                                                        }
                                                        id="time_filter_mode"
                                                    >
                                                        <Radio.Button
                                                            value={'is_last_7'}
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
                                                        <Radio.Button
                                                            value=""
                                                            id="other"
                                                        >
                                                            {
                                                                <FormattedMessage id="order.all" />
                                                            }
                                                        </Radio.Button>
                                                    </Radio.Group>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Space
                                            align="end"
                                            className="space_button"
                                            size="large"
                                        >
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<EditFilled />}
                                                onClick={() => {
                                                    this.clickFilter();
                                                }}
                                            >
                                                <FormattedMessage id="order.search" />
                                            </Button>
                                        </Space>
                                    </Col>
                                </Row>
                            </Card>

                            <Table
                                dataSource={data}
                                scroll={{
                                    x: 'calc(550px + 50%)',
                                    y: 440,
                                }}
                                size="middle"
                                style={{ height: '540px' }}
                                selectedRowKeys="abc"
                            >
                                <Column
                                    title="#"
                                    key="no"
                                    dataIndex="no"
                                    width="15px"
                                    // render={(text, object, index) => index + 1}
                                />
                                <Column
                                    title="Trạng thái"
                                    key="status"
                                    dataIndex="status"
                                    width="80px"
                                    render={(status) => (
                                        <>
                                            {status === INVOICE_STATUS.PAID ? (
                                                <Tag color="blue" key={status}>
                                                    Đã thanh toán
                                                </Tag>
                                            ) : (
                                                <Tag color="red" key={status}>
                                                    Chưa thanh toán
                                                </Tag>
                                            )}
                                        </>
                                    )}
                                />
                                <Column
                                    title="Tài khoản"
                                    key="own_user"
                                    dataIndex="own_user"
                                    width="130px"
                                    render={(data) => (
                                        <Link
                                            to={{
                                                pathname:
                                                    path.USER_MANAGE_DETAIL +
                                                    '?userId=' +
                                                    data.own_user,
                                            }}
                                        >
                                            {data && data.own_user_name
                                                ? data.own_user_name
                                                : ''}
                                        </Link>
                                    )}
                                />
                                <Column
                                    title="Mã vận đơn"
                                    key="order_code"
                                    dataIndex="order_code"
                                    width="70px"
                                    render={(data) => (
                                        <>
                                            <p>{data.order_code}</p>
                                            <p>
                                                {data.is_multiple === true && (
                                                    <Tag color="#87d068">
                                                        Nhiều điểm dỡ
                                                    </Tag>
                                                )}
                                            </p>
                                        </>
                                    )}
                                />

                                <Column
                                    title="Số tiền"
                                    key="total"
                                    dataIndex="total"
                                    width="80px"
                                    render={(data) => (
                                        <>
                                            <div>
                                                <DollarCircleOutlined />{' '}
                                                {data ? (
                                                    CommonUtils.formattedValue(
                                                        data
                                                    )
                                                ) : (
                                                    <div>0 VNĐ</div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                />

                                <Column
                                    title="Ngày đáo hạn"
                                    key="due_date"
                                    dataIndex="due_date"
                                    width="100px"
                                    render={(data) => (
                                        <>
                                            <FieldTimeOutlined />{' '}
                                            {data != ''
                                                ? moment(data).format(
                                                      dateFormat.DATE_FORMAT
                                                  )
                                                : '...'}
                                        </>
                                    )}
                                />
                                <Column
                                    title="Ngày tạo hóa đơn"
                                    key="created"
                                    dataIndex="created"
                                    width="100px"
                                    render={(data) => (
                                        <>
                                            <FieldTimeOutlined />{' '}
                                            {data != ''
                                                ? moment(data).format(
                                                      dateFormat.DATE_FORMAT
                                                  )
                                                : '...'}
                                        </>
                                    )}
                                />
                                <Column
                                    title="Nội dung"
                                    key="content"
                                    dataIndex="content"
                                    width="120px"
                                />
                                {/* <Column
                                        title="Người thanh toán"
                                        key="payer"
                                        dataIndex="payer"
                                        width="100px"
                                        render={(data) => (
                                            <>
                                                <div>
                                                    <UserOutlined />{' '}
                                                    {data.payer_name}
                                                </div>
                                                <div>{data.payment_code}</div>
                                                {data.payment_reference_code && (
                                                    <div>
                                                        Mã tham chiếu:{' '}
                                                        {
                                                            data.payment_reference_code
                                                        }
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    /> */}
                                <Column
                                    title="Chi tiết"
                                    key="order_code"
                                    dataIndex="order_code"
                                    width="50px"
                                    fixed="right"
                                    render={(data) => (
                                        <center>
                                            {data && data.order_id && (
                                                <Link
                                                    to={
                                                        path.ORDER_MANAGE_DETAIL +
                                                        '?orderId=' +
                                                        data.order_id +
                                                        '&tabId=2'
                                                    }
                                                >
                                                    <EditFilled
                                                        style={{
                                                            fontSize: '18px',
                                                            margin: 'auto',
                                                        }}
                                                    />
                                                </Link>
                                            )}
                                        </center>
                                    )}
                                />
                            </Table>
                        </>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return { lang: state.app.language };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceManage);

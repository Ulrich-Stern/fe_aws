import React, { Component } from 'react';

import { connect } from 'react-redux';
import moment from 'moment';
import { PDFExport } from '@progress/kendo-react-pdf';
import '@progress/kendo-theme-material/dist/all.css';

import {
    Button,
    Space,
    Row,
    Col,
    Select,
    Typography,
    Card,
    Descriptions,
    List,
    Divider,
    Tag,
} from 'antd';

import { UserOutlined, EditOutlined } from '@ant-design/icons';

import {
    getInvoiceByConditionService,
    initTableInvoiceOnceService,
    editInvoiceService,
} from '../../../services/invoiceService';

import AddInvoiceModal from './AddInvoiceModal';
import AddInvoiceOfMultipleOrderModal from '../OrderManage/OrderManageDetail/MultipleOrderTab/AddInvoiceOfMultipleOrderModal';

import { dateFormat, CommonUtils, INVOICE_STATUS } from '../../../utils';
import logo from '../../../assets/images/logo/logonew.png';
import { getOrderService } from '../../../services/orderService';
import { getAllCodeByKeyService } from '../../../services/allCodeService';
import { getAllPayerService } from '../../../services/payerService';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Text } = Typography;

const { Option } = Select;

class InvoiceManageDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: this.props.orderId,
            invoicesFromApi: [],
            invoices: [],
            // for add modal
            isOpenAddModal: false,

            // for pdf export
            layoutSelection: 'size-a4',

            // create invoice
            order: '',
            orderFromApi: '',
            payer_name_input: '',
            payment_code_input: '',

            // update status invoice
            status: '',
            invoice_id: '',
        };
        this.pdfExportComponent = React.createRef();
    }

    async componentDidMount() {
        try {
            await this.getOrder();
            let temp = await this.getInvoices();
            await this.initTable(temp);

            await this.initData();

            setTimeout(() => {
                let invoice = this.state.invoices;
                //do what you need here
                if (invoice && invoice.order_code) {
                }
                if (invoice && invoice[0]) {
                    let copyState = { ...this.state };
                    copyState.invoices = invoice[0];
                    this.setState({ ...copyState }, () => {});
                }
            }, 500);
        } catch (error) {
            console.log('error');
            this.setState({ isError: true });
        }
    }

    getOrder = async () => {
        let order = await getOrderService(this.state.orderId);
        order = order.order;
        let copyState = { ...this.state };
        copyState['order'] = order;

        await this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    initData = async () => {
        let order = this.state.order;

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

        let copyState = { ...this.state };

        copyState.payer_name_input = payer_name_input;
        copyState.payment_code_input = payment_code_input;

        await this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    handleExportWithComponent = (event) => {
        this.pdfExportComponent.current.save();
    };

    updatePageLayout = (value) => {
        this.setState({ layoutSelection: value });
    };

    showModal = () => {
        this.setState({ isOpenAddModal: true });
    };

    handleCancel = () => {
        try {
            // call event from child
            // emitter.emit('EVENT_CLEAR_ADD_LOG_TRIP_MODAL_DATA', {
            //     id: 'your id',
            // });
            this.setState({ isOpenAddModal: false });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    getInvoices = async () => {
        try {
            let invoicesFromApi = await getInvoiceByConditionService(
                '',
                '',
                this.state.order.order_code
            );

            let copyState = { ...this.state };
            copyState.invoicesFromApi = invoicesFromApi.invoice;
            this.setState({ ...copyState }, () => {});

            return invoicesFromApi.invoice;
        } catch (error) {
            console.log('Error:', error);
        }
    };

    initTable = async (temp) => {
        try {
            let invoices = await initTableInvoiceOnceService(temp);
            let status_input = invoices[0].status;
            let invoice_id_input = invoices[0].key;

            let copyState = { ...this.state };
            copyState.invoices = invoices;
            copyState.status = status_input;
            copyState.invoice_id = invoice_id_input;

            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeInvoiceStatus = (key) => {
        let copyState = { ...this.state };
        copyState.status = key;
        this.setState({ ...copyState }, () => {});
    };

    clickSaveInvoiceStatus = async () => {
        try {
            let result = await editInvoiceService(this.state);

            // error case
            if (result.errCode !== 0) {
                toast.error(result.errMessage);
            }
            // successful case
            else {
                toast.success('save invoice successful');
                // update invoice status
                this.refreshPage();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    refreshPage = () => {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    render() {
        let invoice = this.state.invoices;
        let orderFromApi = this.state.order;
        return (
            <>
                <div className="custom-container">
                    {!invoice || !invoice.order_code ? (
                        <>
                            {this.state.isOpenAddModal === true &&
                            this.props.isMultipleOrder === false ? (
                                <AddInvoiceModal
                                    isOpenAddModal={this.state.isOpenAddModal}
                                    handleCancel={this.handleCancel}
                                    initTableFromParent={
                                        this.initTableFromParent
                                    }
                                    order={this.state.order}
                                    payer_name_input={
                                        this.state.payer_name_input
                                    }
                                    payment_code_input={
                                        this.state.payment_code_input
                                    }
                                />
                            ) : (
                                ''
                            )}
                            {this.state.isOpenAddModal === true &&
                            this.props.isMultipleOrder === true ? (
                                <AddInvoiceOfMultipleOrderModal
                                    isOpenAddModal={this.state.isOpenAddModal}
                                    handleCancel={this.handleCancel}
                                    initTableFromParent={
                                        this.initTableFromParent
                                    }
                                    order={this.state.order}
                                    payer_name_input={
                                        this.state.payer_name_input
                                    }
                                    payment_code_input={
                                        this.state.payment_code_input
                                    }
                                />
                            ) : (
                                ''
                            )}
                            <h4>Ch??a c?? h??a ????n.</h4>
                            <div className="tab-container">
                                <Button onClick={this.showModal}>
                                    {' '}
                                    Th??m m???i{' '}
                                </Button>
                            </div>{' '}
                        </>
                    ) : (
                        <>
                            <Row gutter={[24, 24]}>
                                {/* Set status invoice */}
                                <Col span={24}>
                                    <Space size="small">
                                        {' '}
                                        <Select
                                            style={{
                                                width: '150px',
                                            }}
                                            value={this.state.status}
                                            onChange={(key) => {
                                                this.handleOnChangeInvoiceStatus(
                                                    key
                                                );
                                            }}
                                            id="handleOnChangeInvoiceStatus"
                                        >
                                            <Option value="paid" key="paid">
                                                ???? thanh to??n
                                            </Option>
                                            <Option value="unpaid" key="unpaid">
                                                Ch??a thanh to??n
                                            </Option>
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
                                                this.clickSaveInvoiceStatus();
                                            }}
                                            id="clickSave"
                                        >
                                            <span className="button_text">
                                                L??u
                                            </span>
                                        </Button>
                                    </Space>
                                </Col>
                                {/* Th??ng tin h??a ????n */}
                                <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                                    <Card>
                                        <Title level={4}>
                                            Th??ng tin h??a ????n c???a m?? v???n ????n{' '}
                                            <Text mark>
                                                {invoice &&
                                                    invoice.order_code &&
                                                    invoice.order_code
                                                        .order_code}
                                            </Text>
                                        </Title>
                                        <Row gutter={[12, 12]}>
                                            <Col span={24}>
                                                <Descriptions
                                                    title=""
                                                    contentStyle={{
                                                        fontWeight: 'bold',
                                                        position: 'absolute',
                                                        right: '0px',
                                                    }}
                                                >
                                                    <Descriptions.Item
                                                        label="N???i dung"
                                                        span={3}
                                                    >
                                                        {invoice &&
                                                            invoice.content}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item
                                                        label="Ng??y ????o h???n"
                                                        span={3}
                                                    >
                                                        {invoice &&
                                                        invoice.due_date != ''
                                                            ? moment(
                                                                  invoice.due_date
                                                              ).format(
                                                                  dateFormat.DATE_FORMAT
                                                              )
                                                            : '...'}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item
                                                        label="Ng??y t???o h??a ????n"
                                                        span={3}
                                                    >
                                                        {invoice &&
                                                        invoice.created != ''
                                                            ? moment(
                                                                  invoice.created
                                                              ).format(
                                                                  dateFormat.DATE_FORMAT
                                                              )
                                                            : '...'}
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                {/* Th??ng tin thanh to??n */}
                                <Col xs={24} sm={24} md={24} lg={10} xl={12}>
                                    <Card>
                                        <Title level={4}>
                                            Th??ng tin thanh to??n
                                        </Title>

                                        <Descriptions
                                            title=""
                                            contentStyle={{
                                                fontWeight: 'bold',
                                                position: 'absolute',
                                                right: '20px',
                                            }}
                                        >
                                            <Descriptions.Item
                                                label={<UserOutlined />}
                                                span={3}
                                            >
                                                {invoice &&
                                                    invoice.payer &&
                                                    invoice.payer.payer_name}
                                            </Descriptions.Item>
                                            <Descriptions.Item
                                                label="H??nh th???c thanh to??n"
                                                span={3}
                                            >
                                                {invoice &&
                                                    invoice.payer &&
                                                    invoice.payer.payment_code}
                                            </Descriptions.Item>
                                            <Descriptions.Item
                                                label="M?? tham chi???u"
                                                span={3}
                                            >
                                                {invoice &&
                                                invoice.payer &&
                                                invoice.payer
                                                    .payment_reference_code
                                                    ? invoice.payer
                                                          .payment_reference_code
                                                    : 'Kh??ng'}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Card>
                                </Col>
                                {/* Danh s??ch c?????c ph?? */}
                                <Col span={24}>
                                    <Card>
                                        <Row gutter={[12, 12]}>
                                            {/* Danh s??ch c?????c ph?? - thanh divider */}
                                            <Col span={24}>
                                                <List
                                                    size="small"
                                                    header={
                                                        <h2>
                                                            Danh s??ch c?????c ph??
                                                        </h2>
                                                    }
                                                    bordered={false}
                                                >
                                                    {orderFromApi &&
                                                        orderFromApi.main_fee && (
                                                            <List.Item>
                                                                C?????c v???n chuy???n:{' '}
                                                                {orderFromApi &&
                                                                orderFromApi.main_fee ? (
                                                                    CommonUtils.formattedValue(
                                                                        orderFromApi.main_fee
                                                                    )
                                                                ) : (
                                                                    <>0 VN??</>
                                                                )}
                                                            </List.Item>
                                                        )}

                                                    {orderFromApi &&
                                                        orderFromApi.cod && (
                                                            <List.Item>
                                                                Thu h???:{' '}
                                                                {orderFromApi &&
                                                                orderFromApi.cod ? (
                                                                    CommonUtils.formattedValue(
                                                                        orderFromApi.cod
                                                                    )
                                                                ) : (
                                                                    <>0 VN??</>
                                                                )}
                                                            </List.Item>
                                                        )}

                                                    {orderFromApi &&
                                                        orderFromApi.cod_fee && (
                                                            <List.Item>
                                                                Ph?? thu h???:{' '}
                                                                {orderFromApi &&
                                                                orderFromApi.cod_fee ? (
                                                                    CommonUtils.formattedValue(
                                                                        orderFromApi.cod_fee
                                                                    )
                                                                ) : (
                                                                    <>0 VN??</>
                                                                )}
                                                            </List.Item>
                                                        )}
                                                    {orderFromApi &&
                                                        orderFromApi.container_retal_fee && (
                                                            <List.Item>
                                                                Thu?? th??ng xe
                                                                cont:{' '}
                                                                {orderFromApi &&
                                                                orderFromApi.container_retal_fee ? (
                                                                    CommonUtils.formattedValue(
                                                                        orderFromApi.container_retal_fee
                                                                    )
                                                                ) : (
                                                                    <>0 VN??</>
                                                                )}
                                                            </List.Item>
                                                        )}
                                                    {orderFromApi &&
                                                        orderFromApi.insurance_fee && (
                                                            <List.Item>
                                                                B???o hi???m:{' '}
                                                                {orderFromApi &&
                                                                orderFromApi.insurance_fee ? (
                                                                    CommonUtils.formattedValue(
                                                                        orderFromApi.insurance_fee
                                                                    )
                                                                ) : (
                                                                    <>0 VN??</>
                                                                )}
                                                            </List.Item>
                                                        )}
                                                    {orderFromApi &&
                                                        orderFromApi.loading_uploading_fee && (
                                                            <List.Item>
                                                                Thu?? b???c, d???
                                                                h??ng:{' '}
                                                                {orderFromApi &&
                                                                orderFromApi.loading_uploading_fee ? (
                                                                    CommonUtils.formattedValue(
                                                                        orderFromApi.loading_uploading_fee
                                                                    )
                                                                ) : (
                                                                    <>0 VN??</>
                                                                )}
                                                            </List.Item>
                                                        )}
                                                </List>
                                                <Divider
                                                    style={{
                                                        border: '#C4C4C4 3px solid',
                                                        backgroundColor:
                                                            '#C4C4C4',
                                                    }}
                                                ></Divider>
                                            </Col>
                                            {/* T???ng c?????c */}
                                            <Col span={24}>
                                                <Title level={5}>
                                                    T???ng h??a ????n (ch??a c?? thu???):{' '}
                                                    {invoice &&
                                                    invoice.sub_total ? (
                                                        CommonUtils.formattedValue(
                                                            invoice.sub_total
                                                        )
                                                    ) : (
                                                        <>0 VN??</>
                                                    )}
                                                </Title>
                                                <Title level={5}>
                                                    Thu??? VAT 8%:{' '}
                                                    {invoice && invoice.tax ? (
                                                        CommonUtils.formattedValue(
                                                            invoice.tax
                                                        )
                                                    ) : (
                                                        <>0 VN??</>
                                                    )}
                                                </Title>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <Title level={2}>
                                                    T???ng h??a ????n:{' '}
                                                    {invoice &&
                                                    invoice.total ? (
                                                        CommonUtils.formattedValue(
                                                            invoice.total
                                                        )
                                                    ) : (
                                                        <>0 VN??</>
                                                    )}
                                                </Title>
                                            </Col>
                                            {/* Thanh to??n button */}
                                            <Col xs={24} sm={12}>
                                                <Space
                                                    className="button-right"
                                                    size="small"
                                                >
                                                    <Title level={4}>
                                                        Tr???ng th??i:{'   '}
                                                        {invoice &&
                                                        invoice.status &&
                                                        invoice.status ===
                                                            INVOICE_STATUS.PAID ? (
                                                            <Tag
                                                                color="blue"
                                                                style={{
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        '18px',
                                                                    padding:
                                                                        '5px 5px',
                                                                }}
                                                            >
                                                                ???? thanh to??n
                                                            </Tag>
                                                        ) : (
                                                            <>
                                                                <Tag
                                                                    color="red"
                                                                    style={{
                                                                        fontWeight:
                                                                            'bold',
                                                                        fontSize:
                                                                            '18px',
                                                                        padding:
                                                                            '5px 5px',
                                                                    }}
                                                                >
                                                                    Ch??a thanh
                                                                    to??n
                                                                </Tag>
                                                            </>
                                                        )}
                                                    </Title>
                                                </Space>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>

                            {/* in h??a ????n */}
                            <div id="example">
                                {/* ch???c n??ng in */}
                                <div className="box wide hidden-on-narrow">
                                    <div className="box-col">
                                        <h4>Select a Page Size</h4>
                                        <Select
                                            value={this.state.layoutSelection}
                                            onChange={this.updatePageLayout}
                                            style={{ width: '150px' }}
                                        >
                                            <Option value="size-a4">A4</Option>
                                            <Option value="size-letter">
                                                Letter
                                            </Option>
                                            <Option value="size-executive">
                                                Executive
                                            </Option>
                                        </Select>
                                    </div>
                                    <div className="box-col">
                                        <h4>Export PDF</h4>
                                        <Button
                                            primary="true"
                                            onClick={
                                                this.handleExportWithComponent
                                            }
                                        >
                                            Export
                                        </Button>
                                    </div>
                                </div>
                                {/* Form */}
                                <div className="page-container hidden-on-narrow">
                                    <PDFExport ref={this.pdfExportComponent}>
                                        <div
                                            className={`pdf-page ${this.state.layoutSelection}`}
                                        >
                                            <div className="inner-page">
                                                <div className="pdf-header">
                                                    <span className="company-logo">
                                                        <img
                                                            src={logo}
                                                            alt="Kendoka Company Logo"
                                                            width="200px"
                                                        />{' '}
                                                        H??a ????n c?????c v???n chuy???n
                                                        h??ng h??a
                                                    </span>
                                                    <span className="invoice-number">
                                                        Invoice #
                                                        {invoice &&
                                                            invoice.order_code &&
                                                            invoice.order_code
                                                                .order_code}
                                                    </span>
                                                </div>
                                                <div className="pdf-footer">
                                                    <p>&copy; PN Logistic</p>
                                                </div>
                                                <div className="addresses">
                                                    <div className="for">
                                                        <h5>
                                                            K??nh g???i kh??ch h??ng:
                                                        </h5>
                                                        <p>
                                                            C??ng ty{' '}
                                                            {invoice &&
                                                                invoice.own_user &&
                                                                invoice.own_user
                                                                    .companyName}
                                                            <br />
                                                            ?????a ch???:{' '}
                                                            {invoice &&
                                                                invoice.own_user &&
                                                                invoice.own_user
                                                                    .own_user_address}
                                                            <br />
                                                            M?? s??? thu???:{' '}
                                                            {invoice &&
                                                                invoice.own_user &&
                                                                invoice.own_user
                                                                    .id_or_tax}
                                                        </p>
                                                    </div>

                                                    <div className="from">
                                                        <h5>
                                                            ????n v??? v???n chuy???n PN
                                                            Logistic
                                                        </h5>
                                                        <p>
                                                            VPGD: 268 L?? Th?????ng
                                                            Ki???t, Ph?????ng 14,
                                                            <br />
                                                            Qu???n 10, Th??nh ph???
                                                            H??? Ch?? Minh <br />
                                                            Email:
                                                            lephongplus2016@gmail.com
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="pdf-body">
                                                    <div id="grid">
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th colSpan="2">
                                                                        N???i dung
                                                                    </th>

                                                                    <th className="per15 text-center">
                                                                        Ghi ch??
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {/* n???i dung */}
                                                                {/* main fee */}
                                                                <tr>
                                                                    <td colSpan="2">
                                                                        {invoice &&
                                                                            invoice.content}
                                                                    </td>

                                                                    <td className="text-center"></td>
                                                                </tr>

                                                                {/* t???ng  */}
                                                                <tr>
                                                                    <th
                                                                        colSpan="2"
                                                                        className="text-right"
                                                                    >
                                                                        T???ng
                                                                        (ch??a c??
                                                                        VAT):
                                                                    </th>
                                                                    <th className="text-center">
                                                                        {invoice &&
                                                                        invoice.sub_total ? (
                                                                            CommonUtils.formattedValue(
                                                                                invoice.sub_total
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                0
                                                                                VN??
                                                                            </>
                                                                        )}
                                                                    </th>
                                                                </tr>
                                                                <tr>
                                                                    <th
                                                                        colSpan="2"
                                                                        className="text-right"
                                                                    >
                                                                        8% VAT:
                                                                    </th>
                                                                    <th className="text-center">
                                                                        {invoice &&
                                                                        invoice.tax ? (
                                                                            CommonUtils.formattedValue(
                                                                                invoice.tax
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                0
                                                                                VN??
                                                                            </>
                                                                        )}
                                                                    </th>
                                                                </tr>
                                                                <tr>
                                                                    <th
                                                                        colSpan="2"
                                                                        className="text-right"
                                                                    >
                                                                        T???ng:
                                                                    </th>
                                                                    <th className="text-center">
                                                                        {invoice &&
                                                                        invoice.total ? (
                                                                            CommonUtils.formattedValue(
                                                                                invoice.total
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                0
                                                                                VN??
                                                                            </>
                                                                        )}
                                                                    </th>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <p className="signature">
                                                        Ng??y xu???t h??a ????n:{' '}
                                                        {invoice &&
                                                        invoice.created != ''
                                                            ? moment(
                                                                  invoice.created
                                                              ).format(
                                                                  dateFormat.DATE_FORMAT
                                                              )
                                                            : '...'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </PDFExport>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InvoiceManageDetail);

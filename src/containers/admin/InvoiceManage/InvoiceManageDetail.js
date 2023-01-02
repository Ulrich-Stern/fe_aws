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
                            <h4>Chưa có hóa đơn.</h4>
                            <div className="tab-container">
                                <Button onClick={this.showModal}>
                                    {' '}
                                    Thêm mới{' '}
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
                                                Đã thanh toán
                                            </Option>
                                            <Option value="unpaid" key="unpaid">
                                                Chưa thanh toán
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
                                                Lưu
                                            </span>
                                        </Button>
                                    </Space>
                                </Col>
                                {/* Thông tin hóa đơn */}
                                <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                                    <Card>
                                        <Title level={4}>
                                            Thông tin hóa đơn của mã vận đơn{' '}
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
                                                        label="Nội dung"
                                                        span={3}
                                                    >
                                                        {invoice &&
                                                            invoice.content}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item
                                                        label="Ngày đáo hạn"
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
                                                        label="Ngày tạo hóa đơn"
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
                                {/* Thông tin thanh toán */}
                                <Col xs={24} sm={24} md={24} lg={10} xl={12}>
                                    <Card>
                                        <Title level={4}>
                                            Thông tin thanh toán
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
                                                label="Hình thức thanh toán"
                                                span={3}
                                            >
                                                {invoice &&
                                                    invoice.payer &&
                                                    invoice.payer.payment_code}
                                            </Descriptions.Item>
                                            <Descriptions.Item
                                                label="Mã tham chiếu"
                                                span={3}
                                            >
                                                {invoice &&
                                                invoice.payer &&
                                                invoice.payer
                                                    .payment_reference_code
                                                    ? invoice.payer
                                                          .payment_reference_code
                                                    : 'Không'}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Card>
                                </Col>
                                {/* Danh sách cước phí */}
                                <Col span={24}>
                                    <Card>
                                        <Row gutter={[12, 12]}>
                                            {/* Danh sách cước phí - thanh divider */}
                                            <Col span={24}>
                                                <List
                                                    size="small"
                                                    header={
                                                        <h2>
                                                            Danh sách cước phí
                                                        </h2>
                                                    }
                                                    bordered={false}
                                                >
                                                    {orderFromApi &&
                                                        orderFromApi.main_fee && (
                                                            <List.Item>
                                                                Cước vận chuyển:{' '}
                                                                {orderFromApi &&
                                                                orderFromApi.main_fee ? (
                                                                    CommonUtils.formattedValue(
                                                                        orderFromApi.main_fee
                                                                    )
                                                                ) : (
                                                                    <>0 VNĐ</>
                                                                )}
                                                            </List.Item>
                                                        )}

                                                    {orderFromApi &&
                                                        orderFromApi.cod && (
                                                            <List.Item>
                                                                Thu hộ:{' '}
                                                                {orderFromApi &&
                                                                orderFromApi.cod ? (
                                                                    CommonUtils.formattedValue(
                                                                        orderFromApi.cod
                                                                    )
                                                                ) : (
                                                                    <>0 VNĐ</>
                                                                )}
                                                            </List.Item>
                                                        )}

                                                    {orderFromApi &&
                                                        orderFromApi.cod_fee && (
                                                            <List.Item>
                                                                Phí thu hộ:{' '}
                                                                {orderFromApi &&
                                                                orderFromApi.cod_fee ? (
                                                                    CommonUtils.formattedValue(
                                                                        orderFromApi.cod_fee
                                                                    )
                                                                ) : (
                                                                    <>0 VNĐ</>
                                                                )}
                                                            </List.Item>
                                                        )}
                                                    {orderFromApi &&
                                                        orderFromApi.container_retal_fee && (
                                                            <List.Item>
                                                                Thuê thùng xe
                                                                cont:{' '}
                                                                {orderFromApi &&
                                                                orderFromApi.container_retal_fee ? (
                                                                    CommonUtils.formattedValue(
                                                                        orderFromApi.container_retal_fee
                                                                    )
                                                                ) : (
                                                                    <>0 VNĐ</>
                                                                )}
                                                            </List.Item>
                                                        )}
                                                    {orderFromApi &&
                                                        orderFromApi.insurance_fee && (
                                                            <List.Item>
                                                                Bảo hiểm:{' '}
                                                                {orderFromApi &&
                                                                orderFromApi.insurance_fee ? (
                                                                    CommonUtils.formattedValue(
                                                                        orderFromApi.insurance_fee
                                                                    )
                                                                ) : (
                                                                    <>0 VNĐ</>
                                                                )}
                                                            </List.Item>
                                                        )}
                                                    {orderFromApi &&
                                                        orderFromApi.loading_uploading_fee && (
                                                            <List.Item>
                                                                Thuê bốc, dỡ
                                                                hàng:{' '}
                                                                {orderFromApi &&
                                                                orderFromApi.loading_uploading_fee ? (
                                                                    CommonUtils.formattedValue(
                                                                        orderFromApi.loading_uploading_fee
                                                                    )
                                                                ) : (
                                                                    <>0 VNĐ</>
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
                                            {/* Tổng cước */}
                                            <Col span={24}>
                                                <Title level={5}>
                                                    Tổng hóa đơn (chưa có thuế):{' '}
                                                    {invoice &&
                                                    invoice.sub_total ? (
                                                        CommonUtils.formattedValue(
                                                            invoice.sub_total
                                                        )
                                                    ) : (
                                                        <>0 VNĐ</>
                                                    )}
                                                </Title>
                                                <Title level={5}>
                                                    Thuế VAT 8%:{' '}
                                                    {invoice && invoice.tax ? (
                                                        CommonUtils.formattedValue(
                                                            invoice.tax
                                                        )
                                                    ) : (
                                                        <>0 VNĐ</>
                                                    )}
                                                </Title>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <Title level={2}>
                                                    Tổng hóa đơn:{' '}
                                                    {invoice &&
                                                    invoice.total ? (
                                                        CommonUtils.formattedValue(
                                                            invoice.total
                                                        )
                                                    ) : (
                                                        <>0 VNĐ</>
                                                    )}
                                                </Title>
                                            </Col>
                                            {/* Thanh toán button */}
                                            <Col xs={24} sm={12}>
                                                <Space
                                                    className="button-right"
                                                    size="small"
                                                >
                                                    <Title level={4}>
                                                        Trạng thái:{'   '}
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
                                                                Đã thanh toán
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
                                                                    Chưa thanh
                                                                    toán
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

                            {/* in hóa đơn */}
                            <div id="example">
                                {/* chức năng in */}
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
                                                        Hóa đơn cước vận chuyển
                                                        hàng hóa
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
                                                            Kính gửi khách hàng:
                                                        </h5>
                                                        <p>
                                                            Công ty{' '}
                                                            {invoice &&
                                                                invoice.own_user &&
                                                                invoice.own_user
                                                                    .companyName}
                                                            <br />
                                                            Địa chỉ:{' '}
                                                            {invoice &&
                                                                invoice.own_user &&
                                                                invoice.own_user
                                                                    .own_user_address}
                                                            <br />
                                                            Mã số thuế:{' '}
                                                            {invoice &&
                                                                invoice.own_user &&
                                                                invoice.own_user
                                                                    .id_or_tax}
                                                        </p>
                                                    </div>

                                                    <div className="from">
                                                        <h5>
                                                            Đơn vị vận chuyển PN
                                                            Logistic
                                                        </h5>
                                                        <p>
                                                            VPGD: 268 Lý Thường
                                                            Kiệt, Phường 14,
                                                            <br />
                                                            Quận 10, Thành phố
                                                            Hồ Chí Minh <br />
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
                                                                        Nội dung
                                                                    </th>

                                                                    <th className="per15 text-center">
                                                                        Ghi chú
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {/* nội dung */}
                                                                {/* main fee */}
                                                                <tr>
                                                                    <td colSpan="2">
                                                                        {invoice &&
                                                                            invoice.content}
                                                                    </td>

                                                                    <td className="text-center"></td>
                                                                </tr>

                                                                {/* tổng  */}
                                                                <tr>
                                                                    <th
                                                                        colSpan="2"
                                                                        className="text-right"
                                                                    >
                                                                        Tổng
                                                                        (chưa có
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
                                                                                VNĐ
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
                                                                                VNĐ
                                                                            </>
                                                                        )}
                                                                    </th>
                                                                </tr>
                                                                <tr>
                                                                    <th
                                                                        colSpan="2"
                                                                        className="text-right"
                                                                    >
                                                                        Tổng:
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
                                                                                VNĐ
                                                                            </>
                                                                        )}
                                                                    </th>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <p className="signature">
                                                        Ngày xuất hóa đơn:{' '}
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

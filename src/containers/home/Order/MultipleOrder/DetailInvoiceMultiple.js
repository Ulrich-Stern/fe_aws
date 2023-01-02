import React from 'react';
import { connect } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import 'hammerjs';
import moment from 'moment';

import { PDFExport, savePDF } from '@progress/kendo-react-pdf';
import '@progress/kendo-theme-material/dist/all.css';

import {
    Row,
    Col,
    Space,
    Select,
    Typography,
    Tag,
    Button,
    Card,
    Descriptions,
    Divider,
    List,
} from 'antd';

import { FormattedMessage } from 'react-intl';
import { UserOutlined } from '@ant-design/icons';

import '../LayoutSample.css';
import '../ExportExample.css';

import {
    getInvoiceByConditionService,
    initTableInvoiceOnceService,
} from '../../../../services/invoiceService';

import {
    getOrderService,
    searchOrderByOrderCodeService,
} from '../../../../services/orderService';

import { getPriceService } from '../../../../services/priceService';

import { createPaymentUrlService } from '../../../../services/vnpayService';

import { getAddressBookService } from '../../../../services/addressBookService';

import { dateFormat, CommonUtils, INVOICE_STATUS } from '../../../../utils';

import logo from '../../../../assets/images/logo/logonew.png';

const { Title } = Typography;
const { Text } = Typography;

const { Option } = Select;

const handleStringFormatAddress = (district, city) => {
    return `${district}, ${city}`;
};

function DetailInvoiceMultiple(props) {
    // begin pdf export ========================================

    const pdfExportComponent = useRef(null);
    const [layoutSelection, setLayoutSelection] = useState(
        // text: 'A4',
        // value: 'size-a4',
        'size-a4'
    );

    const ddData = [
        { text: 'A4', value: 'size-a4' },
        { text: 'Letter', value: 'size-letter' },
        { text: 'Executive', value: 'size-executive' },
    ];

    const handleExportWithComponent = (event) => {
        pdfExportComponent.current.save();
    };

    const updatePageLayout = (value) => {
        setLayoutSelection(value);
    };
    // end pdf export ========================================

    const [orderId, setOrderId] = useState(props.orderId);

    const [invoicesFromApi, setInvoicesFromApi] = useState();

    const [invoice, setInvoice] = useState();

    const [orderFromApi, setOrderFromApi] = useState();

    // phục vụ hiển thị cách tính tiền hóa đơn: unitPrice, distance, numberOfVehicle, transportFee
    const [unitPrice, setUnitPrice] = useState();

    // multiple order invoice
    const [orderList, setOrderList] = useState();

    const [sender, setSender] = useState();

    const [transportFeeList, setTransportFeeList] = useState([]);

    const [displayFeeList, setDisplayFeeList] = useState(true);

    // componentDidMount
    useEffect(async () => {
        // Your code here
        let order_code = await getOrder();

        let temp = await getInvoices(order_code);

        await initTable(temp);
    }, []);

    const getPrice = async (distance) => {
        // get price of this vehicle tonange
        let unitPrice = await getPriceService('all', orderFromApi.tonage_code);
        unitPrice = unitPrice.price;
        unitPrice = unitPrice[0];

        // calculate the unit price follow by distance
        let cur_price = 0;
        if (+distance < 4) {
            cur_price = unitPrice.price_4;
        } else if (+distance < 15) {
            cur_price = unitPrice.price_5_15;
        } else if (+distance < 100) {
            cur_price = unitPrice.price_16_100;
        } else {
            cur_price = unitPrice.price_more;
        }

        //set value unit price
        setUnitPrice(cur_price.toString());
        return cur_price.toString();
    };

    const getInvoices = async (order_code_input) => {
        try {
            let invoicesFromApi = await getInvoiceByConditionService(
                '',
                '',
                order_code_input
            );

            await setInvoicesFromApi(invoicesFromApi.invoice);

            return invoicesFromApi.invoice;
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const getOrder = async () => {
        try {
            // get order record
            let order = await getOrderService(props.orderId);
            order = order.order;

            let orderList = await searchOrderByOrderCodeService(
                order.order_code
            );
            orderList = orderList.order;

            setOrderList(orderList);
            console.log('orderList: ', orderList);

            // set value order
            setOrderFromApi(order);

            return order.order_code;
        } catch (error) {
            console.log('Error:', error);
        }
    };

    // danh sách cước từ nơi gửi đến lần lượt các nơi nhận
    const getTransportFeeList = async () => {
        try {
            if (orderList.length > 0) {
                let tempList = [];
                await orderList.forEach(async (i) => {
                    let unitPrice = await getPrice(i.distance);
                    // 4km đầu tiên có chung giá

                    if (+i.distance <= 4.0) {
                        var temp = +unitPrice * +i.number_of_vehicle;
                    }
                    // tính nhân với số km
                    else {
                        temp = +i.distance * +unitPrice * +i.number_of_vehicle;
                    }
                    await tempList.push({
                        distance: i.distance,
                        unitPrice: unitPrice,
                        numberOfVehicle: i.number_of_vehicle,
                        transportFee: temp.toString(),
                        receiver: `${i.receiver_addr_district.name}, ${i.receiver_addr_city.name} `,
                    });
                });
                console.log('tempList:', tempList);

                await setTransportFeeList(tempList);
                console.log('transportFeeList:', transportFeeList);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const initTable = async (temp) => {
        try {
            let invoices = await initTableInvoiceOnceService(temp);

            await setInvoice(invoices);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const getSender = async () => {
        try {
            // sender
            let sender = await getAddressBookService(orderFromApi.sender_id);
            sender = sender.ab;

            let sender_address = handleStringFormatAddress(
                sender.addr_district.name,
                sender.addr_city.name
            );

            await setSender(sender_address);
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    setTimeout(async () => {
        //do what you need here
        if (invoice && invoice[0]) {
            setInvoice(invoice[0]);
            console.log('invoice last:', invoice);
        }
        // unitPrice chưa có thì mới set
        if (orderFromApi && orderFromApi.distance && !unitPrice) {
            await getPrice(orderFromApi.distance);

            await getSender();
        }

        // hiển thị chi tiết tính cước
        if (
            transportFeeList &&
            transportFeeList.length === 0 &&
            orderFromApi &&
            orderFromApi.distance
        ) {
            await getTransportFeeList();
        }
    }, 1000);

    // rerender lại để lấy dom state mới nhất, cập nhật transportFeeList
    setTimeout(async () => {
        try {
            setDisplayFeeList(false);

            setDisplayFeeList(true);
        } catch (error) {
            console.log('Error: ', error);
        }
    }, 2000);

    // api payment
    const callVNPayCreatePayment = async () => {
        try {
            let vnpUrl = await createPaymentUrlService(invoice);
            window.open(vnpUrl.vnpUrl, '_blank').focus();
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <>
            {!invoice || !invoice.order_code ? (
                <FormattedMessage id="order.none" />
            ) : (
                <>
                    {' '}
                    <Row gutter={[24, 24]}>
                        {/* Thông tin hóa đơn */}
                        <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                            <Card>
                                <Title level={4}>
                                    {<FormattedMessage id="order.#order" />}{' '}
                                    <Text mark>
                                        {invoice &&
                                            invoice.order_code &&
                                            invoice.order_code.order_code}
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
                                                label={
                                                    <FormattedMessage id="order.content" />
                                                }
                                                span={3}
                                            >
                                                {invoice && invoice.content}
                                            </Descriptions.Item>
                                            <Descriptions.Item
                                                label={
                                                    <FormattedMessage id="order.due_date" />
                                                }
                                                span={3}
                                            >
                                                {invoice &&
                                                invoice.due_date !== ''
                                                    ? moment(
                                                          invoice.due_date
                                                      ).format(
                                                          dateFormat.DATE_FORMAT
                                                      )
                                                    : '...'}
                                            </Descriptions.Item>
                                            <Descriptions.Item
                                                label={
                                                    <FormattedMessage id="order.created_date" />
                                                }
                                                span={3}
                                            >
                                                {invoice &&
                                                invoice.created !== ''
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
                                    {
                                        <FormattedMessage id="order.payment_info" />
                                    }
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
                                        label={
                                            <FormattedMessage id="order.payment_method" />
                                        }
                                        span={3}
                                    >
                                        {invoice &&
                                            invoice.payer &&
                                            invoice.payer.payment_code}
                                    </Descriptions.Item>
                                    <Descriptions.Item
                                        label={
                                            <FormattedMessage id="order.reference_code" />
                                        }
                                        span={3}
                                    >
                                        {invoice &&
                                        invoice.payer &&
                                        invoice.payer.payment_reference_code
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
                                                <h3>
                                                    {
                                                        <FormattedMessage id="order.list_price" />
                                                    }
                                                </h3>
                                            }
                                            bordered={false}
                                        >
                                            {/* transport fee */}
                                            {transportFeeList &&
                                                transportFeeList.length > 0 &&
                                                displayFeeList &&
                                                transportFeeList.map(
                                                    (i, key) => (
                                                        <>
                                                            <List.Item
                                                                key={key}
                                                            >
                                                                Cước vận chuyển{' '}
                                                                <i>{sender}</i>{' '}
                                                                đi{' '}
                                                                <i>
                                                                    {i.receiver}
                                                                </i>{' '}
                                                                = Quãng đường (
                                                                <b>
                                                                    {i.distance}{' '}
                                                                    Km
                                                                </b>
                                                                ){' '}
                                                                {/* trường hợp 4 Km đầu và còn lại */}
                                                                {+i.distance < 4
                                                                    ? ' -> Giá 4 Km đầu '
                                                                    : ' x Đơn giá '}{' '}
                                                                (
                                                                <b>
                                                                    {unitPrice ? (
                                                                        CommonUtils.formattedValue(
                                                                            unitPrice
                                                                        )
                                                                    ) : (
                                                                        <>
                                                                            0
                                                                            VNĐ
                                                                        </>
                                                                    )}{' '}
                                                                    /Km
                                                                </b>
                                                                ) x Số xe (
                                                                <b>
                                                                    {
                                                                        i.numberOfVehicle
                                                                    }
                                                                </b>
                                                                ) ={' '}
                                                                <b>
                                                                    {i.transportFee ? (
                                                                        CommonUtils.formattedValue(
                                                                            i.transportFee
                                                                        )
                                                                    ) : (
                                                                        <>
                                                                            0
                                                                            VNĐ
                                                                        </>
                                                                    )}{' '}
                                                                </b>
                                                            </List.Item>
                                                        </>
                                                    )
                                                )}

                                            {orderFromApi &&
                                                orderFromApi.main_fee && (
                                                    <List.Item>
                                                        {
                                                            <FormattedMessage id="dashboard.ship_fee" />
                                                        }
                                                        :{' '}
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
                                                        {
                                                            <FormattedMessage id="order.cod" />
                                                        }
                                                        :{' '}
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
                                                        {
                                                            <FormattedMessage id="order.cod_fee" />
                                                        }
                                                        :{' '}
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
                                                        {
                                                            <FormattedMessage id="order.only_tow_head" />
                                                        }
                                                        :{' '}
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
                                                        {
                                                            <FormattedMessage id="order.insurance" />
                                                        }
                                                        :{' '}
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
                                                        {
                                                            <FormattedMessage id="order.hire_loading" />
                                                        }
                                                        :{' '}
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
                                                backgroundColor: '#C4C4C4',
                                            }}
                                        ></Divider>
                                    </Col>
                                    {/* Tổng cước */}
                                    <Col span={24}>
                                        <Title level={5}>
                                            {
                                                <FormattedMessage id="order.price_not_vat" />
                                            }
                                            :{' '}
                                            {invoice && invoice.sub_total ? (
                                                CommonUtils.formattedValue(
                                                    invoice.sub_total
                                                )
                                            ) : (
                                                <>0 VNĐ</>
                                            )}
                                        </Title>
                                        <Title level={5}>
                                            {
                                                <FormattedMessage id="order.vat" />
                                            }
                                            :{' '}
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
                                        <Title level={3}>
                                            {
                                                <FormattedMessage id="order.sum_invoice" />
                                            }
                                            :{' '}
                                            {invoice && invoice.total ? (
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
                                                {
                                                    <FormattedMessage id="order.order_status" />
                                                }
                                                :{'   '}
                                                {invoice &&
                                                invoice.status &&
                                                invoice.status ===
                                                    INVOICE_STATUS.PAID ? (
                                                    <Tag
                                                        color="blue"
                                                        style={{
                                                            fontWeight: 'bold',
                                                            fontSize: '18px',
                                                            padding: '5px 5px',
                                                        }}
                                                    >
                                                        {
                                                            <FormattedMessage id="order.paid" />
                                                        }
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
                                                            {
                                                                <FormattedMessage id="order.unpaid" />
                                                            }
                                                        </Tag>
                                                        <Button
                                                            type="primary"
                                                            className="btn-pay"
                                                            onClick={
                                                                callVNPayCreatePayment
                                                            }
                                                        >
                                                            {
                                                                <FormattedMessage id="order.pay" />
                                                            }
                                                        </Button>
                                                    </>
                                                )}
                                            </Title>
                                        </Space>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    {/*  begin pdf export ======================================== */}
                    {/* in hóa đơn */}
                    <div id="example">
                        {/* chức năng in */}
                        <div className="box wide hidden-on-narrow">
                            <div className="box-col">
                                <h4>
                                    {
                                        <FormattedMessage id="order.select_page_size" />
                                    }
                                </h4>
                                <Select
                                    value={layoutSelection}
                                    onChange={updatePageLayout}
                                    style={{ width: '150px' }}
                                >
                                    <Option value="size-a4">A4</Option>
                                    <Option value="size-letter">Letter</Option>
                                    <Option value="size-executive">
                                        Executive
                                    </Option>
                                </Select>
                            </div>
                            <div className="box-col">
                                <h4>Export PDF</h4>
                                <Button
                                    primary="true"
                                    onClick={handleExportWithComponent}
                                >
                                    Export
                                </Button>
                            </div>
                        </div>
                        {/* Form */}
                        <div className="page-container hidden-on-narrow">
                            <PDFExport ref={pdfExportComponent}>
                                <div className={`pdf-page ${layoutSelection}`}>
                                    <div className="inner-page">
                                        <div className="pdf-header">
                                            <span className="company-logo">
                                                <img
                                                    src={logo}
                                                    alt="Kendoka Company Logo"
                                                    width="200px"
                                                />{' '}
                                                Hóa đơn cước vận chuyển hàng hóa
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
                                                <h5>Kính gửi khách hàng:</h5>
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
                                                    VPGD: 268 Lý Thường Kiệt,
                                                    Phường 14,
                                                    <br />
                                                    Quận 10, Thành phố Hồ Chí
                                                    Minh <br />
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
                                                                Tổng (chưa có
                                                                VAT):
                                                            </th>
                                                            <th className="text-center">
                                                                {invoice &&
                                                                invoice.sub_total ? (
                                                                    CommonUtils.formattedValue(
                                                                        invoice.sub_total
                                                                    )
                                                                ) : (
                                                                    <>0 VNĐ</>
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
                                                                    <>0 VNĐ</>
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
                                                                    <>0 VNĐ</>
                                                                )}
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <p className="signature">
                                                Ngày xuất hóa đơn:{' '}
                                                {invoice &&
                                                invoice.created !== ''
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
                    {/*  end pdf export ======================================== */}
                </>
            )}
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DetailInvoiceMultiple);

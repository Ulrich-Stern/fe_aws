import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { Table, Tag } from 'antd';
import {
    PhoneOutlined,
    HomeOutlined,
    UserOutlined,
    DollarCircleOutlined,
    CodeSandboxOutlined,
    SlidersOutlined,
    ColumnWidthOutlined,
    FieldTimeOutlined,
    BankOutlined,
    CarOutlined,
    CarryOutOutlined,
    ShoppingCartOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';

import {
    dateFormat,
    CommonUtils,
    ORDER_STATUS,
    INVOICE_STATUS,
} from '../../../utils';

import { FormattedMessage } from 'react-intl';
import { path } from '../../../utils/constant';

const { Column } = Table;

class OrdersData extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        // vấn đề là Orders Data render xong trước cái thằng Cha Orders -> nó ko cập nhật props
        let orderList = this.props.orderList;

        return (
            <>
                <Table
                    dataSource={orderList}
                    scroll={{
                        x: 'calc(700px + 50%)',
                        y: 340,
                    }}
                    size="middle"
                >
                    <Column
                        title={<FormattedMessage id="order.#order" />}
                        key="order_code"
                        dataIndex="order_code"
                        width="100px"
                        render={(data) => (
                            <Link
                                to={
                                    path.DETAIL_ORDER +
                                    '?orderId=' +
                                    data.key +
                                    '&tabId=1'
                                }
                                id={data.key}
                            >
                                {data.order_code}{' '}
                                {data.isMultipleOrder == true && (
                                    <Tag color="#87d068" id={'tag_' + data.key}>
                                        {
                                            <FormattedMessage id="order.multi_unload" />
                                        }
                                    </Tag>
                                )}
                            </Link>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="order.order_status" />}
                        key="status"
                        dataIndex="status"
                        render={(status) => (
                            <>
                                <Tag
                                    color={
                                        status.status ===
                                            ORDER_STATUS.ORDER_STATUS_1 ||
                                        status.status ===
                                            ORDER_STATUS.ORDER_STATUS_9
                                            ? 'red'
                                            : 'blue'
                                    }
                                    key={status.status}
                                >
                                    {status.status_name_input}
                                </Tag>

                                {status.invoice === INVOICE_STATUS.PAID ? (
                                    <div>
                                        <br></br>
                                        <Tag
                                            icon={<CheckCircleOutlined />}
                                            color="success"
                                        >
                                            {
                                                <FormattedMessage id="order.paid" />
                                            }
                                        </Tag>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </>
                        )}
                        width="150px"
                    />
                    <Column
                        title={<FormattedMessage id="order.consignor" />}
                        key="sender"
                        dataIndex="sender"
                        width="200px"
                        rowSpan="3"
                        className="moreInfo-listOrder"
                        render={(data) => (
                            <>
                                <div>
                                    <UserOutlined /> {data.contact_name}
                                </div>
                                <div>
                                    <PhoneOutlined /> {data.phone}
                                </div>
                                <div>
                                    <HomeOutlined /> {data.address}
                                </div>
                            </>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="order.consignee" />}
                        key="receiver"
                        dataIndex="receiver"
                        width="250px"
                        className="moreInfo-listOrder"
                        render={(data) => (
                            <>
                                <div>
                                    <UserOutlined /> {data.contact_name}
                                </div>
                                <div>
                                    <PhoneOutlined /> {data.phone}
                                </div>
                                <div>
                                    <HomeOutlined /> {data.address}
                                </div>
                            </>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="order.vehicle_info" />}
                        key="vehicle"
                        dataIndex="vehicle"
                        width="200px"
                        render={(data) => (
                            <>
                                <div>
                                    <CarOutlined />{' '}
                                    {
                                        <FormattedMessage id="order.vehicle_type" />
                                    }
                                    : {data.vehicle_name}
                                </div>
                                <div>
                                    <ShoppingCartOutlined />{' '}
                                    {
                                        <FormattedMessage id="order.weight_type" />
                                    }
                                    : {data.tonage_name}
                                </div>
                                <div>
                                    <CarryOutOutlined />{' '}
                                    {<FormattedMessage id="order.#vehicle" />}:{' '}
                                    {data.number_of_vehicle}
                                </div>
                            </>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="order.order_info" />}
                        key="goods"
                        dataIndex="goods"
                        width="200px"
                        render={(data) => (
                            <>
                                <div>
                                    <CodeSandboxOutlined />{' '}
                                    {<FormattedMessage id="order.package" />}:{' '}
                                    {data.number_package}
                                </div>
                                <div>
                                    <SlidersOutlined />{' '}
                                    {
                                        <FormattedMessage id="order.total_weight" />
                                    }
                                    : {data.weight}
                                </div>
                                <div>
                                    <ColumnWidthOutlined />{' '}
                                    {<FormattedMessage id="order.size" />}:{' '}
                                    {data.size}
                                </div>
                            </>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="order.service" />}
                        key="service"
                        dataIndex="service"
                        width="250px"
                        render={(data) => (
                            <>
                                {data.is_frozen_storage == true && (
                                    <div>
                                        <FormattedMessage id="order.freight" />
                                    </div>
                                )}
                                {data.is_danger == true && (
                                    <div>
                                        <FormattedMessage id="order.dangerous_goods" />
                                    </div>
                                )}
                                {data.do_buy_insurance == true && (
                                    <div>
                                        <FormattedMessage id="order.buy_insurance" />
                                    </div>
                                )}
                                {data.hire_loading_uploading == true && (
                                    <div>
                                        <FormattedMessage id="order.hire_loading" />
                                    </div>
                                )}
                                {data.no_empty_container == true && (
                                    <div>
                                        <FormattedMessage id="order.only_tow_head" />
                                    </div>
                                )}
                                {data.is_frozen_storage == false &&
                                    data.is_danger == false &&
                                    data.do_buy_insurance == false &&
                                    data.hire_loading_uploading == false &&
                                    data.no_empty_container == false && (
                                        <div>
                                            <FormattedMessage id="order.no" />
                                        </div>
                                    )}
                            </>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="order.fee" />}
                        key="fee"
                        dataIndex="fee"
                        width="220px"
                        render={(data) => (
                            <>
                                <div>
                                    <DollarCircleOutlined />{' '}
                                    <FormattedMessage id="order.cod" />:
                                    {data.cod ? (
                                        CommonUtils.formattedValue(data.cod)
                                    ) : (
                                        <div>0 VNĐ</div>
                                    )}
                                </div>
                                <div>
                                    <DollarCircleOutlined />{' '}
                                    <FormattedMessage id="order.cod_fee" />:
                                    {data.cod_fee ? (
                                        CommonUtils.formattedValue(data.cod_fee)
                                    ) : (
                                        <div>0 VNĐ</div>
                                    )}
                                </div>
                                {data.insurance_fee && (
                                    <div>
                                        <DollarCircleOutlined />{' '}
                                        {
                                            <FormattedMessage id="order.insurance_fee" />
                                        }
                                        :{' '}
                                        {data.insurance_fee ? (
                                            CommonUtils.formattedValue(
                                                data.insurance_fee
                                            )
                                        ) : (
                                            <div>0 VNĐ</div>
                                        )}
                                    </div>
                                )}

                                {data.loading_uploading_fee && (
                                    <div>
                                        <DollarCircleOutlined />{' '}
                                        {
                                            <FormattedMessage id="order.handling_fee" />
                                        }
                                        :{' '}
                                        {data.loading_uploading_fee ? (
                                            CommonUtils.formattedValue(
                                                data.loading_uploading_fee
                                            )
                                        ) : (
                                            <div>0 VNĐ</div>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <DollarCircleOutlined />{' '}
                                    {<FormattedMessage id="order.price" />}:{' '}
                                    {data.total_price ? (
                                        CommonUtils.formattedValue(
                                            data.total_price
                                        )
                                    ) : (
                                        <div>0 VNĐ</div>
                                    )}
                                </div>
                            </>
                        )}
                    />

                    <Column
                        title={<FormattedMessage id="order.payment_info" />}
                        key="payer"
                        dataIndex="payer"
                        width="280px"
                        render={(data) => (
                            <>
                                <div>
                                    <BankOutlined />
                                    {data.payer_name}
                                </div>
                                <div>
                                    <BankOutlined />{' '}
                                    {
                                        <FormattedMessage id="order.payment_method" />
                                    }
                                    : {data.payment_code}
                                </div>
                                {data.payment_reference_code ? (
                                    <div>
                                        <BankOutlined />{' '}
                                        {
                                            <FormattedMessage id="order.reference_code" />
                                        }
                                        : {data.payment_reference_code}
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                    />

                    <Column
                        title={<FormattedMessage id="order.loading_time" />}
                        key="pickup_date"
                        dataIndex="pickup_date"
                        width="200px"
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
                        title={<FormattedMessage id="order.arrive_time" />}
                        key="intend_time"
                        dataIndex="intend_time"
                        width="200px"
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
                        title={<FormattedMessage id="order.finish_time" />}
                        key="finish_date"
                        dataIndex="finish_date"
                        width="200px"
                        render={(data) => (
                            <>
                                <FieldTimeOutlined />{' '}
                                {/* {data != ''
                                    ? moment(data).format(
                                          dateFormat.DATE_FORMAT
                                      )
                                    : '...'} */}
                                {'...'}
                            </>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="order.date_created" />}
                        key="createDate"
                        dataIndex="createDate"
                        width="200px"
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
                </Table>
            </>
        );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(OrdersData);

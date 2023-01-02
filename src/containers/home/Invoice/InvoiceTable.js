import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import moment from 'moment';

import { Table, Tag } from 'antd';
import {
    PhoneOutlined,
    HomeOutlined,
    DollarCircleOutlined,
    CodeSandboxOutlined,
    SlidersOutlined,
    ColumnWidthOutlined,
    FieldTimeOutlined,
    BankOutlined,
    CarOutlined,
    CarryOutOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { dateFormat, CommonUtils, INVOICE_STATUS } from '../../../utils';
import { path } from '../../../utils/constant';

const { Column } = Table;

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
    getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
    }),
};

class InvoiceTable extends React.Component {
    render() {
        let invoices = this.props.invoices;

        return (
            <>
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    dataSource={invoices}
                    scroll={{
                        x: 'calc(800px + 50%)',
                        y: 340,
                    }}
                    size="middle"
                >
                    <Column title="#" key="no" dataIndex="no" width="20px" />
                    <Column
                        title={<FormattedMessage id="order.order_status" />}
                        key="status"
                        dataIndex="status"
                        render={(status) => (
                            <>
                                {status === INVOICE_STATUS.PAID ? (
                                    <Tag color="blue" key={status}>
                                        <FormattedMessage id="order.paid" />
                                    </Tag>
                                ) : (
                                    <Tag color="red" key={status}>
                                        <FormattedMessage id="order.unpaid" />
                                    </Tag>
                                )}
                            </>
                        )}
                        width="90px"
                    />
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
                                    data.order_id +
                                    '&tabId=2'
                                }
                            >
                                {data.order_code}
                                <p>
                                    {data.is_multiple === true && (
                                        <Tag color="#87d068">Nhiều điểm dỡ</Tag>
                                    )}
                                </p>
                            </Link>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="order.price" />}
                        key="total"
                        dataIndex="total"
                        width="120px"
                        rowSpan="3"
                        render={(data) => (
                            <>
                                <div>
                                    <DollarCircleOutlined />{' '}
                                    {data ? (
                                        CommonUtils.formattedValue(data)
                                    ) : (
                                        <div>0 VNĐ</div>
                                    )}
                                </div>
                            </>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="order.due_date" />}
                        key="due_date"
                        dataIndex="due_date"
                        width="130px"
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
                        title={<FormattedMessage id="order.invoice_created" />}
                        key="created"
                        dataIndex="created"
                        width="130px"
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
                        title={<FormattedMessage id="order.content" />}
                        key="content"
                        dataIndex="content"
                        width="200px"
                    />
                    {/* <Column
                        title="Người thanh toán"
                        key="payer"
                        dataIndex="payer"
                        width="200px"
                        render={(data) => (
                            <>
                                <div>
                                    <UserOutlined /> {data.payer_name}
                                </div>
                                <div>{data.payment_code}</div>
                                {data.payment_reference_code && (
                                    <div>
                                        Mã tham chiếu:{' '}
                                        {data.payment_reference_code}
                                    </div>
                                )}
                            </>
                        )}
                    /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceTable);

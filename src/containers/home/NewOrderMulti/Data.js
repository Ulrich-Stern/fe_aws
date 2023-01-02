import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { FormattedMessage } from 'react-intl';

import {
    PhoneOutlined,
    HomeOutlined,
    UserOutlined,
    DollarCircleOutlined,
    FieldTimeOutlined,
    CarryOutOutlined,
} from '@ant-design/icons';
import { Table } from 'antd';

import { dateFormat, CommonUtils } from '../../../utils';

const { Column } = Table;

class Data extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let receiver_list = this.props.receiver_list;

        let rowSelection = this.props.rowSelection;

        return (
            <>
                {/* để check box hoạt động bình thường thì 
                cần rowKey={(record) => record.key} và rowSelection={
                        this.props.rowSelection != null && {
                            type: 'checkbox',
                            ...rowSelection,
                        }
                    }
            https://github.com/ant-design/ant-design/issues/15414 */}
                <Table
                    rowSelection={
                        this.props.rowSelection != null && {
                            type: 'checkbox',
                            ...rowSelection,
                        }
                    }
                    dataSource={receiver_list}
                    scroll={{
                        x: 'calc(500px + 50%)',
                        y: 340,
                        overflowY: 'auto',
                    }}
                    size="middle"
                    style={{ height: '450px' }}
                    selectedRowKeys="abc"
                    rowKey={(record) => record.key}
                >
                    <Column
                        title={<FormattedMessage id="order.unload_place" />}
                        key="address"
                        dataIndex="address"
                        width="200px"
                        className="moreInfo-listOrder"
                        render={(data) => (
                            <>
                                <div>
                                    <UserOutlined />{' '}
                                    {data.receiver_contact_name || (
                                        <FormattedMessage id="order.none" />
                                    )}
                                </div>
                                <div>
                                    <PhoneOutlined />{' '}
                                    {data.receiver_phone || (
                                        <FormattedMessage id="order.none" />
                                    )}
                                </div>
                                <div>
                                    <HomeOutlined />{' '}
                                    {data.address || (
                                        <FormattedMessage id="order.none" />
                                    )}
                                </div>
                            </>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="order.#vehicle" />}
                        key="number_of_vehicle"
                        dataIndex="number_of_vehicle"
                        width="100px"
                        render={(data) => (
                            <>
                                <div>
                                    {data || (
                                        <FormattedMessage id="order.none" />
                                    )}
                                </div>
                            </>
                        )}
                    />

                    <Column
                        title={<FormattedMessage id="order.distance" />}
                        key="distance"
                        dataIndex="distance"
                        width="150px"
                        render={(data) => (
                            <>
                                <div>
                                    {data ? data + ' km' : <div>...</div>}
                                </div>
                            </>
                        )}
                    />

                    <Column
                        title={<FormattedMessage id="order.price" />}
                        key="total_fee"
                        dataIndex="total_fee"
                        width="150px"
                        render={(data) => (
                            <>
                                <div>
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
                        title={<FormattedMessage id="order.arrive_time" />}
                        key="intend_time"
                        dataIndex="intend_time"
                        width="150px"
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

export default connect(mapStateToProps, mapDispatchToProps)(Data);

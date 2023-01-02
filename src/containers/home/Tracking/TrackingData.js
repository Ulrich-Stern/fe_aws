import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Table, Collapse, Button, Card } from 'antd';
import { FormattedMessage } from 'react-intl';
import { UserOutlined, PhoneOutlined, CarOutlined } from '@ant-design/icons';

import { dateFormat, CommonUtils, LOG_TRIP_TYPE } from '../../../utils';

const { Column } = Table;
const { Panel } = Collapse;

class TrackingData extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let vehicleInfo = this.props.vehicleInfo;
        let logTrip = this.props.logTrip;
        return (
            <>
                {/* <Collapse bordered={false} expandIconPosition="right">
                    <Panel
                        header={<FormattedMessage id="order.vehicle_info" />}
                        key="1"
                    >
                        <div>
                            <div className="sender_title">
                                <FormattedMessage id="order.driver_info" />
                            </div>
                            <div>
                                <UserOutlined /> {vehicleInfo.driver}
                            </div>
                            <div>
                                {' '}
                                <PhoneOutlined /> {vehicleInfo.phone}
                            </div>
                            <div>
                                {' '}
                                <CarOutlined /> {vehicleInfo.license_plates}
                            </div>
                        </div>
                    </Panel>
                </Collapse> */}

                <Card bordered={false}>
                    <div>
                        <div className="sender_title">
                            <FormattedMessage id="order.driver_info" />
                        </div>
                        <div>
                            <UserOutlined /> {vehicleInfo.driver}
                        </div>
                        <div>
                            {' '}
                            <PhoneOutlined /> {vehicleInfo.phone}
                        </div>
                        <div>
                            {' '}
                            <CarOutlined /> {vehicleInfo.license_plates}
                        </div>
                    </div>
                </Card>

                <Table
                    dataSource={logTrip}
                    scroll={{
                        x: 'calc(350px + 50%)',
                        y: 200,
                    }}
                    size="middle"
                    style={{ height: '540px' }}
                >
                    <Column
                        title={<FormattedMessage id="order.content" />}
                        key="type"
                        dataIndex="type"
                        width="50px"
                        align="center"
                        render={(type) => (
                            <>
                                {type === LOG_TRIP_TYPE.LOADED && 'Đã bốc hàng'}
                                {type === LOG_TRIP_TYPE.UNLOADED &&
                                    'Đã dỡ hàng'}
                                {type === LOG_TRIP_TYPE.OTHER && 'Khác'}
                            </>
                        )}
                    />

                    <Column
                        title={
                            <FormattedMessage id="order.actual_goods_weight" />
                        }
                        key="actual_goods_weight"
                        dataIndex="actual_goods_weight"
                        width="50px"
                        align="center"
                        render={(actual_goods_weight) => (
                            <>{actual_goods_weight}</>
                        )}
                    />

                    <Column
                        title={<FormattedMessage id="address_book.addr_city" />}
                        key="city"
                        dataIndex="city"
                        width="40px"
                        align="center"
                        render={(city) => (
                            <>{city === 'Tỉnh/Thành phố' ? <></> : city}</>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="address_book.district" />}
                        key="district"
                        dataIndex="district"
                        width="40px"
                        align="center"
                        render={(district) => (
                            <>{district === 'Quận/Huyện' ? <></> : district}</>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="order.comment" />}
                        key="content"
                        dataIndex="content"
                        width="40px"
                    />
                    <Column
                        title={<FormattedMessage id="order.time" />}
                        key="time"
                        dataIndex="time"
                        width="50px"
                        align="center"
                        render={(time) => (
                            <>
                                {time != ''
                                    ? moment(time).format(
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

export default connect(mapStateToProps, mapDispatchToProps)(TrackingData);

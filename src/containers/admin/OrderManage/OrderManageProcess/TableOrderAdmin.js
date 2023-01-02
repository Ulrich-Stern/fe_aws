import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { Table, Tag, Progress } from 'antd';
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

import { dateFormat, CommonUtils, ORDER_STATUS } from '../../../../utils';

import { path } from '../../../../utils/constant';

const { Column } = Table;

class TableOrderAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let orderList = this.props.orderList;
        console.log('orderList:', orderList);
        return (
            <>
                <Table
                    dataSource={orderList}
                    scroll={{
                        x: 'calc(700px + 50%)',
                        y: 440,
                    }}
                    size="middle"
                    style={{
                        minHeight: 540,
                    }}
                >
                    <Column
                        title="Mã vận đơn"
                        key="order_code"
                        dataIndex="order_code"
                        width="120px"
                        render={(data) => (
                            <Link
                                to={
                                    path.ORDER_MANAGE_DETAIL +
                                    '?orderId=' +
                                    data.key
                                }
                            >
                                {data.order_code}{' '}
                                {data.isMultipleOrder == true && (
                                    <Tag color="#87d068">Nhiều điểm dỡ</Tag>
                                )}
                            </Link>
                        )}
                    />
                    <Column
                        title="Trạng thái"
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

                                {status.invoice === 'paid' ? (
                                    <div>
                                        <br></br>
                                        <Tag
                                            icon={<CheckCircleOutlined />}
                                            color="success"
                                        >
                                            Đã thanh toán
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
                        title="Tài khoản"
                        key="own_user"
                        dataIndex="own_user"
                        width="200px"
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
                        title="Số xe đã điều phối"
                        key="trackings"
                        dataIndex="trackings"
                        width="140px"
                        render={(data) => (
                            <center>
                                <Progress
                                    type="circle"
                                    percent={+data.percent}
                                    format={() => (
                                        <>
                                            {data.num_of_trackings}/
                                            {data.number_of_vehicle}
                                        </>
                                    )}
                                    width="60px"
                                />
                                {/* {data.num_of_trackings}/{data.number_of_vehicle} */}
                            </center>
                        )}
                    />
                    <Column
                        title="Điểm bốc hàng"
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
                        title="Điểm dỡ hàng"
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
                        title="Thông tin xe"
                        key="vehicle"
                        dataIndex="vehicle"
                        width="200px"
                        render={(data) => (
                            <>
                                <div>
                                    <CarOutlined /> Xe: {data.vehicle_name}
                                </div>
                                <div>
                                    <ShoppingCartOutlined /> Loại:{' '}
                                    {data.tonage_name}
                                </div>
                                <div>
                                    <CarryOutOutlined /> Số lượng:{' '}
                                    {data.number_of_vehicle}
                                </div>
                            </>
                        )}
                    />
                    <Column
                        title="Thông tin đơn hàng"
                        key="goods"
                        dataIndex="goods"
                        width="200px"
                        render={(data) => (
                            <>
                                <div>
                                    <CodeSandboxOutlined /> Số kiện:{' '}
                                    {data.number_package}
                                </div>
                                <div>
                                    <SlidersOutlined /> Trọng lượng:{' '}
                                    {data.weight}
                                </div>
                                <div>
                                    <ColumnWidthOutlined /> Kích thước:{' '}
                                    {data.size}
                                </div>
                            </>
                        )}
                    />
                    <Column
                        title="Dịch vụ vận tải"
                        key="service"
                        dataIndex="service"
                        width="250px"
                        render={(data) => (
                            <>
                                {data.is_frozen_storage == true && (
                                    <div>Bảo quản đông lạnh</div>
                                )}
                                {data.is_danger == true && (
                                    <div>Hàng hóa nguy hiểm</div>
                                )}
                                {data.do_buy_insurance == true && (
                                    <div>Mua bảo hiểm</div>
                                )}
                                {data.hire_loading_uploading == true && (
                                    <div>Thuê bốc, dỡ hàng</div>
                                )}
                                {data.no_empty_container == true && (
                                    <div>
                                        Chỉ thuê xe đầu kéo, không thuê thùng
                                        cont rỗng
                                    </div>
                                )}
                                {data.is_frozen_storage == false &&
                                    data.is_danger == false &&
                                    data.do_buy_insurance == false &&
                                    data.hire_loading_uploading == false &&
                                    data.no_empty_container == false && (
                                        <div>Không</div>
                                    )}
                            </>
                        )}
                    />
                    <Column
                        title="Chi phí"
                        key="fee"
                        dataIndex="fee"
                        width="220px"
                        render={(data) => (
                            <>
                                <div>
                                    <DollarCircleOutlined /> Thu hộ:
                                    {data.cod_fee ? (
                                        CommonUtils.formattedValue(data.cod_fee)
                                    ) : (
                                        <div>0 VNĐ</div>
                                    )}
                                </div>
                                <div>
                                    <DollarCircleOutlined /> Giá trị hàng:{' '}
                                    {data.commodity_value ? (
                                        CommonUtils.formattedValue(data.cod_fee)
                                    ) : (
                                        <div>0 VNĐ</div>
                                    )}
                                </div>
                                <div>
                                    <DollarCircleOutlined /> Tổng cước:{' '}
                                    {data.total_price ? (
                                        CommonUtils.formattedValue(data.cod_fee)
                                    ) : (
                                        <div>0 VNĐ</div>
                                    )}
                                </div>
                            </>
                        )}
                    />

                    <Column
                        title="Thanh toán"
                        key="payer"
                        dataIndex="payer"
                        width="280px"
                        render={(data) => (
                            <>
                                <div>
                                    <BankOutlined /> Tài khoản:
                                    {data.payer_name}
                                </div>
                                <div>
                                    <BankOutlined /> Chọn: {data.payment_code}
                                </div>
                                {data.payment_reference_code ? (
                                    <div>
                                        <BankOutlined /> Mã tham khảo:{' '}
                                        {data.payment_reference_code}
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                    />

                    <Column
                        title="Thời gian bốc hàng"
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
                        title="Thời gian dỡ hàng (dự kiến)"
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
                        title="Thời gian dỡ hàng"
                        key="finish_date"
                        dataIndex="finish_date"
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
                        title="Ngày tạo đơn"
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

export default connect(mapStateToProps, mapDispatchToProps)(TableOrderAdmin);

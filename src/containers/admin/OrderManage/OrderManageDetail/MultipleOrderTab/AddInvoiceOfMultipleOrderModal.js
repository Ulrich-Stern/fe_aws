import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';

import {
    Modal,
    Button,
    Row,
    Col,
    DatePicker,
    Typography,
    Card,
    Descriptions,
    List,
    Divider,
    Tag,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { dateFormat, CommonUtils } from '../../../../../utils';

import { addInvoiceService } from '../../../../../services/invoiceService';
import { searchOrderByOrderCodeService } from '../../../../../services/orderService';

const { Title } = Typography;
const { Text } = Typography;

class AddInvoiceOfMultipleOrderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            own_user: '',
            order_id: '',
            sub_total: '',
            total: '',
            due_date: '',
            content: '',
            tax: '',
            main_fee: '0',
            order: this.props.order,
            created: '',
            payment_reference_code: '',

            // multiple order
            orderList: [],
            order_code: '',
        };
    }

    async componentDidMount() {
        await this.getOrder();
        await this.initTableReceiver();
        await this.handleForm();
        await this.updateTotalAll();
    }

    validateInput = () => {
        let arrInput = [
            'own_user',
            'order_id',
            'sub_total',
            'total',
            'due_date',
            'content',
            'tax',
            'main_fee',
            'order_code',
        ];
        for (let i = 0; i < arrInput.length; i++) {
            // return state element if it empty
            if (!this.state[arrInput[i]]) {
                toast.warning('Missing parameter: ' + arrInput[i]);
                return false;
            }
        }

        return true;
    };

    handleOnChangeDueDate = (value, id) => {
        let copyState = { ...this.state };
        copyState[id] = value;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    addInvoice = async () => {
        try {
            let check = this.validateInput();
            if (check) {
                let result = await addInvoiceService(this.state);
                if (result.errCode !== 0) {
                    toast.error(result.errMessage);
                }
                // successful case
                else {
                    toast.success('Create invoice successful');
                    await this.props.handleCancel();
                    window.location.reload();
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleForm = async () => {
        try {
            let order = this.state.order;
            let order_code = order.order_code;

            let copyState = { ...this.state };
            copyState.content = `Cước vận chuyển đơn hàng #${order_code}`;
            copyState.created = order.created.time;
            copyState.payment_reference_code = order.payment_reference_code;

            copyState.own_user = order.own_user;
            copyState.order_id = order._id;
            copyState.order_code = order.order_code;

            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    getOrder = async () => {
        let orderList = await searchOrderByOrderCodeService(
            this.state.order.order_code
        );
        orderList = orderList.order;

        let copyState = { ...this.state };

        copyState['orderList'] = orderList;

        await this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    initTableReceiver = async () => {
        try {
            let orderList = this.state.orderList;
            let obj = [];
            await orderList.forEach((i) => {
                obj.push({
                    receiver_id: i.receiver_id,

                    address: {
                        receiver_contact_name: i.receiver_contact_name,
                        receiver_alias: i.receiver_alias,
                        receiver_phone: i.receiver_phone,

                        address: `${i.receiver_addr_street}, ${i.receiver_addr_ward.name}, ${i.receiver_addr_district.name}, ${i.receiver_addr_city.name}`,
                    },

                    number_of_vehicle: i.number_of_vehicle,
                    total_price: i.total_price,
                    intend_time: i.intend_time,
                });
            });

            let copyState = { ...this.state };
            copyState['receiver_list'] = obj;
            await this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    updateTotalAll = () => {
        let sub_total = 0;

        this.state.receiver_list.forEach((i) => {
            sub_total = sub_total + parseInt(i.total_price);
        });

        let tax = +sub_total * 0.08;
        tax = Math.round(tax);
        let total = +sub_total * 1.08;
        total = Math.round(total);

        let copyState = { ...this.state };
        copyState.sub_total = sub_total.toString();
        copyState.tax = tax.toString();
        copyState.total = total.toString();

        this.setState({ ...copyState }, () => {});
    };

    render() {
        let receiver_list = this.state.receiver_list;
        return (
            <>
                <div className="text-center">
                    <Modal
                        // syntax calls props from parent.
                        // Note: this function is defined by the parent,
                        // runs in the parent, the child only calls it
                        visible={this.props.isOpenAddModal}
                        onOk={this.handleOk}
                        onCancel={this.props.handleCancel}
                        footer={[
                            <Button
                                key="back"
                                onClick={this.props.handleCancel}
                            >
                                Cancel
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                onClick={() => {
                                    this.addInvoice();
                                }}
                            >
                                Tạo hóa đơn
                            </Button>,
                        ]}
                        width={'80%'}
                    >
                        {/* modal content */}
                        <h2>
                            Thêm hóa đơn cho vận đơn{' '}
                            <Tag color="#87d068">Nhiều điểm dỡ</Tag>
                        </h2>
                        <Row gutter={[24, 24]}>
                            {/* Thông tin hóa đơn */}
                            <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                                <Card>
                                    <Title level={4}>
                                        Thông tin hóa đơn của mã vận đơn{' '}
                                        <Text mark>
                                            {this.state.order_code}
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
                                                    {this.state.content}
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label="Ngày đáo hạn"
                                                    span={3}
                                                >
                                                    <DatePicker
                                                        format="DD-MM-YYYY HH:mm"
                                                        disabledDate={(
                                                            current
                                                        ) => {
                                                            return (
                                                                current &&
                                                                current <
                                                                    moment().endOf(
                                                                        'day'
                                                                    )
                                                            );
                                                        }}
                                                        value={
                                                            this.state.due_date
                                                        }
                                                        onChange={(e) => {
                                                            this.handleOnChangeDueDate(
                                                                e,
                                                                'due_date'
                                                            );
                                                        }}
                                                    />
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label="Ngày tạo hóa đơn"
                                                    span={3}
                                                >
                                                    {this.state.created != ''
                                                        ? moment(
                                                              this.state.created
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
                                            {this.props.payer_name_input}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label="Hình thức thanh toán"
                                            span={3}
                                        >
                                            {this.props.payment_code_input}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label="Mã tham chiếu"
                                            span={3}
                                        >
                                            {this.state.payment_reference_code
                                                ? this.state
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
                                                    <h2>Danh sách cước phí</h2>
                                                }
                                                bordered={false}
                                            >
                                                {/* {order && order.cod && (
                                                    <List.Item>
                                                        Thu hộ:{' '}
                                                        {order && order.cod ? (
                                                            CommonUtils.formattedValue(
                                                                order.cod
                                                            )
                                                        ) : (
                                                            <>0 VNĐ</>
                                                        )}
                                                    </List.Item>
                                                )} */}

                                                {receiver_list &&
                                                receiver_list.length > 0
                                                    ? receiver_list.map(
                                                          (i, idx) => {
                                                              return (
                                                                  <List.Item>
                                                                      <p>
                                                                          #{idx}{' '}
                                                                          - Đến:{' '}
                                                                          {
                                                                              i
                                                                                  .address
                                                                                  .address
                                                                          }
                                                                      </p>
                                                                      <p>
                                                                          Hóa
                                                                          đơn:{' '}
                                                                          {i.total_price ? (
                                                                              CommonUtils.formattedValue(
                                                                                  i.total_price
                                                                              )
                                                                          ) : (
                                                                              <>
                                                                                  0
                                                                                  VNĐ
                                                                              </>
                                                                          )}
                                                                      </p>
                                                                  </List.Item>
                                                              );
                                                          }
                                                      )
                                                    : ''}
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
                                                Tổng hóa đơn (chưa có thuế):{' '}
                                                {this.state.sub_total ? (
                                                    CommonUtils.formattedValue(
                                                        this.state.sub_total
                                                    )
                                                ) : (
                                                    <>0 VNĐ</>
                                                )}
                                            </Title>
                                            <Title level={5}>
                                                Thuế VAT 8%:{' '}
                                                {this.state.tax ? (
                                                    CommonUtils.formattedValue(
                                                        this.state.tax
                                                    )
                                                ) : (
                                                    <>0 VNĐ</>
                                                )}
                                            </Title>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Title level={2}>
                                                Tổng hóa đơn:{' '}
                                                {this.state.total ? (
                                                    CommonUtils.formattedValue(
                                                        this.state.total
                                                    )
                                                ) : (
                                                    <>0 VNĐ</>
                                                )}
                                            </Title>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Modal>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddInvoiceOfMultipleOrderModal);

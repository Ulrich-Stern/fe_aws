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
} from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { dateFormat, CommonUtils } from '../../../utils';

import { addInvoiceService } from '../../../services/invoiceService';
const { Title } = Typography;
const { Text } = Typography;

class AddInvoiceModal extends Component {
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
            order_code: '',
        };
    }

    async componentDidMount() {
        await this.handleForm();
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

            let sub_total = order.total_price;
            let tax = +sub_total * 0.08;
            tax = Math.round(tax);
            let total = +sub_total * 1.08;
            total = Math.round(total);

            let copyState = { ...this.state };
            copyState.content = `C?????c v???n chuy???n ????n h??ng #${order_code}`;
            copyState.created = order.created.time;
            copyState.payment_reference_code = order.payment_reference_code;
            copyState.sub_total = sub_total;
            copyState.tax = tax.toString();
            copyState.total = total.toString();
            copyState.own_user = order.own_user;
            copyState.order_id = order._id;
            copyState.order_code = order.order_code;

            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        let order = this.state.order;
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
                                T???o h??a ????n
                            </Button>,
                        ]}
                        width={'80%'}
                    >
                        {/* modal content */}
                        <h2>Th??m h??a ????n cho v???n ????n</h2>
                        <Row gutter={[24, 24]}>
                            {/* Th??ng tin h??a ????n */}
                            <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                                <Card>
                                    <Title level={4}>
                                        Th??ng tin h??a ????n c???a m?? v???n ????n{' '}
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
                                                    label="N???i dung"
                                                    span={3}
                                                >
                                                    {this.state.content}
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label="Ng??y ????o h???n"
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
                                                    label="Ng??y t???o h??a ????n"
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
                                            {this.props.payer_name_input}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label="H??nh th???c thanh to??n"
                                            span={3}
                                        >
                                            {this.props.payment_code_input}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label="M?? tham chi???u"
                                            span={3}
                                        >
                                            {this.state.payment_reference_code
                                                ? this.state
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
                                                    <h2>Danh s??ch c?????c ph??</h2>
                                                }
                                                bordered={false}
                                            >
                                                {order && order.cod && (
                                                    <List.Item>
                                                        Thu h???:{' '}
                                                        {order && order.cod ? (
                                                            CommonUtils.formattedValue(
                                                                order.cod
                                                            )
                                                        ) : (
                                                            <>0 VN??</>
                                                        )}
                                                    </List.Item>
                                                )}

                                                {order && order.cod_fee && (
                                                    <List.Item>
                                                        Ph?? thu h???:
                                                        {order &&
                                                        order.cod_fee ? (
                                                            CommonUtils.formattedValue(
                                                                order.cod_fee
                                                            )
                                                        ) : (
                                                            <>0 VN??</>
                                                        )}
                                                    </List.Item>
                                                )}
                                                {order &&
                                                    order.container_retal_fee && (
                                                        <List.Item>
                                                            Thu?? th??ng xe cont:{' '}
                                                            {order &&
                                                            order.container_retal_fee ? (
                                                                CommonUtils.formattedValue(
                                                                    order.container_retal_fee
                                                                )
                                                            ) : (
                                                                <>0 VN??</>
                                                            )}
                                                        </List.Item>
                                                    )}
                                                {order &&
                                                    order.insurance_fee && (
                                                        <List.Item>
                                                            B???o hi???m:{' '}
                                                            {order &&
                                                            order.insurance_fee ? (
                                                                CommonUtils.formattedValue(
                                                                    order.insurance_fee
                                                                )
                                                            ) : (
                                                                <>0 VN??</>
                                                            )}
                                                        </List.Item>
                                                    )}
                                                {order &&
                                                    order.loading_uploading_fee && (
                                                        <List.Item>
                                                            Thu?? b???c, d??? Ph?? thu
                                                            h??? h??ng:{' '}
                                                            {order &&
                                                            order.loading_uploading_fee ? (
                                                                CommonUtils.formattedValue(
                                                                    order.loading_uploading_fee
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
                                                    backgroundColor: '#C4C4C4',
                                                }}
                                            ></Divider>
                                        </Col>
                                        {/* T???ng c?????c */}
                                        <Col span={24}>
                                            <Title level={5}>
                                                T???ng h??a ????n (ch??a c?? thu???):{' '}
                                                {this.state.sub_total ? (
                                                    CommonUtils.formattedValue(
                                                        this.state.sub_total
                                                    )
                                                ) : (
                                                    <>0 VN??</>
                                                )}
                                            </Title>
                                            <Title level={5}>
                                                Thu??? VAT 8%:{' '}
                                                {this.state.tax ? (
                                                    CommonUtils.formattedValue(
                                                        this.state.tax
                                                    )
                                                ) : (
                                                    <>0 VN??</>
                                                )}
                                            </Title>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Title level={2}>
                                                T???ng h??a ????n:{' '}
                                                {this.state.total ? (
                                                    CommonUtils.formattedValue(
                                                        this.state.total
                                                    )
                                                ) : (
                                                    <>0 VN??</>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddInvoiceModal);

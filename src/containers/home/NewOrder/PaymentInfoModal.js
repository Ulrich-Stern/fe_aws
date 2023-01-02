import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Col, Row, Button, Modal, Select } from 'antd';
import { Radio } from 'antd';
import { Form, Input } from 'antd';
import { FormattedMessage } from 'react-intl';

import { addPayerService } from '../../../services/payerService';

const { Option } = Select;

class PaymentInfoModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payment_type: 'atm',
            payer_name: '',
            bank: '',
            atm_id: '',
            phone: '',
            own_user: this.props.userInfo._id,
        };
    }

    validateInput = () => {
        if (this.state.payment_type == 'atm') {
            let arrInput = ['payer_name', 'bank', 'atm_id'];
            for (let i = 0; i < arrInput.length; i++) {
                // return state element if it empty
                if (!this.state[arrInput[i]]) {
                    alert('Missing parameter: ' + arrInput[i]);
                    return false;
                }
            }
        }
        if (this.state.payment_type == 'momo') {
            let arrInput = ['payer_name', 'phone'];
            for (let i = 0; i < arrInput.length; i++) {
                // return state element if it empty
                if (!this.state[arrInput[i]]) {
                    alert('Missing parameter: ' + arrInput[i]);
                    return false;
                }
            }

            if (
                !/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/.test(
                    this.state.phone
                )
            ) {
                alert('Phone is not valid');
                return false;
            }
        }

        return true;
    };

    handleOnChangeInput = (e, id) => {
        let copyState = { ...this.state };
        copyState[id] = e.target.value;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    handleOnChangeBank = (value) => {
        let copyState = { ...this.state };
        copyState['bank'] = value;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    handleClickAdd = async () => {
        try {
            let check = await this.validateInput();
            if (check) {
                let result = await addPayerService(this.state);
                // error case
                if (result.errCode !== 0) {
                    alert(result.errMessage);
                }
                // successful case
                else {
                    alert('save payer successful');
                    // update
                    this.props.refreshListOfPayer();
                    // turn off modal
                    this.props.handleCancel();
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
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
                                <FormattedMessage id="order.cancel" />
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                onClick={() => {
                                    this.handleClickAdd();
                                }}
                            >
                                <FormattedMessage id="order.submit" />
                            </Button>,
                        ]}
                        width={711}
                    >
                        {/* modal content */}
                        <h2>
                            <FormattedMessage id="order.add_payment_info" />
                        </h2>
                        <Radio.Group
                            value={this.state.payment_type}
                            onChange={(e) => {
                                this.handleOnChangeInput(e, 'payment_type');
                            }}
                        >
                            <Radio value="atm">
                                <FormattedMessage id="order.credit_card" />
                            </Radio>
                            <Radio value="momo">
                                <FormattedMessage id="order.momo" />
                            </Radio>
                        </Radio.Group>
                        <br />
                        <br />
                        {this.state.payment_type &&
                        this.state.payment_type === 'atm' ? (
                            <Row gutter={[16, 24]} className="gutter-row flex">
                                <Col span={20}>
                                    <Form.Item
                                        label={
                                            <FormattedMessage id="order.choose_bank" />
                                        }
                                    >
                                        <Select
                                            style={{
                                                width: '100%',
                                            }}
                                            onChange={(value) => {
                                                this.handleOnChangeBank(value);
                                            }}
                                            value={this.state.bank}
                                        >
                                            <Option value="vietcombank">
                                                VietcomBank
                                            </Option>
                                            <Option value="ocb">OCB</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={20}>
                                    <Form.Item
                                        label={
                                            <FormattedMessage id="order.account" />
                                        }
                                    >
                                        <Input
                                            value={this.state.payer_name}
                                            onChange={(e) => {
                                                this.handleOnChangeInput(
                                                    e,
                                                    'payer_name'
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={20}>
                                    <Form.Item
                                        label={
                                            <FormattedMessage id="order.atm_number" />
                                        }
                                    >
                                        <Input
                                            value={this.state.atm_id}
                                            onChange={(e) => {
                                                this.handleOnChangeInput(
                                                    e,
                                                    'atm_id'
                                                );
                                            }}
                                        ></Input>
                                    </Form.Item>
                                </Col>
                            </Row>
                        ) : (
                            <Row gutter={[16, 24]} className="gutter-row flex">
                                <Col span={20}>
                                    <Form.Item
                                        label={
                                            <FormattedMessage id="order.account" />
                                        }
                                    >
                                        <Input
                                            value={this.state.payer_name}
                                            onChange={(e) => {
                                                this.handleOnChangeInput(
                                                    e,
                                                    'payer_name'
                                                );
                                            }}
                                        ></Input>
                                    </Form.Item>
                                </Col>

                                <Col span={20}>
                                    <Form.Item
                                        label={
                                            <FormattedMessage id="address_book.phone" />
                                        }
                                    >
                                        <Input
                                            value={this.state.phone}
                                            onChange={(e) => {
                                                this.handleOnChangeInput(
                                                    e,
                                                    'phone'
                                                );
                                            }}
                                        ></Input>
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInfoModal);

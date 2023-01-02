import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Typography, Button, Input, Select } from 'antd';

import { FormattedMessage } from 'react-intl';
import { LANGUAGE } from '../../../utils';
import PaymentInfoModal from './PaymentInfoModal';

const { Title } = Typography;
const { Option } = Select;

class PaymentInfo extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpenAddModal: false };
    }

    showModal = () => {
        this.setState({ isOpenAddModal: true });
    };

    handleCancel = () => {
        try {
            this.setState({ isOpenAddModal: false });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        let paymentsCode = this.props.paymentsCode;
        let lang = this.props.lang;
        let payers = this.props.payers;
        return (
            <>
                <PaymentInfoModal
                    isOpenAddModal={this.state.isOpenAddModal}
                    showModal={this.showModal}
                    handleCancel={this.handleCancel}
                    refreshListOfPayer={this.props.refreshListOfPayer}
                />

                <Card>
                    <Row gutter={[12, 12]}>
                        <Col span={24}>
                            <Title level={3}>
                                <FormattedMessage id="order.payment_info" />{' '}
                            </Title>
                        </Col>
                        <Col span={17}>
                            <Title level={5}>
                                <FormattedMessage id="order.payer" />{' '}
                                <span className="required">*</span>
                            </Title>
                        </Col>
                        <Col xs={24} sm={7}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.showModal();
                                }}
                            >
                                <i className="fas fa-user-plus"></i> &nbsp;{' '}
                                <FormattedMessage id="order.fill_in_info" />
                            </Button>
                        </Col>

                        <Col span={24}>
                            <Select
                                defaultValue={
                                    <FormattedMessage id="order.choose_payer" />
                                }
                                style={{
                                    width: '100%',
                                }}
                                onChange={(e) => {
                                    this.props.setStateFromChild('payer_id', e);
                                }}
                            >
                                {payers &&
                                    payers.map((i) => {
                                        return (
                                            <Option key={i._id} value={i._id}>
                                                {i.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Title level={5}>
                                <FormattedMessage id="order.payment_method" />{' '}
                                <span className="required">*</span>
                            </Title>
                            <Select
                                defaultValue={
                                    <FormattedMessage id="order.payment_method" />
                                }
                                style={{
                                    width: '100%',
                                }}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'payment_code',
                                        e
                                    );
                                }}
                            >
                                {paymentsCode &&
                                    paymentsCode.map((i) => {
                                        return (
                                            <Option key={i.key} value={i.key}>
                                                {LANGUAGE.VI === lang
                                                    ? i.value_vi
                                                    : i.value_en}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Title level={5}>
                                <FormattedMessage id="order.reference_code" />
                            </Title>
                            <Input
                                placeholder={
                                    LANGUAGE.VI === lang
                                        ? 'Mã tham chiếu'
                                        : 'Reference code'
                                }
                                value={this.props.payment_reference_code}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'payment_reference_code',
                                        e.target.value
                                    );
                                }}
                            ></Input>
                        </Col>
                    </Row>
                </Card>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return { lang: state.app.language };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInfo);

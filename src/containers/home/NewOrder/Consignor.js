import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Layout, Row, Col, Card, DatePicker } from 'antd';
import { Typography, Button, Select } from 'antd';

import { FormattedMessage } from 'react-intl';
import ConsignorModal from './ConsignorModal';
import { emitter } from './../../../utils/emitter';

const { Title } = Typography;
const { Option } = Select;

class Consignor extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpenAddModal: false };
    }

    showModal = () => {
        this.setState({ isOpenAddModal: true });
    };

    handleCancel = () => {
        try {
            // call event from child
            emitter.emit('EVENT_CLEAR_ADD_ADDRESS_BOOK_MODAL_DATA', {
                id: 'your id',
            });
            this.setState({ isOpenAddModal: false });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    chooseAddressUserJustEntered = async () => {
        // refresh list of address book
        await this.props.refreshListOfAddressBook();
    };

    render() {
        let addressBooks = this.props.addressBooks;
        return (
            <>
                {/* add modal */}
                <ConsignorModal
                    // cách kế thừa biến và hàm của cha
                    isOpenAddModal={this.state.isOpenAddModal}
                    handleCancel={this.handleCancel}
                    // select the address just entered
                    chooseAddressUserJustEnteredFromParent={
                        this.chooseAddressUserJustEntered
                    }
                />

                <Card>
                    <Row gutter={[12, 12]}>
                        <Col span={18}>
                            <Title level={3}>
                                <FormattedMessage id="order.consignor" />{' '}
                                <span className="required">*</span>
                            </Title>
                        </Col>
                        <Col xs={24} sm={6}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.showModal();
                                }}
                            >
                                <i className="fas fa-map-marker-alt"></i> &nbsp;
                                <FormattedMessage id="order.address" />
                            </Button>
                        </Col>
                    </Row>
                    <Select
                        defaultValue={
                            <FormattedMessage id="order.shipping_address" />
                        }
                        style={{
                            width: '100%',
                        }}
                        onChange={(e) => {
                            this.props.setStateFromChild('sender_id', e);
                        }}
                        onBlur={() => {
                            this.props.calculateFee();
                        }}
                    >
                        {addressBooks &&
                            addressBooks.map((i) => {
                                return (
                                    <Option
                                        key={i._id}
                                        value={i._id}
                                        style={{
                                            fontSize: '12px',
                                        }}
                                    >
                                        {i.name}
                                    </Option>
                                );
                            })}
                    </Select>
                </Card>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Consignor);

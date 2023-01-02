import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { Layout, Row, Col, Card } from 'antd';
import { Button, Form, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import HeaderTag from '../../../common/HeaderTag/HeaderTag';
import MenuOption from '../../../common/MenuOption/MenuOption';
import SettingOption from '../SettingOption';
import { FormattedMessage } from 'react-intl';
import AddMethodModal from './AddMethodModal';

import momo from '../../../../assets/images/momo.jpg';
import vcb from '../../../../assets/images/vcb.jpg';
import visa from '../../../../assets/images/visa.png';
import mastercard from '../../../../assets/images/mastercard.png';

const { Sider, Content } = Layout;

class PaymentDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isOpenAddModal: false,
        };
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
        return (
            <>
                <AddMethodModal
                    isOpenAddModal={this.state.isOpenAddModal}
                    showModal={this.showModal}
                    handleCancel={this.handleCancel}
                />

                <Layout>
                    <HeaderTag breadcrumb1="Trang chủ" breadcrumb2="Cai dat" />
                    <Layout>
                        <Sider width="256" id="main">
                            <MenuOption />
                        </Sider>
                        <Layout
                            className="layout_background"
                            style={{ padding: '44px 24px 24px' }}
                        >
                            <Sider
                                width={300}
                                style={{ height: 'fit-content' }}
                                className="nav_custom"
                            >
                                <SettingOption />
                            </Sider>
                            <Layout>
                                <Content>
                                    <Card
                                        bordered={false}
                                        className="card_height"
                                    >
                                        <Form layout="vertical" size="large">
                                            <Row
                                                gutter={[16, 24]}
                                                className="gutter-row flex"
                                            >
                                                <Col span={12}>
                                                    <Form.Item
                                                        name="customer_name"
                                                        label="Customer Name"
                                                    >
                                                        <Input defaultValue="Vo The Nguyen"></Input>
                                                    </Form.Item>
                                                </Col>

                                                <Col span={12}>
                                                    <Form.Item
                                                        name="customer_phone"
                                                        label="Customer Phone"
                                                    >
                                                        <Input defaultValue="0905657236"></Input>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row
                                                gutter={[16, 24]}
                                                className="gutter-row flex"
                                            >
                                                <Col span={24}>
                                                    <Form.Item
                                                        name="customer_address"
                                                        label="Customer Address"
                                                    >
                                                        <Input defaultValue="34/18A, duong so 9, kp5 Thu Duc"></Input>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <p>
                                                Phuong thuc thanh toan kha dung:
                                            </p>
                                            <div className="payment_scroll">
                                                <Row className="gutter-row flex row_bg">
                                                    <div className="payment_text">
                                                        <div className="image_box">
                                                            <img
                                                                src={momo}
                                                                alt="Momo"
                                                            />
                                                        </div>

                                                        <p>
                                                            So tai khoan:
                                                            0905657236
                                                        </p>
                                                    </div>
                                                    <div className="payment_arrow">
                                                        <CloseOutlined />
                                                    </div>
                                                </Row>
                                                <Row className="gutter-row flex row_bg">
                                                    <div className="payment_text">
                                                        <div className="image_box">
                                                            <img src={vcb} />
                                                        </div>

                                                        <p>
                                                            So tai khoan:
                                                            0905657236
                                                        </p>
                                                    </div>
                                                    <div className="payment_arrow">
                                                        <CloseOutlined />
                                                    </div>
                                                </Row>
                                                <Row className="gutter-row flex row_bg">
                                                    <div className="payment_text">
                                                        <div className="image_box">
                                                            <img
                                                                src={mastercard}
                                                            />
                                                        </div>

                                                        <p>
                                                            So tai khoan:
                                                            0905657236
                                                        </p>
                                                    </div>
                                                    <div className="payment_arrow">
                                                        <CloseOutlined />
                                                    </div>
                                                </Row>
                                                <Row className="gutter-row flex row_bg">
                                                    <div className="payment_text">
                                                        <div className="image_box">
                                                            <img src={visa} />
                                                        </div>

                                                        <p>
                                                            So tai khoan:
                                                            0905657236
                                                        </p>
                                                    </div>
                                                    <div className="payment_arrow">
                                                        <CloseOutlined />
                                                    </div>
                                                </Row>
                                            </div>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                className="align_right payment_button"
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                type="primary"
                                                className="align_right payment_button payment_add"
                                                style={{ fontSize: '14px' }}
                                                onClick={() => {
                                                    this.showModal();
                                                }}
                                            >
                                                Thêm phương thức thanh toán
                                            </Button>
                                        </Form>
                                    </Card>
                                </Content>
                            </Layout>
                        </Layout>
                    </Layout>
                </Layout>
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentDetail);

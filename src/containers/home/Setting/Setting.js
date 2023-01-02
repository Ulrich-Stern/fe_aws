import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { Layout, Row, Col, Menu, Card } from 'antd';
import { Button, Form, Input } from 'antd';
import { Radio } from 'antd';

import HeaderTag from '../../common/HeaderTag/HeaderTag';
import MenuOption from '../../common/MenuOption/MenuOption';
import SettingOption from './SettingOption';
import { FormattedMessage } from 'react-intl';
import {
    getAllUsersService,
    editUserService,
} from '../../../services/userService';

const { Sider, Content } = Layout;

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            isBusiness: false,
            companyName: '',
            email: '',
            name: '',
            phone: '',
            id_or_tax: '',
        };
    }

    async componentDidMount() {
        try {
            const { userInfo, isLoggedIn, lang } = this.props;
            // console.log('userInfo:', userInfo);
            let userData = await getAllUsersService(userInfo._id);
            // console.log('userData:', userData.user);
            this.bindingDataForm(userData.user);
        } catch (error) {
            console.log('error at setting:', error);
        }
    }

    bindingDataForm(userData) {
        let copyState = { ...this.state };
        copyState.id = userData._id;
        copyState.isBusiness = userData.isBusiness;
        copyState.companyName = userData.companyName;
        copyState.email = userData.email;
        copyState.name = userData.name;
        copyState.id_or_tax = userData.id_or_tax;
        copyState.phone = userData.phone;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    }

    validateInput = () => {
        let arrInput = ['id', 'email', 'name', 'phone'];
        for (let i = 0; i < arrInput.length; i++) {
            // nếu state của trường đó empty thì lỗi
            if (!this.state[arrInput[i]]) {
                alert('Missing parameter: ' + arrInput[i]);
                return false;
            }
        }

        if (this.state.isBusiness == true && this.state.companyName == '') {
            alert('Missing parameter: company name');
            return false;
        }

        if (
            !/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/.test(
                this.state.phone
            )
        ) {
            alert('Phone is not valid');
            return false;
        }
        return true;
    };

    handleOnChangeInput = (e, id) => {
        let copyState = { ...this.state };
        copyState[id] = e.target.value;

        // chỉ khách hàng doanh nghiệp mới có companyName
        if (id == 'isBusiness') {
            if (e.target.value == false) {
                copyState.companyName = '';
            }
        }
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    handleOnClickSave = async () => {
        // console.log('state:', this.state);
        let check = this.validateInput();

        if (check) {
            try {
                let result = await editUserService(this.state);
                if (result.errCode !== 0) {
                    alert(result.errMessage);
                } else {
                    alert('save account successful');
                }
            } catch (error) {
                console.log('error at setting', error);
            }
        }
    };

    render() {
        return (
            <>
                <Layout>
                    <HeaderTag
                        breadcrumb1={<FormattedMessage id="common.dashboard" />}
                        breadcrumb2={<FormattedMessage id="common.setting" />}
                    />
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
                                id="setting_menu"
                            >
                                <SettingOption />
                            </Sider>
                            <Layout>
                                <Content>
                                    <Card bordered={false}>
                                        <Form
                                            layout="vertical"
                                            size="large"
                                            className="form_setting"
                                        >
                                            <Row
                                                gutter={[24, 0]}
                                                className="gutter-row"
                                            >
                                                {/* is business */}
                                                <Col
                                                    // span={12}
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={12}
                                                >
                                                    <Form.Item
                                                        // name="isBusiness"
                                                        label={
                                                            <FormattedMessage id="setting.isBusiness" />
                                                        }
                                                    >
                                                        <Radio.Group
                                                            value={
                                                                this.state
                                                                    .isBusiness
                                                            }
                                                            onChange={(e) => {
                                                                this.handleOnChangeInput(
                                                                    e,
                                                                    'isBusiness'
                                                                );
                                                            }}
                                                        >
                                                            <Radio
                                                                value={false}
                                                            >
                                                                <FormattedMessage id="setting.individual" />
                                                            </Radio>
                                                            <Radio value={true}>
                                                                <FormattedMessage id="setting.company" />
                                                            </Radio>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </Col>

                                                {/* company name */}
                                                <Col
                                                    // span={12}
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={12}
                                                >
                                                    <Form.Item
                                                        // name="customer_company"
                                                        label={
                                                            <FormattedMessage id="setting.customer_company" />
                                                        }
                                                    >
                                                        <Input
                                                            value={
                                                                this.state
                                                                    .companyName
                                                            }
                                                            onChange={(e) => {
                                                                this.handleOnChangeInput(
                                                                    e,
                                                                    'companyName'
                                                                );
                                                            }}
                                                            disabled={
                                                                this.state
                                                                    .isBusiness
                                                                    ? false
                                                                    : true
                                                            }
                                                        ></Input>
                                                    </Form.Item>
                                                </Col>

                                                {/* name */}
                                                <Col
                                                    // span={12}
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={12}
                                                >
                                                    <Form.Item
                                                        // name="customer_name"
                                                        label={
                                                            <FormattedMessage id="setting.customer_name" />
                                                        }
                                                    >
                                                        <Input
                                                            value={
                                                                this.state.name
                                                            }
                                                            onChange={(e) => {
                                                                this.handleOnChangeInput(
                                                                    e,
                                                                    'name'
                                                                );
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                {/* email */}
                                                <Col
                                                    // span={12}
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={12}
                                                >
                                                    <Form.Item
                                                        // name="customer_email"
                                                        label={
                                                            <FormattedMessage id="setting.customer_email" />
                                                        }
                                                    >
                                                        <Input
                                                            value={
                                                                this.state.email
                                                            }
                                                            disabled
                                                        ></Input>
                                                    </Form.Item>
                                                </Col>
                                                {/* phone */}
                                                <Col
                                                    // span={12}
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={12}
                                                >
                                                    <Form.Item
                                                        // name="customer_phone"
                                                        label={
                                                            <FormattedMessage id="setting.customer_phone" />
                                                        }
                                                    >
                                                        <Input
                                                            value={
                                                                this.state.phone
                                                            }
                                                            onChange={(e) => {
                                                                this.handleOnChangeInput(
                                                                    e,
                                                                    'phone'
                                                                );
                                                            }}
                                                        ></Input>
                                                    </Form.Item>
                                                </Col>

                                                {/* tax */}
                                                <Col
                                                    // span={12}
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={12}
                                                >
                                                    <Form.Item
                                                        // name="customer_tax"
                                                        label={
                                                            <FormattedMessage id="setting.customer_tax" />
                                                        }
                                                    >
                                                        <Input
                                                            value={
                                                                this.state
                                                                    .id_or_tax
                                                            }
                                                            onChange={(e) => {
                                                                this.handleOnChangeInput(
                                                                    e,
                                                                    'id_or_tax'
                                                                );
                                                            }}
                                                        ></Input>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Form.Item>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    className="align_right"
                                                    onClick={() => {
                                                        this.handleOnClickSave();
                                                    }}
                                                >
                                                    <FormattedMessage id="setting.save" />
                                                </Button>
                                            </Form.Item>
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
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Setting);

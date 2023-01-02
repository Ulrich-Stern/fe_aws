import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { Layout, Row, Col, Card } from 'antd';
import { Button, Form, Input } from 'antd';

import HeaderTag from '../../common/HeaderTag/HeaderTag';
import MenuOption from '../../common/MenuOption/MenuOption';
import SettingOption from './SettingOption';
import changepass from '../../../assets/images/changepass.jpg';
import { FormattedMessage } from 'react-intl';
import { changePasswordService } from '../../../services/userService';

const { Sider, Content } = Layout;

class ChangePass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.userInfo._id,
            old_password: '',
            new_password: '',
            new_password_again: '',
        };
    }

    validateInput = () => {
        let arrInput = [
            'id',
            'old_password',
            'new_password',
            'new_password_again',
        ];
        for (let i = 0; i < arrInput.length; i++) {
            // return state element if it empty
            if (!this.state[arrInput[i]]) {
                alert('Missing parameter: ' + arrInput[i]);
                return false;
            }
        }

        if (this.state.new_password != this.state.new_password_again) {
            alert('Password again not match new password!');
            return false;
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

    handleOnClickSave = async () => {
        // console.log('state:', this.state);
        let check = this.validateInput();
        if (check) {
            try {
                let result = await changePasswordService(this.state);
                if (result.errCode !== 0) {
                    alert(result.errMessage);
                } else {
                    alert('save new password successful');
                }
            } catch (error) {
                console.log('Error:', error);
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
                                        <Form layout="vertical" size="large">
                                            <Row
                                                gutter={[16, 24]}
                                                className="gutter-row"
                                            >
                                                <Col span={12}>
                                                    <Form.Item
                                                        label={
                                                            <FormattedMessage id="change_password.old_password" />
                                                        }
                                                        value={
                                                            this.state
                                                                .old_password
                                                        }
                                                        onChange={(e) => {
                                                            this.handleOnChangeInput(
                                                                e,
                                                                'old_password'
                                                            );
                                                        }}
                                                    >
                                                        <Input.Password></Input.Password>
                                                    </Form.Item>
                                                    <Form.Item
                                                        label={
                                                            <FormattedMessage id="change_password.new_password" />
                                                        }
                                                        value={
                                                            this.state
                                                                .new_password
                                                        }
                                                        onChange={(e) => {
                                                            this.handleOnChangeInput(
                                                                e,
                                                                'new_password'
                                                            );
                                                        }}
                                                    >
                                                        <Input.Password></Input.Password>
                                                    </Form.Item>
                                                    <Form.Item
                                                        label={
                                                            <FormattedMessage id="change_password.new_password_again" />
                                                        }
                                                        value={
                                                            this.state
                                                                .new_password_again
                                                        }
                                                        onChange={(e) => {
                                                            this.handleOnChangeInput(
                                                                e,
                                                                'new_password_again'
                                                            );
                                                        }}
                                                    >
                                                        <Input.Password></Input.Password>
                                                    </Form.Item>
                                                </Col>

                                                <Col span={12}>
                                                    <img
                                                        src={changepass}
                                                        alt="Logo"
                                                        className="changepass_bg"
                                                    />
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
                                                    <FormattedMessage id="change_password.save" />
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePass);

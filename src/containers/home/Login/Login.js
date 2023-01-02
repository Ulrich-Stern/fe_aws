import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Row } from 'antd';
import { Card, Switch } from 'antd';

import { Typography } from 'antd';

import { Space, Popconfirm } from 'antd';

import {
    FacebookFilled,
    GithubFilled,
    GoogleCircleFilled,
} from '@ant-design/icons';

// import "./Login.scss";
import {
    handleLoginService,
    recoveryPasswordService,
} from '../../../services/userService';

import * as actions from '../../../store/actions';
import { toast } from 'react-toastify';

const { Title } = Typography;

// const onFinish = (values) => {
//     console.log('Received values of form: ', values);
// };

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isShowPassword: false,
        };
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value,
        });
    };

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value,
        });
    };

    handleLogin = async () => {
        try {
            let data = await handleLoginService(
                this.state.email,
                this.state.password
            );
            // trường hộp bị email không tồn tại
            // phải cấu hình file axios.js thì mới chỉ hiển thị response thôi

            if (data && data.errCode !== 0) {
                toast.warning(data.errMessage);
            }
            // đúng pass
            else {
                // lưu người dùng vào redux
                // console.log('trước gọi this.props.userLoginSuccess:', data);
                // cách gọi redux
                this.props.userLoginSuccess(data.userData);
            }
        } catch (error) {
            if (error.response.data) {
                toast.warning(error.response.data.errMessage);
            }
        }
    };

    recoveryPassword = async () => {
        if (!this.state.email) {
            toast.warning('Vui lòng nhập email để lấy lại mật khẩu!');
        } else {
            try {
                let result = await recoveryPasswordService(this.state.email);
                if (result.errCode !== 0) {
                    toast.error(result.errMessage);
                }
                // successful case
                else {
                    toast.success(
                        'Recovery password successful! Please check your email'
                    );
                }
            } catch (error) {
                console.log('Error:', error);
            }
        }
    };

    showError = (err) => {
        toast.warning(err);
    };

    render() {
        return (
            <Card className="login_body" bordered={false}>
                <Row
                    justify="space-around"
                    align="middle"
                    className="frm-login"
                >
                    <Card className="signin-box" bordered={false}>
                        <Card className="signin-header" bordered={false}>
                            <Title level={2}>Đăng nhập</Title>
                            <Space className="signin-method">
                                <FacebookFilled />
                                <GoogleCircleFilled />
                                <GithubFilled />
                            </Space>
                        </Card>
                        <Card bordered={false}>
                            <Form
                                name="normal_login"
                                className="login-form"
                                initialValues={{
                                    remember: true,
                                }}
                                // onFinish={onFinish}
                            >
                                <Form.Item
                                    name="Email"
                                    className="signin-input"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Email!',
                                        },
                                    ]}
                                    value={this.state.email}
                                    onChange={(event) =>
                                        this.handleOnChangeEmail(event)
                                    }
                                >
                                    <Input
                                        className="signin-setheight"
                                        prefix={
                                            <UserOutlined className="site-form-item-icon" />
                                        }
                                        placeholder="Email"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    className="signin-input"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please input your Password!',
                                        },
                                    ]}
                                >
                                    <Input
                                        className="signin-setheight"
                                        prefix={
                                            <LockOutlined className="site-form-item-icon" />
                                        }
                                        type="password"
                                        placeholder="Mật khẩu"
                                        value={this.state.password}
                                        onChange={(event) =>
                                            this.handleOnChangePassword(event)
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    valuePropName="checked"
                                    style={{
                                        width: '377px',
                                    }}
                                >
                                    <Switch
                                        style={{
                                            marginRight: '15px',
                                            marginLeft: '-7px',
                                        }}
                                    />{' '}
                                    Ghi nhớ đăng nhập
                                    <Popconfirm
                                        title={`Bạn có chắc chắn lấy lại mật khẩu ?`}
                                        onConfirm={this.recoveryPassword}
                                        // onCancel={cancel}
                                        okText="Có"
                                        cancelText="Không"
                                    >
                                        <a
                                            className="login-form-forgot"
                                            href=""
                                        >
                                            Quên mật khẩu
                                        </a>
                                    </Popconfirm>
                                </Form.Item>

                                <Form.Item className="signin-button">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        onClick={() => this.handleLogin()}
                                    >
                                        Đăng nhập
                                    </Button>

                                    <div className="signin-signup">
                                        Chưa có tài khoản?{' '}
                                        <a href="/signup">Đăng kí ngay!</a>
                                    </div>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Row>
            </Card>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        // 1 cái event fire 1 dispatch tới redux
        userLoginSuccess: (userInfo) =>
            dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

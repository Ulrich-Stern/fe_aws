import { Layout } from 'antd';
import { Col, Row, Typography, Card } from 'antd';
import React, { Component } from 'react';

import { Button, Form, Input, Radio, Select } from 'antd';

import {
    getAllProvinceVietNamService,
    getAllDistrictByCodeService,
    getAllWardByCodeService,
} from '../../../services/systemService';
import './Signup.scss';
import background from '../../../assets/images/home/signup.jpg';
import { toast } from 'react-toastify';

import { createNewUserService } from '../../../services/userService';

const { Title } = Typography;
const { Option } = Select;

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // store api
            provinces: [],
            districts: [],
            wards: [],
            // input new customer
            userEmail: '',
            userPassword: '',
            userPasswordAgain: '',
            userName: '',
            userPhone: '',

            userProvinceCode: '',
            userProvinceName: '',

            userDistrictCode: '',
            userDistrictName: '',

            userWardCode: '',
            userWardName: '',

            userStreet: '',
            userGender: true,
            userIsBusiness: false,
        };
    }

    // chỉ chạy 1 lần sau khi render, ko phải khi update
    async componentDidMount() {
        try {
            await this.getAllProvinceVietNam();
        } catch (error) {
            console.log('error at sign up:', error);
        }
    }
    // các hàm logic =============================================================
    // lấy tỉnh
    getAllProvinceVietNam = async () => {
        let provincesData = await getAllProvinceVietNamService();
        this.setState({
            provinces: provincesData,
        });
    };
    // lấy quận
    getAllDistrictByCode = async (code) => {
        try {
            let districtData = await getAllDistrictByCodeService(code);
            this.setState({
                districts: districtData,
            });
        } catch (error) {
            console.log('error at sign up:', error);
        }
    };
    // lấy phường
    getAllWardByCode = async (code) => {
        try {
            let wardsData = await getAllWardByCodeService(code);
            this.setState({
                wards: wardsData,
            });
        } catch (error) {
            console.log('error at sign up:', error);
        }
    };

    validateInput = () => {
        let arrInput = [
            'userEmail',
            'userPassword',
            'userPasswordAgain',
            'userName',
            'userPhone',

            'userProvinceCode',
            'userProvinceName',
            'userDistrictName',
            'userDistrictCode',
            'userWardName',
            'userWardCode',
        ];
        for (let i = 0; i < arrInput.length; i++) {
            // nếu state của trường đó empty thì lỗi
            if (!this.state[arrInput[i]]) {
                // alert('Missing parameter: ' + arrInput[i]);
                toast.warning('Thiếu thông tin: ' + arrInput[i]);
                return false;
            }
        }
        if (this.state.userPassword !== this.state.userPasswordAgain) {
            // alert('Password again not match password');
            toast.warning('Mật khẩu không chính xác');
            return false;
        }

        if (
            !/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/.test(
                this.state.userPhone
            )
        ) {
            // alert('Phone is not valid');
            toast.warning('Số điện thoại không hợp lệ');
            return false;
        }

        return true;
    };

    // các hàm event ========================================================================
    // lưu state
    handleOnChangeProvince = async (code, data) => {
        let copyState = { ...this.state };
        copyState['userProvinceCode'] = code;
        copyState['userProvinceName'] = data.children;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
        await this.getAllDistrictByCode(code);
    };

    handleOnChangeDistrict = async (code, data) => {
        let copyState = { ...this.state };
        copyState['userDistrictCode'] = code;
        copyState['userDistrictName'] = data.children;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
        await this.getAllWardByCode(code);
    };

    handleOnChangeWard = async (code, data) => {
        let copyState = { ...this.state };
        copyState['userWardCode'] = code;
        copyState['userWardName'] = data.children;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
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

    handleOnClickDangKy = async () => {
        // console.log('state:', this.state);
        let check = this.validateInput();

        if (check) {
            // call api
            let result = await createNewUserService(this.state);
            if (result.errCode !== 0) {
                alert(result.errMessage);
            } else {
                // alert('create account successful');
                toast.success('Tạo tài khoản thành công');
            }
        }
    };

    render() {
        let provinces = this.state.provinces;
        let districts = this.state.districts;
        let wards = this.state.wards;
        return (
            <Row>
                <Col span={14}>
                    <img src={background} alt="Logo" className="signup_bg" />
                </Col>
                <Col span={10}>
                    <Title level={2} className="signup_title">
                        Đăng ký
                    </Title>
                    <Form
                        labelCol={{
                            span: 5,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        layout="horizontal"
                        size="default"
                        name="signup_form"
                    >
                        <Form.Item label="Email *" name="email">
                            <Input
                                onChange={(e) => {
                                    this.handleOnChangeInput(e, 'userEmail');
                                }}
                                value={this.state.userEmail}
                                type="email"
                            />
                        </Form.Item>

                        <Form.Item label="Mật khẩu *" name="password">
                            <Input.Password
                                onChange={(e) => {
                                    this.handleOnChangeInput(e, 'userPassword');
                                }}
                                value={this.state.userPassword}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Nhập lại mật khẩu *"
                            name="password_again"
                        >
                            <Input.Password
                                onChange={(e) => {
                                    this.handleOnChangeInput(
                                        e,
                                        'userPasswordAgain'
                                    );
                                }}
                                value={this.state.userPasswordAgain}
                            />
                        </Form.Item>

                        <Form.Item label="Họ và tên *" name="userName">
                            <Input
                                onChange={(e) => {
                                    this.handleOnChangeInput(e, 'userName');
                                }}
                                value={this.state.userName}
                            />
                        </Form.Item>

                        <Form.Item label="Số điện thoại *" name="userPhone">
                            <Input
                                onChange={(e) => {
                                    this.handleOnChangeInput(e, 'userPhone');
                                }}
                                value={this.state.userPhone}
                            />
                        </Form.Item>

                        <Form.Item label="Tỉnh/Thành phố *" name="city">
                            <Select
                                onChange={(code, data) => {
                                    this.handleOnChangeProvince(code, data);
                                }}
                                id="city1"
                            >
                                {provinces &&
                                    provinces.map((i) => {
                                        return (
                                            <Option
                                                key={i.code}
                                                value={(i.code, i.data)}
                                                id={'city' + i.code}
                                            >
                                                {i.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Quận/Huyện *" name="district">
                            <Select
                                onChange={(code, data) => {
                                    this.handleOnChangeDistrict(code, data);
                                }}
                                id="district1"
                            >
                                {districts &&
                                    districts.districts &&
                                    districts.districts.map((i) => {
                                        return (
                                            <Option
                                                key={i.code}
                                                value={(i.code, i.data)}
                                                id={'district' + i.code}
                                            >
                                                {i.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Phường/Xã *" name="ward">
                            <Select
                                onChange={(code, data) => {
                                    this.handleOnChangeWard(code, data);
                                }}
                                id="ward1"
                            >
                                {wards &&
                                    wards.wards &&
                                    wards.wards.map((i) => {
                                        return (
                                            <Option
                                                key={i.code}
                                                value={(i.code, i.data)}
                                                id={'ward' + i.code}
                                            >
                                                {i.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Số nhà, đường" name="street">
                            <Input
                                onChange={(e) => {
                                    this.handleOnChangeInput(e, 'userStreet');
                                }}
                                value={this.state.userStreet}
                            />
                        </Form.Item>
                        <Form.Item label="Giới tính" name="userGender">
                            <Radio.Group
                                onChange={(e) => {
                                    this.handleOnChangeInput(e, 'userGender');
                                }}
                                value={this.state.userGender}
                                id="userGender1"
                            >
                                <Radio value={true} id="nam">
                                    {' '}
                                    Nam{' '}
                                </Radio>
                                <Radio value={false} id="nu">
                                    {' '}
                                    Nữ{' '}
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item>
                            <Card
                                title="Loại khách hàng"
                                style={{
                                    width: 300,
                                    marginLeft: 133,
                                }}
                            >
                                <Radio.Group
                                    onChange={(e) => {
                                        this.handleOnChangeInput(
                                            e,
                                            'userIsBusiness'
                                        );
                                    }}
                                    value={this.state.userIsBusiness}
                                    id="userIsBusiness"
                                >
                                    <Radio value={false} id="personal">
                                        {' '}
                                        Cá nhân{' '}
                                    </Radio>
                                    <Radio value={true} id="company">
                                        {' '}
                                        Doanh nghiệp{' '}
                                    </Radio>
                                </Radio.Group>
                            </Card>
                        </Form.Item>

                        <Form.Item className="signup_footer">
                            <p
                                style={{
                                    textAlign: 'center',
                                    marginBottom: '10px',
                                }}
                            >
                                Khi bấm đăng kí, bạn đã đồng ý với{' '}
                                <a href="#"> điều khoản của chúng tôi</a>
                            </p>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="signup_button"
                                onClick={() => {
                                    this.handleOnClickDangKy();
                                }}
                                id="submit"
                            >
                                Đăng ký
                            </Button>
                            <p style={{ textAlign: 'center', marginTop: 10 }}>
                                Đã có tài khoản?{' '}
                                <a href="/login" id="go_login">
                                    {' '}
                                    Đăng nhập ngay
                                </a>
                            </p>
                        </Form.Item>
                    </Form>

                    {/* <ul>
                    {provinces.map((p) => (
                        <li key={p.phone_code}>
                            {p.title} || {p.name}
                        </li>
                    ))}
                </ul> */}
                </Col>
            </Row>
        );
    }
}

export default Signup;

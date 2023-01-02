import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, Link } from 'react-router-dom';
import HeaderTagAdmin from '../../common/HeaderTag/HeaderTagAdmin';
import { toast } from 'react-toastify';
import { RollbackOutlined } from '@ant-design/icons';

import { Card } from 'antd';
import { Typography } from 'antd';
import { Input } from 'antd';
import { Select, Button, Row, Col } from 'antd';
import { Radio, Menu } from 'antd';
import { Popconfirm } from 'antd';

import { Form } from 'antd';

import {
    getAllProvinceVietNamService,
    getAllDistrictByCodeService,
    getAllWardByCodeService,
} from '../../../services/systemService';
import {
    getAllUsersService,
    editUserService,
    deleteUserService,
} from '../../../services/userService';
import { path } from '../../../utils/constant';

const { Title } = Typography;
const { Option } = Select;

class UserManageDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            isError: false,
            provinces: [],
            districts: [],
            wards: [],
            // input new customer
            userEmail: '',
            // userPassword: '',
            // userPasswordAgain: '',
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
            isDelete: false,
            companyName: '',
        };
    }

    async componentDidMount() {
        try {
            // lấy userId từ component cha
            // let locationState = this.props.location.state;
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('userId');
            // let userId = locationState.userId;

            // lấy user theo id
            let usersData = await getAllUsersService(userId);

            // binding data form
            let copyState = { ...this.state };
            copyState.id = userId;
            copyState.user = usersData.user;
            copyState.userEmail = usersData.user.email;
            copyState.userName = usersData.user.name;
            copyState.userPhone = usersData.user.phone;

            copyState.userProvinceCode = usersData.user.addr_city.code;
            copyState.userProvinceName = usersData.user.addr_city.name;

            copyState.userDistrictCode = usersData.user.addr_district.code;
            copyState.userDistrictName = usersData.user.addr_district.name;

            copyState.userWardCode = usersData.user.addr_ward.code;
            copyState.userWardName = usersData.user.addr_ward.name;

            copyState.userStreet = usersData.user.addr_street;
            copyState.userGender = usersData.user.gender;
            copyState.userIsBusiness = usersData.user.isBusiness;
            copyState.isDelete = false;
            copyState.companyName = usersData.companyName;

            this.setState(
                {
                    ...copyState,
                },
                () => {}
            );

            await this.handleDataAddressSelection();
        } catch (error) {
            console.log('eror');
            this.setState({ isError: true });
        }
    }

    // call api -> show data in selection list address
    handleDataAddressSelection = async () => {
        await this.getAllProvinceVietNam();
        await this.getAllDistrictByCode(this.state.userProvinceCode);
        await this.getAllWardByCode(this.state.userDistrictCode);
    };

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
        let arrInput = ['id', 'userEmail', 'userName', 'userPhone'];
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
                this.state.userPhone
            )
        ) {
            alert('Phone is not valid');
            return false;
        }
        return true;
    };

    handleOnClickDelete = async () => {
        let id = this.state.id;

        try {
            let result = await deleteUserService(id);
            if (result.errCode !== 0) {
                toast.error(result.errMessage);
            } else {
                toast.success('Xóa người dùng thành công');
                let isDelete = true;
                this.setState({ ...this.state, isDelete });
            }
        } catch (error) {
            console.log('error at setting', error);
        }
    };

    handleOnClickSave = async () => {
        let check = this.validateInput();

        if (check) {
            try {
                let result = await editUserService(this.state);
                if (result.errCode !== 0) {
                    toast.error(result.errMessage);
                } else {
                    toast.success('Cập nhật thông tin thành công');
                }
            } catch (error) {
                console.log('error at setting', error);
            }
        }
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
        try {
            await this.getAllDistrictByCode(code);
        } catch (error) {
            console.log('Error:', error);
        }
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
        try {
            await this.getAllWardByCode(code);
        } catch (error) {
            console.log('Error:', error);
        }
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

    render() {
        // case: undefined user id
        if (this.state.isError || this.state.isDelete) {
            return <Redirect to="/system/user-manage" />;
        }
        // normal case
        else {
            let provinces = this.state.provinces;
            let districts = this.state.districts;
            let wards = this.state.wards;
            return (
                <>
                    <div className="custom-container">
                        {/* <HeaderTagAdmin
                            breadcrumb1="Quản lý Khách hàng"
                            breadcrumb2="Chi tiết"
                        /> */}
                        <br></br>
                        <Link to={path.USER_MANAGE}>
                            <Button>
                                <RollbackOutlined /> Quay lại
                            </Button>
                        </Link>
                        <br></br>
                        <br></br>

                        <Menu
                            mode="horizontal"
                            className="menu-option"
                            selectedKeys={path.USER_MANAGE_DETAIL}
                        >
                            <Menu.Item key={path.USER_MANAGE_DETAIL}>
                                Chi tiết
                            </Menu.Item>

                            <Menu.Item key={path.USER_ADDR}>
                                <Link
                                    to={
                                        path.USER_ADDR +
                                        '?userId=' +
                                        this.state.id
                                    }
                                >
                                    Sổ địa chỉ{' '}
                                </Link>
                            </Menu.Item>

                            <Menu.Item key={path.USER_PAYMENT}>
                                <Link
                                    to={
                                        path.USER_PAYMENT +
                                        '?userId=' +
                                        this.state.id
                                    }
                                >
                                    Thông tin thanh toán
                                </Link>
                            </Menu.Item>
                        </Menu>

                        <div className="tab-container">
                            <Row gutter={[24, 0]} className="gutter-row">
                                <Col span={3}>
                                    <p>Email</p>
                                </Col>
                                <Col span={10}>
                                    <Input
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'userEmail'
                                            );
                                        }}
                                        value={this.state.userEmail}
                                        type="email"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={[24, 0]} className="gutter-row">
                                <Col span={3}>
                                    <p>Họ và tên</p>
                                </Col>
                                <Col span={10}>
                                    <Input
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'userName'
                                            );
                                        }}
                                        value={this.state.userName}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={[24, 0]} className="gutter-row">
                                <Col span={3}>
                                    <p>Số điện thoại</p>
                                </Col>
                                <Col span={10}>
                                    <Input
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'userPhone'
                                            );
                                        }}
                                        value={this.state.userPhone}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={[24, 0]} className="gutter-row">
                                <Col span={3}>
                                    <p>Tỉnh/Thành phố</p>
                                </Col>
                                <Col span={10}>
                                    <Select
                                        onChange={(code, data) => {
                                            this.handleOnChangeProvince(
                                                code,
                                                data
                                            );
                                        }}
                                        className="select-box"
                                        value={this.state.userProvinceCode}
                                    >
                                        {provinces &&
                                            provinces.map((i) => {
                                                return (
                                                    <Option
                                                        key={i.code}
                                                        value={(i.code, i.data)}
                                                    >
                                                        {i.name}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </Col>
                            </Row>
                            <Row gutter={[24, 0]} className="gutter-row">
                                <Col span={3}>
                                    <p>Quận/Huyện</p>
                                </Col>
                                <Col span={10}>
                                    <Select
                                        onChange={(code, data) => {
                                            this.handleOnChangeDistrict(
                                                code,
                                                data
                                            );
                                        }}
                                        className="select-box"
                                        value={this.state.userDistrictCode}
                                    >
                                        {districts &&
                                            districts.districts &&
                                            districts.districts.map((i) => {
                                                return (
                                                    <Option
                                                        key={i.code}
                                                        value={(i.code, i.data)}
                                                    >
                                                        {i.name}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </Col>
                            </Row>
                            <Row gutter={[24, 0]} className="gutter-row">
                                <Col span={3}>
                                    <p>Phường/Xã</p>
                                </Col>
                                <Col span={10}>
                                    <Select
                                        onChange={(code, data) => {
                                            this.handleOnChangeWard(code, data);
                                        }}
                                        className="select-box"
                                        value={this.state.userWardCode}
                                    >
                                        {wards &&
                                            wards.wards &&
                                            wards.wards.map((i) => {
                                                return (
                                                    <Option
                                                        key={i.code}
                                                        value={(i.code, i.data)}
                                                    >
                                                        {i.name}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </Col>
                            </Row>
                            <Row gutter={[24, 0]} className="gutter-row">
                                <Col span={3}>
                                    <p>Đường</p>
                                </Col>
                                <Col span={10}>
                                    <Input
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'userStreet'
                                            );
                                        }}
                                        value={this.state.userStreet}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={[24, 0]} className="gutter-row">
                                <Col span={3}>
                                    <p>Giới tính</p>
                                </Col>
                                <Col span={10}>
                                    <Radio.Group
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'userGender'
                                            );
                                        }}
                                        value={this.state.userGender}
                                    >
                                        <Radio value={true}> Nam </Radio>
                                        <Radio value={false}> Nữ </Radio>
                                    </Radio.Group>
                                </Col>
                            </Row>

                            <Row gutter={[24, 0]} className="gutter-row">
                                <Col span={3}>
                                    <p>Loại khách hàng</p>
                                </Col>
                                <Col span={10}>
                                    <Radio.Group
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'userIsBusiness'
                                            );
                                        }}
                                        value={this.state.userIsBusiness}
                                    >
                                        <Radio value={false}> Cá nhân </Radio>
                                        <Radio value={true}>
                                            {' '}
                                            Doanh nghiệp{' '}
                                        </Radio>
                                    </Radio.Group>
                                </Col>
                            </Row>

                            <Row gutter={[24, 0]} className="gutter-row">
                                <Col span={3}>
                                    <p>Công ty</p>
                                </Col>
                                <Col span={10}>
                                    <Input
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'companyName'
                                            );
                                        }}
                                        value={
                                            this.state.userIsBusiness
                                                ? this.state.companyName
                                                : ''
                                        }
                                        disabled={
                                            this.state.userIsBusiness
                                                ? false
                                                : true
                                        }
                                    />
                                </Col>
                            </Row>

                            <Row
                                gutter={[24, 0]}
                                className="gutter-row footer-button"
                            >
                                <Col span={13}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="save-button"
                                        onClick={() => {
                                            this.handleOnClickSave();
                                        }}
                                    >
                                        Lưu
                                    </Button>
                                    <Popconfirm
                                        title={`Bạn muốn xóa người dùng này?`}
                                        onConfirm={() => {
                                            this.handleOnClickDelete();
                                        }}
                                        // onCancel={cancel}
                                        okText="Xóa"
                                        cancelText="Không"
                                    >
                                        <Button type="danger" htmlType="button">
                                            Xóa
                                        </Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            <Row
                                gutter={[24, 0]}
                                className="gutter-row footer-button"
                            ></Row>
                        </div>
                    </div>
                </>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManageDetail);

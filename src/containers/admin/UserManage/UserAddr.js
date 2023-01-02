import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, Link } from 'react-router-dom';
import HeaderTagAdmin from '../../common/HeaderTag/HeaderTagAdmin';
import { Menu, Button } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

import { Table } from 'antd';
import { CheckCircleTwoTone, EyeOutlined } from '@ant-design/icons';

import {
    getAllProvinceVietNamService,
    getAllDistrictByCodeService,
    getAllWardByCodeService,
} from '../../../services/systemService';
import { getAddressBookByUserIdService } from '../../../services/addressBookService';
import { path } from '../../../utils/constant';
import ViewMapModal from '../../home/Addressbook/ViewMapModal';
const { Column } = Table;

class UserAddr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            isError: false,
            city: '',
            district: '',
            ward: '',
            dataFromApi: [],
            own_user: '',
            default: false,
            contact_name: '',
            alias: '',
            phone: '',
            addr_street: '',
            status: '',

            //map
            isOpenViewMapModal: false,
            lat: '',
            long: '',
        };
    }

    async componentDidMount() {
        try {
            // lấy userId từ component cha

            // let locationState = this.props.location.state;

            // let userId = locationState.userId;
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('userId');

            // lấy user theo id
            let usersData = await getAddressBookByUserIdService(userId);

            let copyState = { ...this.state };
            copyState.dataFromApi = usersData.addressBook;

            this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
            this.setState({ ...copyState, userId });

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
            city: provincesData,
        });
    };
    // lấy quận
    getAllDistrictByCode = async (code) => {
        try {
            let districtData = await getAllDistrictByCodeService(code);

            this.setState({
                district: districtData,
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
                ward: wardsData,
            });
        } catch (error) {
            console.log('error at sign up:', error);
        }
    };

    showModal = () => {
        this.setState({ isOpenViewMapModal: true });
    };

    handleCancel = () => {
        try {
            this.setState({ isOpenViewMapModal: false });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    openMap = (idx) => {
        let data = this.state.dataFromApi;
        this.setState({ lat: data[idx].lat, long: data[idx].long });
        this.showModal();
    };

    render() {
        // case: undefined user id
        if (this.state.isError) {
            return <Redirect to="/system/user-manage" />;
        }
        // normal case
        else {
            // console.log('state nè', this.state);
            let addressData = this.state.dataFromApi;
            // console.log(addressData);
            // let provinces = this.state.provinces;
            // let districts = this.state.districts;
            // let wards = this.state.wards;
            return (
                <>
                    {/* add modal */}
                    <ViewMapModal
                        // cách kế thừa biến và hàm của cha
                        isOpenAddModal={this.state.isOpenViewMapModal}
                        handleCancel={this.handleCancel}
                        lat={this.state.lat}
                        long={this.state.long}
                    />
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
                            selectedKeys={path.USER_ADDR}
                        >
                            <Menu.Item key={path.USER_MANAGE_DETAIL}>
                                <Link
                                    to={
                                        path.USER_MANAGE_DETAIL +
                                        '?userId=' +
                                        this.state.userId
                                    }
                                >
                                    Chi tiết{' '}
                                </Link>
                            </Menu.Item>

                            <Menu.Item key={path.USER_ADDR}>
                                <Link
                                    to={
                                        path.USER_ADDR +
                                        '?userId=' +
                                        this.state.userId
                                    }
                                >
                                    {' '}
                                    Sổ địa chỉ
                                </Link>
                            </Menu.Item>

                            <Menu.Item key={path.USER_PAYMENT}>
                                <Link
                                    to={
                                        path.USER_PAYMENT +
                                        '?userId=' +
                                        this.state.userId
                                    }
                                >
                                    {' '}
                                    Thông tin thanh toán
                                </Link>
                            </Menu.Item>
                        </Menu>
                        <div className="tab-container">
                            <Table
                                dataSource={addressData}
                                scroll={{
                                    x: 'calc(550px + 50%)',
                                    y: 440,
                                }}
                                size="middle"
                                style={{ height: '540px' }}
                                selectedRowKeys="abc"
                            >
                                <Column
                                    title="#"
                                    key="no"
                                    dataIndex="no"
                                    width="50px"
                                    render={(text, object, index) => index + 1}
                                />
                                <Column
                                    title={
                                        <FormattedMessage id="address_book.default" />
                                    }
                                    key="default"
                                    dataIndex="default"
                                    width="60px"
                                    render={(data) => (
                                        <div>
                                            <center>
                                                {data ? (
                                                    <CheckCircleTwoTone
                                                        twoToneColor="#52c41a"
                                                        style={{
                                                            fontSize: '18px',
                                                        }}
                                                    />
                                                ) : (
                                                    <CheckCircleTwoTone
                                                        twoToneColor="#B0B0B0"
                                                        style={{
                                                            fontSize: '18px',
                                                        }}
                                                    />
                                                )}
                                            </center>
                                        </div>
                                    )}
                                />
                                <Column
                                    title={
                                        <FormattedMessage id="address_book.contact_name" />
                                    }
                                    key="contact_name"
                                    dataIndex="contact_name"
                                    width="100px"
                                    rowSpan="3"
                                    className="moreInfo-listOrder"
                                />
                                <Column
                                    title={
                                        <FormattedMessage id="address_book.alias" />
                                    }
                                    key="alias"
                                    dataIndex="alias"
                                    width="60px"
                                    className="moreInfo-listOrder"
                                />

                                <Column
                                    title={
                                        <FormattedMessage id="address_book.addr_city" />
                                    }
                                    key="addr_city"
                                    dataIndex="addr_city"
                                    width="80px"
                                    render={(data) => <>{data.name}</>}
                                />
                                <Column
                                    title={
                                        <FormattedMessage id="address_book.district" />
                                    }
                                    key="addr_district"
                                    dataIndex="addr_district"
                                    width="80px"
                                    render={(data) => <>{data.name}</>}
                                />
                                <Column
                                    title={
                                        <FormattedMessage id="address_book.ward" />
                                    }
                                    key="addr_ward"
                                    dataIndex="addr_ward"
                                    width="80px"
                                    render={(data) => <>{data.name}</>}
                                />
                                <Column
                                    title={
                                        <FormattedMessage id="address_book.street" />
                                    }
                                    key="street"
                                    dataIndex="addr_street"
                                    width="100px"
                                />
                                <Column
                                    title={
                                        <FormattedMessage id="address_book.phone" />
                                    }
                                    key="phone"
                                    dataIndex="phone"
                                    width="60px"
                                />
                                <Column
                                    title="Trạng thái"
                                    key="status"
                                    dataIndex="status"
                                    width="60px"
                                    render={(data) => (
                                        <center>
                                            {data ? 'Active' : 'Inactive'}
                                        </center>
                                    )}
                                />
                                <Column
                                    title={'Xem map'}
                                    key="__v"
                                    dataIndex="__v"
                                    width="60px"
                                    render={(data) => (
                                        <div>
                                            <center>
                                                <a
                                                    onClick={() => {
                                                        this.openMap(data);
                                                    }}
                                                >
                                                    <EyeOutlined />
                                                </a>
                                            </center>
                                        </div>
                                    )}
                                />
                            </Table>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserAddr);

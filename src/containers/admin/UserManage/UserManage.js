import React, { Component } from 'react';

import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { EditFilled, DeleteOutlined, MailOutlined } from '@ant-design/icons';

import { Table } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';

import { getAllUsersService } from '../../../services/userService';
import { path } from '../../../utils/constant';

const { Column } = Table;

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            data: [],
        };
    }

    async componentDidMount() {
        await this.getAllUsers();
    }

    getAllUsers = async () => {
        try {
            let usersData = await getAllUsersService('all');

            let copyState = { ...this.state };
            copyState.users = usersData.user;
            this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
            await this.initTable();
        } catch (error) {
            console.log('Error:', error);
        }
    };

    initTable() {
        let temp = [];
        let idx = 0;
        this.state.users.forEach((i) => {
            idx++;
            temp.push({
                no: idx,
                contactName: i.name,
                email: i.email,
                gender: i.gender,
                address: i.addr_street,
                city: i.addr_city.name,
                district: i.addr_district.name,
                ward: i.addr_ward.name,
                phone: i.phone,
                id_or_tax: i.id_or_tax,
                companyName: i.companyName,
                confidence_score: i.confidence_score,
                detail: i._id,
                isBusiness: i.isBusiness,
            });
        });
        let copyState = { ...this.state };
        copyState.data = temp;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    }

    render() {
        let data = this.state.data;
        return (
            <>
                <div className="custom-container">
                    <div className="cf-title-02 cf-title-alt-two">
                        <h3>Manage users</h3>
                    </div>
                    <br />
                    <Table
                        // rowSelection={{
                        //     type: 'checkbox',
                        //     ...rowSelection,
                        // }}
                        dataSource={data || null}
                        scroll={{
                            x: 'calc(1000px + 50%)',
                            y: 800,
                        }}
                        size="middle"
                        style={{ height: '79vh' }}
                        // style={{ whiteSpace: "pre" }}
                    >
                        <Column
                            title="#"
                            key="no"
                            dataIndex="no"
                            width="30px"
                        />

                        <Column
                            title="Tên liên hệ"
                            key="contactName"
                            dataIndex="contactName"
                            width="100px"
                            rowSpan="3"
                            className="moreInfo-listOrder"
                        />
                        <Column
                            title="Email"
                            key="email"
                            dataIndex="email"
                            width="160px"
                            className="moreInfo-listOrder"
                            render={(data) => (
                                <>
                                    <MailOutlined /> {data}
                                </>
                            )}
                        />
                        <Column
                            title="Giới tính"
                            key="gender"
                            dataIndex="gender"
                            width="60px"
                            className="moreInfo-listOrder"
                            render={(data) => (
                                <div>
                                    <center>
                                        {data == true ? 'Nam' : 'Nữ'}
                                    </center>
                                </div>
                            )}
                        />
                        <Column
                            title="Địa chỉ"
                            key="address"
                            dataIndex="address"
                            width="100px"
                        />

                        <Column
                            title="Phường/Xã"
                            key="ward"
                            dataIndex="ward"
                            width="120px"
                        />
                        <Column
                            title="Quận/Huyện"
                            key="district"
                            dataIndex="district"
                            width="120px"
                        />
                        <Column
                            title="Tỉnh/Thành phố"
                            key="city"
                            dataIndex="city"
                            width="150px"
                        />
                        <Column
                            title="Sđt liên lạc"
                            key="phone"
                            dataIndex="phone"
                            width="100px"
                        />
                        <Column
                            title="CCCD/Mã số thuế"
                            key="id_or_tax"
                            dataIndex="id_or_tax"
                            width="80px"
                        />
                        <Column
                            title="Công ty"
                            key="isBusiness"
                            dataIndex="isBusiness"
                            width="60px"
                            render={(data) => (
                                <div>
                                    <center>
                                        {data ? (
                                            <CheckCircleTwoTone
                                                twoToneColor="#52c41a"
                                                style={{ fontSize: '18px' }}
                                            />
                                        ) : (
                                            // <i className="far fa-circle"></i>
                                            <CheckCircleTwoTone
                                                twoToneColor="#B0B0B0"
                                                style={{ fontSize: '18px' }}
                                            />
                                        )}
                                    </center>
                                </div>
                            )}
                        />
                        <Column
                            title="Tên công ty"
                            key="companyName"
                            dataIndex="companyName"
                            width="60px"
                        />

                        <Column
                            title="Chi tiết"
                            key="detail"
                            dataIndex="detail"
                            width="60px"
                            fixed="right"
                            render={(userId) => (
                                <center>
                                    {/* <a href="#">
                                        <EditFilled
                                            style={{
                                                fontSize: '18px',
                                                margin: 'auto',
                                            }}
                                        />
                                    </a> */}
                                    <Link
                                        to={
                                            path.USER_MANAGE_DETAIL +
                                            '?userId=' +
                                            userId
                                            // state: { userId: userId },
                                        }
                                    >
                                        <EditFilled
                                            style={{
                                                fontSize: '18px',
                                                margin: 'auto',
                                            }}
                                        />
                                    </Link>
                                </center>
                            )}
                        />
                        <Column
                            title="Xóa"
                            key="delete"
                            dataIndex="delete"
                            width="60px"
                            fixed="right"
                            render={() => (
                                <center>
                                    <a href="#">
                                        <DeleteOutlined
                                            style={{
                                                fontSize: '18px',
                                            }}
                                        />
                                    </a>
                                </center>
                            )}
                        />
                    </Table>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);

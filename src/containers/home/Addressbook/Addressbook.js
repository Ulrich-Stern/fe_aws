import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Layout, Space, Tabs, Select } from 'antd';
import {
    EditFilled,
    StopOutlined,
    CaretRightOutlined,
} from '@ant-design/icons';
import { Col, Row, Button } from 'antd';
import { Card, Typography } from 'antd';

import HeaderTag from '../../common/HeaderTag/HeaderTag';
import MenuOption from '../../common/MenuOption/MenuOption';
import { FormattedMessage } from 'react-intl';
import AddAddressBookModal from './AddAddressBookModal';
import { emitter } from './../../../utils/emitter';
import {
    getAddressBookByUserIdService,
    editAddressBookService,
} from '../../../services/addressBookService';
import TableAddressBook from './TableAddressBook';

const { TabPane } = Tabs;
const { Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const handleChange = (value) => {
    console.log(`selected ${value}`);
};

class Addressbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isOpenAddModal: false,
            addressBookList: [],
            dataFromApi: [],
            addressBookInactiveList: [],
            // in tab Kích hoạt
            activeList: [],
            // in tab Ngưng kích hoạt
            inactiveList: [],
        };
    }

    async componentDidMount() {
        await this.getAddressBookByUserId();
    }

    // call: init or after adding the address book, inactive the address book
    getAddressBookByUserId = async () => {
        try {
            let userId = this.props.userInfo._id;
            let abl = await getAddressBookByUserIdService(userId);
            let copyState = { ...this.state };
            copyState.dataFromApi = abl.addressBook;
            // reset row selection of table checked
            copyState.activeList = [];
            copyState.inactiveList = [];
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
        let tempInactive = [];
        let idx = 0;
        let idxInactive = 0;
        // ordinal numbering for row
        this.state.dataFromApi.forEach((i) => {
            // active case
            if (i.status == true) {
                idx++;
                temp.push({
                    key: i._id,
                    no: idx,
                    default: i.default,
                    contact_name: i.contact_name,
                    alias: i.alias,
                    addr_city: i.addr_city.name,
                    addr_district: i.addr_district.name,
                    addr_ward: i.addr_ward.name,
                    addr_street: i.addr_street,
                    phone: i.phone,
                    map: { lat: i.lat, long: i.long },
                });
            }
            // inactive case
            else {
                idxInactive++;
                tempInactive.push({
                    key: i._id,
                    no: idxInactive,
                    default: i.default,
                    contact_name: i.contact_name,
                    alias: i.alias,
                    addr_city: i.addr_city.name,
                    addr_district: i.addr_district.name,
                    addr_ward: i.addr_ward.name,
                    addr_street: i.addr_street,
                    phone: i.phone,
                    map: { lat: i.lat, long: i.long },
                });
            }
        });
        let copyState = { ...this.state };
        copyState.addressBookList = temp;
        copyState.addressBookInactiveList = tempInactive;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
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

    // handle onchange row
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            activeList: selectedRowKeys,
            // only process active or inactive at a time
            inactiveList: [],
        });
    };

    // handle onchange row for inactive table
    onSelectChangeInactive = (selectedRowKeys, selectedRows) => {
        this.setState({
            inactiveList: selectedRowKeys,
            // only process active or inactive at a time
            activeList: [],
        });
    };

    // Ngưng hoạt động
    handleOnClickInactive = async () => {
        // call api with each selected row
        await this.state.activeList.forEach(async (rowKey) => {
            await this.editAddressBook(rowKey, false);
        });
        alert('Update Address book successfully');
        // update address book list
        await this.getAddressBookByUserId();
    };

    // Kích hoạt
    handleOnClickActive = async () => {
        let response = {};
        // call api with each selected row
        await this.state.inactiveList.forEach(async (rowKey) => {
            response = await this.editAddressBook(rowKey, true);
        });
        alert('Update Address book successfully');
        // update address book list
        await this.getAddressBookByUserId();
    };

    // call api service
    editAddressBook = async (id, status) => {
        try {
            let request = {
                id: id,
                status: status,
            };
            let response = await editAddressBookService(request);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        // rowSelection of table
        const rowSelection = {
            // binding data - like value property
            selectedRowKeys: this.state.activeList,
            // handle click in a check box of the row
            onChange: this.onSelectChange,
        };
        // rowSelection of table inactive
        const rowSelectionInactive = {
            selectedRowKeys: this.state.inactiveList,
            onChange: this.onSelectChangeInactive,
        };

        let activeList = this.state.activeList;

        let inactiveList = this.state.inactiveList;

        return (
            <>
                {/* add modal */}
                <AddAddressBookModal
                    // cách kế thừa biến và hàm của cha
                    isOpenAddModal={this.state.isOpenAddModal}
                    handleCancel={this.handleCancel}
                    getAddressBookByUserIdFromParent={
                        this.getAddressBookByUserId
                    }
                />
                <Layout>
                    <HeaderTag
                        breadcrumb1={<FormattedMessage id="common.dashboard" />}
                        breadcrumb2={
                            <FormattedMessage id="order.address_book" />
                        }
                    />
                    <Layout>
                        <Sider width="256" id="main">
                            <MenuOption />
                        </Sider>
                        <Layout
                            className="site-layout-background"
                            style={{ padding: '0 24px 24px' }}
                        >
                            <Content>
                                <Card
                                    bordered={false}
                                    className="order_header address_card"
                                >
                                    <Title level={2} className="order_title">
                                        <FormattedMessage id="order.address_book" />
                                    </Title>
                                    <Row gutter={[16, 24]}>
                                        <Col span={24}>
                                            <Card size="small">
                                                <Row gutter={[16, 16]}>
                                                    {/* province */}
                                                    {/* <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={24}
                                                        lg={5}
                                                        xl={5}
                                                    >
                                                        <Select
                                                            defaultValue="jack"
                                                            style={{
                                                                width: '100%',
                                                            }}
                                                            onChange={
                                                                handleChange
                                                            }
                                                        >
                                                            <Option value="jack">
                                                                Tỉnh/Thành Phố
                                                            </Option>
                                                            <Option value="lucy">
                                                                TP HCM
                                                            </Option>

                                                            <Option value="Yiminghe">
                                                                TP Hà Nội
                                                            </Option>
                                                            <Option value="Yiminghe2">
                                                                Bình Dương
                                                            </Option>
                                                            <Option value="Yiminghe2">
                                                                ...
                                                            </Option>
                                                        </Select>
                                                    </Col> */}
                                                    {/* district */}
                                                    {/* <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={24}
                                                        lg={5}
                                                        xl={5}
                                                    >
                                                        <Select
                                                            defaultValue="jack"
                                                            style={{
                                                                width: '100%',
                                                            }}
                                                            onChange={
                                                                handleChange
                                                            }
                                                        >
                                                            <Option value="jack">
                                                                Quận/Huyện
                                                            </Option>
                                                            <Option value="lucy">
                                                                TP HCM
                                                            </Option>

                                                            <Option value="Yiminghe">
                                                                TP Hà Nội
                                                            </Option>
                                                            <Option value="Yiminghe2">
                                                                Bình Dương
                                                            </Option>
                                                            <Option value="Yiminghe2">
                                                                ...
                                                            </Option>
                                                        </Select>
                                                    </Col> */}
                                                    {/* ward */}
                                                    {/* <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={24}
                                                        lg={5}
                                                        xl={5}
                                                    >
                                                        <Select
                                                            defaultValue="jack"
                                                            style={{
                                                                width: '100%',
                                                            }}
                                                            onChange={
                                                                handleChange
                                                            }
                                                        >
                                                            <Option value="jack">
                                                                Phường/Xã
                                                            </Option>
                                                            <Option value="lucy">
                                                                TP HCM
                                                            </Option>

                                                            <Option value="Yiminghe">
                                                                TP Hà Nội
                                                            </Option>
                                                            <Option value="Yiminghe2">
                                                                Bình Dương
                                                            </Option>
                                                            <Option value="Yiminghe2">
                                                                ...
                                                            </Option>
                                                        </Select>
                                                    </Col> */}
                                                    {/* buttons */}
                                                    <Col span={24}>
                                                        <Space
                                                            className="button-right"
                                                            size="large"
                                                        >
                                                            {/* <Button
                                                                type="primary"
                                                                size="large"
                                                                icon={
                                                                    <EditFilled />
                                                                }
                                                            >
                                                                Lọc
                                                            </Button> */}
                                                            <Button
                                                                size="large"
                                                                type="primary"
                                                                icon={
                                                                    <EditFilled />
                                                                }
                                                                style={{
                                                                    marginRight:
                                                                        '8px',
                                                                }}
                                                                onClick={() => {
                                                                    this.showModal();
                                                                }}
                                                            >
                                                                <FormattedMessage id="address_book.create_new" />
                                                            </Button>

                                                            {activeList.length >
                                                                0 && (
                                                                <Button
                                                                    type="primary"
                                                                    size="large"
                                                                    icon={
                                                                        <StopOutlined />
                                                                    }
                                                                    style={{
                                                                        background:
                                                                            '#DC3030',
                                                                        borderColor:
                                                                            '#DC3030',
                                                                        color: '#FFFFFF',
                                                                    }}
                                                                    onClick={() => {
                                                                        this.handleOnClickInactive();
                                                                    }}
                                                                >
                                                                    <FormattedMessage id="address_book.inactive" />
                                                                </Button>
                                                            )}

                                                            {inactiveList.length >
                                                                0 && (
                                                                <Button
                                                                    type="primary"
                                                                    size="large"
                                                                    icon={
                                                                        <CaretRightOutlined />
                                                                    }
                                                                    style={{
                                                                        background:
                                                                            '#DC3030',
                                                                        borderColor:
                                                                            '#DC3030',
                                                                        color: '#FFFFFF',
                                                                    }}
                                                                    onClick={() => {
                                                                        this.handleOnClickActive();
                                                                    }}
                                                                >
                                                                    <FormattedMessage id="address_book.active" />
                                                                </Button>
                                                            )}
                                                        </Space>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                        <Col span={24}>
                                            {/* data table */}
                                            <Tabs type="card" size="large">
                                                {/* active */}
                                                <TabPane
                                                    tab={
                                                        <FormattedMessage id="address_book.active" />
                                                    }
                                                    key="1"
                                                >
                                                    <TableAddressBook
                                                        addressBookList={
                                                            this.state
                                                                .addressBookList
                                                        }
                                                        rowSelection={
                                                            rowSelection
                                                        }
                                                    />
                                                </TabPane>
                                                {/* inactive */}
                                                <TabPane
                                                    tab={
                                                        <FormattedMessage id="address_book.inactive" />
                                                    }
                                                    key="2"
                                                >
                                                    <TableAddressBook
                                                        addressBookList={
                                                            this.state
                                                                .addressBookInactiveList
                                                        }
                                                        rowSelection={
                                                            rowSelectionInactive
                                                        }
                                                    />
                                                </TabPane>
                                            </Tabs>
                                        </Col>
                                    </Row>
                                </Card>
                            </Content>
                            <div className="footer-note">
                                <p>
                                    <strong>PN Logistic</strong> - version 1.0
                                </p>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Addressbook);

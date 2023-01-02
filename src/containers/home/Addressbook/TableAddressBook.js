import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CheckCircleTwoTone, EyeOutlined } from '@ant-design/icons';
import { Table } from 'antd';

import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import ViewMapModal from './ViewMapModal';
const { Column } = Table;

class TableAddressBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenViewMapModal: false,
            lat: '',
            long: '',
        };
    }

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

    openMap = (map) => {
        this.setState({ lat: map.lat, long: map.long });
        this.showModal();
    };

    render() {
        let addressBookList = this.props.addressBookList;
        let rowSelection = this.props.rowSelection;
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
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    dataSource={addressBookList}
                    scroll={{
                        x: 'calc(550px + 50%)',
                        y: 440,
                    }}
                    size="middle"
                    style={{ height: '540px' }}
                    selectedRowKeys="abc"
                >
                    <Column title="#" key="no" dataIndex="no" width="20px" />
                    <Column
                        title={<FormattedMessage id="address_book.default" />}
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
                        title={<FormattedMessage id="address_book.alias" />}
                        key="alias"
                        dataIndex="alias"
                        width="60px"
                        className="moreInfo-listOrder"
                    />

                    <Column
                        title={<FormattedMessage id="address_book.addr_city" />}
                        key="addr_city.name"
                        dataIndex="addr_city"
                        width="80px"
                    />
                    <Column
                        title={<FormattedMessage id="address_book.district" />}
                        key="addr_district.name"
                        dataIndex="addr_district"
                        width="80px"
                    />
                    <Column
                        title={<FormattedMessage id="address_book.ward" />}
                        key="addr_ward.name"
                        dataIndex="addr_ward"
                        width="80px"
                    />
                    <Column
                        title={<FormattedMessage id="address_book.street" />}
                        key="street"
                        dataIndex="addr_street"
                        width="100px"
                    />
                    <Column
                        title={<FormattedMessage id="address_book.phone" />}
                        key="phone"
                        dataIndex="phone"
                        width="60px"
                    />
                    <Column
                        title={'Xem map'}
                        key="map"
                        dataIndex="map"
                        width="60px"
                        render={(data) => (
                            <div>
                                <center>
                                    <a
                                        onClick={() => {
                                            this.openMap(data);
                                        }}
                                        id={data.lat}
                                    >
                                        <EyeOutlined />
                                    </a>
                                </center>
                            </div>
                        )}
                    />
                </Table>
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

export default connect(mapStateToProps, mapDispatchToProps)(TableAddressBook);

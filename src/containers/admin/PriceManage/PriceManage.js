import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { Button, Popconfirm, Table } from 'antd';
import { EditFilled, DeleteOutlined } from '@ant-design/icons';
import { emitter } from './../../../utils/emitter';

import { deletePriceService } from '../../../services/priceService';
import { CommonUtils } from '../../../utils';

import EditPriceModal from './Modal/EditPriceModal';
import * as actions from '../../../store/actions';
import AddPriceModal from './Modal/AddPriceModal';

const { Column } = Table;

class PriceManage extends Component {
    state = {
        pricesFromApi: [],
        prices: [],

        // edit
        idInput: '',
        isOpenEditModal: false,

        isOpenAddModal: false,
    };

    async componentDidMount() {
        this.props.fetchAllPriceRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.pricesRedux !== this.props.pricesRedux) {
            this.setState(
                {
                    prices: this.props.pricesRedux,
                },
                () => {}
            );
        }

        if (prevProps.pricesFromApiRedux !== this.props.pricesFromApiRedux) {
            this.setState(
                {
                    pricesFromApi: this.props.pricesFromApiRedux,
                },
                () => {}
            );
        }
    }

    showModalEdit = (id) => {
        this.setState({ isOpenEditModal: true, idInput: id });
    };

    handleCancelEdit = () => {
        try {
            this.setState({ isOpenEditModal: false });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    initTableFromParent = () => {
        this.props.fetchAllPriceRedux();
    };

    showModal = () => {
        this.setState({ isOpenAddModal: true });
    };

    handleCancel = () => {
        try {
            // call event from child
            emitter.emit('EVENT_CLEAR_ADD_PRICE_MODAL_DATA', {
                id: 'your id',
            });
            this.setState({ isOpenAddModal: false });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    deletePrice = async (id) => {
        try {
            let result = await deletePriceService(id);
            if (result.errCode !== 0) {
                toast.error(result.errMessage);
            }
            // successful case
            else {
                toast.success('Delete price successful');
                await this.initTableFromParent();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        return (
            <div className="custom-container">
                {this.state.isOpenEditModal && (
                    <EditPriceModal
                        isOpenAddModal={this.state.isOpenEditModal}
                        idInput={this.state.idInput}
                        handleCancel={this.handleCancelEdit}
                        initTableFromParent={this.initTableFromParent}
                    />
                )}
                <AddPriceModal
                    isOpenAddModal={this.state.isOpenAddModal}
                    handleCancel={this.handleCancel}
                    initTableFromParent={this.initTableFromParent}
                />
                {/* title */}
                <div className="text-center">
                    <div className="cf-title-02 cf-title-alt-two">
                        <h3>Quản lý bảng giá cước xe</h3>
                    </div>
                </div>
                {/* content */}
                <div>
                    <Button onClick={this.showModal}> Thêm mới </Button>
                    <Table
                        dataSource={
                            this.state.prices.length > 0
                                ? this.state.prices
                                : null
                        }
                        scroll={{
                            x: 'calc(1000px + 50%)',
                            y: 450,
                        }}
                        size="middle"
                        // style={{ height: '600px' }}
                    >
                        {/* <Column
                            title="#"
                            key="no"
                            dataIndex="no"
                            width="30px"
                        /> */}

                        <Column
                            title="Mã code"
                            key="vehicle_code"
                            dataIndex="vehicle_code"
                            width="50px"
                            className="moreInfo-listOrder"
                            render={(data) => <div>{data}</div>}
                        />

                        <Column
                            title="Loại xe"
                            key="vehicle_name"
                            dataIndex="vehicle_name"
                            width="100px"
                            rowSpan="3"
                            className="moreInfo-listOrder"
                            render={(data) => (
                                <>
                                    {data &&
                                    data[0] &&
                                    data[0].type === 'V1' ? (
                                        <div>Xe Container</div>
                                    ) : (
                                        ''
                                    )}
                                    {data &&
                                    data[0] &&
                                    data[0].type === 'V2' ? (
                                        <div>Xe tải thùng kín</div>
                                    ) : (
                                        ''
                                    )}
                                    {data &&
                                    data[0] &&
                                    data[0].type === 'V3' ? (
                                        <div>Xe thùng mui bạt</div>
                                    ) : (
                                        ''
                                    )}
                                    {data &&
                                    data[0] &&
                                    data[0].type === 'V4' ? (
                                        <div>Xe bồn</div>
                                    ) : (
                                        ''
                                    )}
                                </>
                            )}
                        />

                        <Column
                            title="Trọng tải"
                            key="vehicle_name"
                            dataIndex="vehicle_name"
                            width="150px"
                            className="moreInfo-listOrder"
                            render={(data) => (
                                <div>{data && data[0] && data[0].value_vi}</div>
                            )}
                        />

                        <Column
                            title="4 KM đầu"
                            key="price_4"
                            dataIndex="price_4"
                            width="100px"
                            className="moreInfo-listOrder"
                            render={(data) => (
                                <div>
                                    {data ? (
                                        CommonUtils.formattedValue(data)
                                    ) : (
                                        <>0 VNĐ</>
                                    )}
                                </div>
                            )}
                        />

                        <Column
                            title="5KM - 15KM"
                            key="price_5_15"
                            dataIndex="price_5_15"
                            width="100px"
                            className="moreInfo-listOrder"
                            render={(data) => (
                                <div>
                                    {data ? (
                                        CommonUtils.formattedValue(data) + '/km'
                                    ) : (
                                        <>0 VNĐ</>
                                    )}
                                </div>
                            )}
                        />

                        <Column
                            title="16KM - 100KM"
                            key="price_16_100"
                            dataIndex="price_16_100"
                            width="100px"
                            render={(data) => (
                                <div>
                                    {data ? (
                                        CommonUtils.formattedValue(data) + '/km'
                                    ) : (
                                        <>0 VNĐ</>
                                    )}
                                </div>
                            )}
                        />

                        <Column
                            title="> 100KM"
                            key="price_more"
                            dataIndex="price_more"
                            width="250px"
                            render={(data) => (
                                <div>
                                    {data ? (
                                        CommonUtils.formattedValue(data) + '/km'
                                    ) : (
                                        <>0 VNĐ</>
                                    )}
                                </div>
                            )}
                        />

                        <Column
                            title="Chi tiết"
                            key="_id"
                            dataIndex="_id"
                            width="60px"
                            fixed="right"
                            render={(id) => (
                                <center>
                                    <a
                                        onClick={() => {
                                            this.showModalEdit(id);
                                        }}
                                    >
                                        <EditFilled
                                            style={{
                                                fontSize: '18px',
                                                margin: 'auto',
                                                color: '#40A9FF',
                                            }}
                                        />
                                    </a>
                                </center>
                            )}
                        />

                        <Column
                            title="Xóa"
                            key="_id"
                            dataIndex="_id"
                            width="60px"
                            fixed="right"
                            render={(id) => (
                                <center>
                                    <Popconfirm
                                        title={`Bạn có chắc chắn xóa xe?`}
                                        onConfirm={() => {
                                            this.deletePrice(id);
                                        }}
                                        // onCancel={cancel}
                                        okText="Ok"
                                        cancelText="No"
                                    >
                                        <DeleteOutlined
                                            style={{
                                                fontSize: '18px',
                                            }}
                                        />
                                    </Popconfirm>
                                </center>
                            )}
                        />
                    </Table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pricesRedux: state.admin.pricesRedux,
        pricesFromApiRedux: state.admin.pricesFromApiRedux,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllPriceRedux: () => dispatch(actions.fetchAllPrice()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PriceManage);

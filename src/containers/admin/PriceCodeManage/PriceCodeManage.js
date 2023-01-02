import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table } from 'antd';
import { EditFilled } from '@ant-design/icons';

import { CommonUtils, PRICE } from '../../../utils';

import EditPriceCodeModal from './Modal/EditPriceCodeModal';

import { getAllCodeService } from '../../../services/allCodeService';

const { Column } = Table;

class PriceCodeManage extends Component {
    state = {
        priceCodesFromApi: [],

        // edit
        idInput: '',
        isOpenEditModal: false,
    };

    async componentDidMount() {
        // TODO: get price code: %thuế, % hàng đông lạnh, % phí thuê bốc dỡ hàng
        // % phía bảo hiểm
        await this.getAllPriceCode();
    }

    getAllPriceCode = async () => {
        try {
            let priceCode = await getAllCodeService('all', 'PRICE');
            priceCode = priceCode.allCode;

            let copyState = { ...this.state };
            copyState.priceCodesFromApi = priceCode;
            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error: ', error);
        }
    };

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

    render() {
        return (
            <div className="custom-container">
                {this.state.isOpenEditModal && (
                    <EditPriceCodeModal
                        isOpenAddModal={this.state.isOpenEditModal}
                        idInput={this.state.idInput}
                        handleCancel={this.handleCancelEdit}
                        initTableFromParent={this.initTableFromParent}
                        getAllPriceCode={this.getAllPriceCode}
                    />
                )}

                {/* title */}
                <div className="text-center">
                    <div className="cf-title-02 cf-title-alt-two">
                        <h3>Quản lý bảng giá dịch vụ</h3>
                    </div>
                </div>
                {/* content */}
                <Table
                    dataSource={
                        this.state.priceCodesFromApi.length > 0
                            ? this.state.priceCodesFromApi
                            : null
                    }
                    scroll={{
                        x: 'calc(550px + 50%)',
                        y: 450,
                    }}
                    size="middle"
                    style={{ height: '600px' }}
                >
                    <Column
                        title="Mã code"
                        key="key"
                        dataIndex="key"
                        width="70px"
                    />

                    <Column
                        title="Nội dung"
                        key="key"
                        dataIndex="key"
                        width="150px"
                        render={(data) => (
                            <div>{data && PRICE.get(data).name}</div>
                        )}
                    />

                    <Column
                        title="Giá trị"
                        key="value_vi"
                        dataIndex="value_vi"
                        width="50px"
                        render={(data) => (
                            <>
                                {data && +data > 0 ? (
                                    CommonUtils.formattedValueNoVND(data)
                                ) : (
                                    <>...</>
                                )}
                            </>
                        )}
                    />

                    <Column
                        title="Đơn vị"
                        key="key"
                        dataIndex="key"
                        width="100px"
                        render={(data) => (
                            <div>{data && PRICE.get(data).unit}</div>
                        )}
                    />

                    <Column
                        title="Chi tiết"
                        key="_id"
                        dataIndex="_id"
                        width="30px"
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
                </Table>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PriceCodeManage);

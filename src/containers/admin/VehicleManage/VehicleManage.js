import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { Button, Popconfirm, Table, Tag } from 'antd';
import {
    EditFilled,
    DeleteOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';

import {
    getVehicleService,
    deleteVehicleService,
} from '../../../services/vehicleService';
import AddVehicleModal from './Modal/AddVehicleModal';
import { emitter } from './../../../utils/emitter';
import EditVehicleModal from './Modal/EditVehicleModal';
import { VEHICLE_STATUS } from '../../../utils';

const { Column } = Table;

class VehicleManage extends Component {
    state = {
        vehiclesFromApi: [],
        vehicles: [],
        isOpenAddModal: false,

        // edit
        idInput: '',
        isOpenEditModal: false,
    };

    async componentDidMount() {
        await this.getVehicle();
        await this.initTable();
    }

    getVehicle = async () => {
        try {
            let vehicle = await getVehicleService('all');

            let copyState = { ...this.state };
            copyState.vehiclesFromApi = vehicle.vehicle;
            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    initTable = async () => {
        let idx = 0;
        let temp = [];
        this.state.vehiclesFromApi.forEach((i) => {
            idx++;
            temp.push({
                no: idx,
                type: i.value_vi,
                driver: i.driver,
                phone: i.phone,
                license_plates: i.license_plates,
                tonage: i.tonage_vi,
                id: i._id,
                status: i.status,
            });
        });

        let copyState = { ...this.state };
        copyState.vehicles = temp;
        this.setState({ ...copyState }, () => {});
    };

    showModal = () => {
        this.setState({ isOpenAddModal: true });
    };

    handleCancel = () => {
        try {
            // call event from child
            emitter.emit('EVENT_CLEAR_ADD_VEHICLE_MODAL_DATA', {
                id: 'your id',
            });
            this.setState({ isOpenAddModal: false });
        } catch (error) {
            console.log('Error:', error);
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

    deleteVehicle = async (id) => {
        try {
            let result = await deleteVehicleService(id);
            if (result.errCode !== 0) {
                toast.error(result.errMessage);
            }
            // successful case
            else {
                toast.success('Delete vehicle successful');
                await this.getVehicle();
                await this.initTable();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        return (
            <div className="custom-container">
                <AddVehicleModal
                    isOpenAddModal={this.state.isOpenAddModal}
                    handleCancel={this.handleCancel}
                    getVehicleFromParent={this.getVehicle}
                    initTableFromParent={this.initTable}
                />

                {this.state.isOpenEditModal && (
                    <EditVehicleModal
                        isOpenAddModal={this.state.isOpenEditModal}
                        idInput={this.state.idInput}
                        handleCancel={this.handleCancelEdit}
                        getVehicleFromParent={this.getVehicle}
                        initTableFromParent={this.initTable}
                    />
                )}

                {/* title */}
                <div className="text-center">
                    <div className="cf-title-02 cf-title-alt-two">
                        <h3>Qu???n l?? xe</h3>
                    </div>
                </div>
                {/* content */}
                <div>
                    <Button type="primary" onClick={this.showModal}>
                        Add
                    </Button>
                </div>
                <div>
                    <Table
                        dataSource={this.state.vehicles || null}
                        scroll={{
                            x: 'calc(1000px + 50%)',
                            y: 800,
                        }}
                        size="middle"
                        style={{ height: '79vh' }}
                    >
                        <Column
                            title="#"
                            key="no"
                            dataIndex="no"
                            width="30px"
                        />

                        <Column
                            title="Tr???ng th??i"
                            key="status"
                            dataIndex="status"
                            width="60px"
                            render={(data) => (
                                <>
                                    {data === VEHICLE_STATUS.BUSY}
                                    <Tag
                                        color={
                                            data === VEHICLE_STATUS.BUSY
                                                ? 'red'
                                                : 'blue'
                                        }
                                    >
                                        {data === VEHICLE_STATUS.BUSY ? (
                                            <>
                                                <ClockCircleOutlined /> B???n
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircleOutlined /> S???n s??ng
                                            </>
                                        )}
                                    </Tag>
                                </>
                            )}
                        />

                        <Column
                            title="Lo???i xe"
                            key="type"
                            dataIndex="type"
                            width="100px"
                            rowSpan="3"
                            className="moreInfo-listOrder"
                        />
                        <Column
                            title="Tr???ng t???i"
                            key="tonage"
                            dataIndex="tonage"
                            width="150px"
                            className="moreInfo-listOrder"
                        />
                        <Column
                            title="T??i x???"
                            key="driver"
                            dataIndex="driver"
                            width="150px"
                            className="moreInfo-listOrder"
                        />
                        <Column
                            title="S??? ??i???n tho???i"
                            key="phone"
                            dataIndex="phone"
                            width="60px"
                            className="moreInfo-listOrder"
                        />
                        <Column
                            title="Bi???n s??? xe"
                            key="license_plates"
                            dataIndex="license_plates"
                            width="250px"
                        />

                        <Column
                            title="Chi ti???t"
                            key="id"
                            dataIndex="id"
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
                            title="X??a"
                            key="id"
                            dataIndex="id"
                            width="60px"
                            fixed="right"
                            render={(id) => (
                                <center>
                                    <Popconfirm
                                        title={`B???n c?? ch???c ch???n x??a xe?`}
                                        onConfirm={() => {
                                            this.deleteVehicle(id);
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
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(VehicleManage);

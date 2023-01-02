import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { Col, Row, Button, Modal, Select } from 'antd';
import { Input, DatePicker } from 'antd';

import { emitter } from '../../../../utils/emitter';
import { getAllCodeService } from '../../../../services/allCodeService';
import { addVehicleService } from '../../../../services/vehicleService';

const { Option } = Select;

class AddVehicleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicles: [],
            vehicle: 'V1',
            tonages: [],
            tonage: 'V1_A',
            driver: '',
            phone: '',
            license_plates: '',
        };
        // init for listener
        this.listenToEmitter();
    }

    async componentDidMount() {
        await this.getVehicle();
        await this.handleOnChangeVehicle(this.state.vehicle);
        this.listenToEmitter();
    }

    // a listener
    // reset form
    listenToEmitter() {
        // nghe event
        emitter.on('EVENT_CLEAR_ADD_VEHICLE_MODAL_DATA', (data) => {
            this.setState({
                // store api
                vehicle: 'V1',
                tonage: 'V1_A',
                driver: '',
                phone: '',
                license_plates: '',
            });
        });
    }

    getVehicle = async () => {
        try {
            let vhc = await getAllCodeService('all', 'VEHICLES');
            let copyState = { ...this.state };
            copyState.vehicles = vhc.allCode;

            this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
        } catch (error) {
            console.log('Error:', error);
        }
    };

    validateInput = () => {
        let arrInput = [
            'vehicle',
            'tonage',
            'driver',
            'phone',
            'license_plates',
        ];
        for (let i = 0; i < arrInput.length; i++) {
            // return state element if it empty
            if (!this.state[arrInput[i]]) {
                toast.warning('Missing parameter: ' + arrInput[i]);
                return false;
            }
        }

        return true;
    };

    handleOnChangeVehicle = async (key) => {
        try {
            let tng = await getAllCodeService('all', key);
            let copyState = { ...this.state };
            copyState.tonages = tng.allCode;
            copyState.vehicle = key;

            this.setState(
                {
                    ...copyState,
                },
                () => {}
            );
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeTonage = (key) => {
        let copyState = { ...this.state };
        copyState.tonage = key;
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

    addNewVehicle = async () => {
        try {
            let check = this.validateInput();
            if (check) {
                let result = await addVehicleService(this.state);
                if (result.errCode !== 0) {
                    toast.error(result.errMessage);
                }
                // successful case
                else {
                    toast.success('Save vehicle successful');
                    await this.props.getVehicleFromParent();
                    await this.props.initTableFromParent();
                    await this.props.handleCancel();
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        let vehicles = this.state.vehicles;
        let tonages = this.state.tonages;
        return (
            <>
                <div className="text-center">
                    <Modal
                        // syntax calls props from parent.
                        // Note: this function is defined by the parent,
                        // runs in the parent, the child only calls it
                        visible={this.props.isOpenAddModal}
                        onOk={this.handleOk}
                        onCancel={this.props.handleCancel}
                        footer={[
                            <Button
                                key="back"
                                onClick={this.props.handleCancel}
                            >
                                Cancel
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                onClick={() => {
                                    this.addNewVehicle();
                                }}
                            >
                                Submit
                            </Button>,
                        ]}
                        width={711}
                    >
                        {/* modal content */}
                        <h2>Thêm mới xe</h2>
                        <Row gutter={(12, 12)} className="row-address">
                            {/* vehicle type */}
                            <Col span="12" className="col-margin-bottom">
                                <div>
                                    <p>
                                        Chọn loại xe <span>*</span>
                                    </p>
                                    <Select
                                        style={{
                                            width: '100%',
                                        }}
                                        onChange={(key) => {
                                            this.handleOnChangeVehicle(key);
                                        }}
                                        value={this.state.vehicle}
                                    >
                                        {vehicles &&
                                            vehicles.map((i) => {
                                                return (
                                                    <Option
                                                        key={i.key}
                                                        value={i.key}
                                                    >
                                                        {i.value_vi}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </div>
                            </Col>

                            {/* tonage type */}
                            <Col span="12" className="col-margin-bottom">
                                <div>
                                    <p>
                                        Chọn trọng tải <span>*</span>
                                    </p>
                                    <Select
                                        style={{
                                            width: '100%',
                                        }}
                                        onChange={(key) => {
                                            this.handleOnChangeTonage(key);
                                        }}
                                        value={this.state.tonage}
                                    >
                                        {tonages &&
                                            tonages.map((i) => {
                                                return (
                                                    <Option
                                                        key={i.key}
                                                        value={i.key}
                                                    >
                                                        {i.value_vi}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </div>
                            </Col>

                            {/* driver */}
                            <Col span={8} className="col-margin-bottom">
                                <div>
                                    <p>
                                        Tài xế <span>*</span>
                                    </p>
                                    <Input
                                        value={this.state.driver}
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'driver'
                                            );
                                        }}
                                    />
                                </div>
                            </Col>

                            {/* phone */}
                            <Col span={8} className="col-margin-bottom">
                                <div>
                                    <p>
                                        Số điện thoại <span>*</span>
                                    </p>
                                    <Input
                                        value={this.state.phone}
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'phone'
                                            );
                                        }}
                                    />
                                </div>
                            </Col>

                            {/* license plates */}
                            <Col span={8} className="col-margin-bottom">
                                <div>
                                    <p>
                                        Biển số xe <span>*</span>
                                    </p>
                                    <Input
                                        value={this.state.license_plates}
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'license_plates'
                                            );
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Modal>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddVehicleModal);

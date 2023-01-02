import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { Col, Row, Button, Modal, Select } from 'antd';
import { Input, DatePicker } from 'antd';

import {
    getAllProvinceVietNamService,
    getAllDistrictByCodeService,
} from '../../../../../services/systemService';
import { addLogTripService } from '../../../../../services/logTripService';
import { emitter } from '../../../../../utils/emitter';

import { LOG_TRIP_TYPE } from '../../../../../utils';

const { Option } = Select;

class AddLogTripModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTracking: 0,
            trackings: this.props.trackings,
            tracking_id: '',

            provinces: [],
            districts: [],
            userProvinceCode: '',
            userProvinceName: 'Tỉnh/Thành phố',

            userDistrictCode: '',
            userDistrictName: 'Quận/Huyện',

            content: '',
            time: '',
            log_trip_type: '',
            actual_goods_weight: '',
        };
        // init for listener
        this.listenToEmitter();
    }

    async componentDidMount() {
        try {
            let trackings = this.state.trackings;

            await this.getAllProvinceVietNam();
            await this.setState({ tracking_id: trackings[0].key });
        } catch (error) {
            console.log('error at sign up:', error);
        }
    }

    // a listener
    // reset form
    listenToEmitter() {
        // nghe event
        emitter.on('EVENT_CLEAR_ADD_LOG_TRIP_MODAL_DATA', (data) => {
            this.setState({
                // store api
                currentTracking: 0,
                trackings: this.props.trackings,
                tracking_id: '',

                userProvinceCode: '',
                userProvinceName: 'Tỉnh/Thành phố',

                userDistrictCode: '',
                userDistrictName: 'Quận/Huyện',

                content: '',
                time: '',
                log_trip_type: '',
                actual_goods_weight: '',
            });
        });
    }

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

    handleOnChangeVehicleTracking = async (idx) => {
        try {
            let trackings = this.state.trackings;

            let tracking_id = trackings[idx].key;

            let copyState = { ...this.state };
            copyState.currentTracking = idx;
            copyState.tracking_id = tracking_id;
            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
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

    handleOnChangeTime = (e, id) => {
        let copyState = { ...this.state };
        copyState[id] = e;
        this.setState({ ...copyState }, () => {});
    };

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
    };

    validateInput = () => {
        let arrInput = ['time', 'tracking_id', 'log_trip_type'];
        for (let i = 0; i < arrInput.length; i++) {
            // return state element if it empty
            if (!this.state[arrInput[i]]) {
                if (arrInput[i] === 'time') {
                    toast.warning('Chưa chọn thời gian bốc/dỡ');
                    return false;
                } else if (arrInput[i] === 'tracking_id') {
                    toast.warning('Chưa chọn xe');
                    return false;
                } else if (arrInput[i] === 'log_trip_type') {
                    toast.warning('Chưa chọn nội dung');
                    return false;
                }
            }
        }

        return true;
    };

    setStateFromChild = (id, value) => {
        let copyState = { ...this.state };
        copyState[id] = value;
        this.setState({ ...copyState }, () => {});
    };

    addNewLogTrip = async () => {
        try {
            let check = this.validateInput();
            if (check) {
                let result = await addLogTripService(this.state);
                if (result.errCode !== 0) {
                    toast.error(result.errMessage);
                }
                // successful case
                else {
                    toast.success('Save log trip successful');
                    await this.props.refreshAfterAddLogTrip();
                    await this.props.handleCancel();
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        let trackings = this.props.trackings;

        let provinces = this.state.provinces;
        let districts = this.state.districts;

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
                                    this.addNewLogTrip();
                                }}
                            >
                                Submit
                            </Button>,
                        ]}
                        width={711}
                    >
                        {/* modal content */}
                        <h2>Thêm log hành trình</h2>
                        <Row gutter={(12, 12)} className="row-address">
                            {/* chon xe */}
                            <Col span={8} className="col-margin-bottom">
                                <div>
                                    <p>
                                        Chọn xe <span></span>
                                    </p>
                                    <Select
                                        style={{
                                            width: '100%',
                                        }}
                                        value={this.state.currentTracking}
                                        onChange={(key) => {
                                            this.handleOnChangeVehicleTracking(
                                                key
                                            );
                                        }}
                                    >
                                        {trackings &&
                                            trackings.map((i) => {
                                                return (
                                                    <Option
                                                        key={i.key}
                                                        value={i.idx}
                                                    >
                                                        Xe số {i.idx + 1}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </div>
                            </Col>

                            <Col span={16} className="col-margin-bottom">
                                <div>
                                    <p>
                                        Nội dung <span></span>
                                    </p>

                                    <Select
                                        defaultValue="Chọn xác nhận"
                                        style={{
                                            width: '100%',
                                        }}
                                        value={this.state.log_trip_type}
                                        onChange={(key) => {
                                            this.setStateFromChild(
                                                'log_trip_type',
                                                key
                                            );
                                        }}
                                    >
                                        <Option
                                            key={LOG_TRIP_TYPE.LOADED}
                                            value={LOG_TRIP_TYPE.LOADED}
                                        >
                                            Đã bốc hàng
                                        </Option>

                                        <Option
                                            key={LOG_TRIP_TYPE.UNLOADED}
                                            value={LOG_TRIP_TYPE.UNLOADED}
                                        >
                                            Đã dỡ hàng
                                        </Option>
                                        <Option
                                            key={LOG_TRIP_TYPE.OTHER}
                                            value={LOG_TRIP_TYPE.OTHER}
                                        >
                                            Khác
                                        </Option>
                                    </Select>
                                </div>
                            </Col>

                            {/* time */}
                            <Col span={8}>
                                <p>Thời gian bốc/dỡ hàng</p>
                                <DatePicker
                                    format="DD-MM-YYYY HH:mm"
                                    value={this.state.time}
                                    onChange={(e) => {
                                        this.handleOnChangeTime(e, 'time');
                                    }}
                                />
                            </Col>

                            <Col span={16} className="col-margin-bottom">
                                <div>
                                    <p>
                                        Ghi chú <span></span>
                                    </p>
                                    <Input
                                        value={this.state.content}
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'content'
                                            );
                                        }}
                                    />
                                </div>
                            </Col>
                            {this.state.log_trip_type ===
                            LOG_TRIP_TYPE.OTHER ? (
                                <>
                                    {/* Tỉnh/Thành phố */}
                                    <Col span={8} className="col-margin-bottom">
                                        <p>Tỉnh/Thành phố</p>
                                        <Select
                                            // defaultValue="Tỉnh/Thành phố"
                                            style={{
                                                width: '100%',
                                            }}
                                            onChange={(code, data) => {
                                                this.handleOnChangeProvince(
                                                    code,
                                                    data
                                                );
                                            }}
                                            value={this.state.userProvinceName}
                                        >
                                            {provinces &&
                                                provinces.map((i) => {
                                                    return (
                                                        <Option
                                                            key={i.code}
                                                            value={
                                                                (i.code, i.data)
                                                            }
                                                        >
                                                            {i.name}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                    </Col>

                                    {/* District */}
                                    <Col span={8}>
                                        <p>Quận/Huyện</p>

                                        <Select
                                            // defaultValue="Quận/Huyện"
                                            style={{
                                                width: '100%',
                                            }}
                                            onChange={(code, data) => {
                                                this.handleOnChangeDistrict(
                                                    code,
                                                    data
                                                );
                                            }}
                                            value={this.state.userDistrictName}
                                        >
                                            {districts &&
                                                districts.districts &&
                                                districts.districts.map((i) => {
                                                    return (
                                                        <Option
                                                            key={i.code}
                                                            value={
                                                                (i.code, i.data)
                                                            }
                                                        >
                                                            {i.name}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                    </Col>
                                </>
                            ) : (
                                <>
                                    <Col
                                        span={24}
                                        className="col-margin-bottom"
                                    >
                                        <div>
                                            <p>
                                                Khối lượng hàng hóa thực bốc/dỡ{' '}
                                                <span></span>
                                            </p>
                                            <Input
                                                value={
                                                    this.state
                                                        .actual_goods_weight
                                                }
                                                onChange={(e) => {
                                                    this.handleOnChangeInput(
                                                        e,
                                                        'actual_goods_weight'
                                                    );
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </>
                            )}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddLogTripModal);

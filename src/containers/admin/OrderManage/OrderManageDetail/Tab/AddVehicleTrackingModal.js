import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { Col, Row, Button, Modal, Select } from 'antd';

import { getVehicleService } from '../../../../../services/vehicleService';
import { addTrackingService } from '../../../../../services/trackingService';

import { VEHICLE_STATUS } from '../../../../../utils';

const { Option } = Select;

class AddVehicleTrackingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order_id: this.props.order_id,
            vehicle_code: this.props.vehicle_code,
            vehicles: [],
            vehicle_id: '1',
            orderFromApi: this.props.orderFromApi,
            vehicle_code: this.props.orderFromApi.vehicle_code,
        };
    }

    async componentDidMount() {
        try {
            await this.getVehicleByVechicleCodeService();
        } catch (error) {
            console.log('Error:', error);
        }
    }

    getVehicleByVechicleCodeService = async () => {
        try {
            let vehicle = await getVehicleService(
                'all',
                this.state.vehicle_code
            );

            let temp = vehicle.vehicle;

            // filter get this vehicle_code & status: free
            temp = temp.filter(
                (i) =>
                    i.vehicle_code === this.state.vehicle_code &&
                    i.status === VEHICLE_STATUS.FREE
            );

            let copyState = { ...this.state };
            copyState.vehicles = temp;
            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeVehicleTracking = async (id) => {
        try {
            let copyState = { ...this.state };
            copyState.vehicle_id = id;
            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    addNewTracking = async () => {
        try {
            if (this.state.vehicle_id != '1') {
                let result = await addTrackingService(this.state);
                if (result.errCode !== 0) {
                    toast.error(result.errMessage);
                }
                // successful case
                else {
                    toast.success('Save coordinator successful');
                    await this.props.refreshAfterAddLogTrip();
                    await this.props.handleCancel();
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        let vehicles = this.state.vehicles;

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
                                    this.addNewTracking();
                                }}
                            >
                                Submit
                            </Button>,
                        ]}
                        width={711}
                    >
                        {/* modal content */}
                        <h2>Điều phối xe cho vận đơn này</h2>
                        <Row gutter={(12, 12)} className="row-address">
                            {/* chon xe */}
                            <Col span={24} className="col-margin-bottom">
                                <div>
                                    <p>
                                        Danh sách xe sẵn sàng <span></span>
                                    </p>
                                    <Select
                                        style={{
                                            width: '100%',
                                        }}
                                        value={this.state.vehicle_id}
                                        onChange={(id) => {
                                            this.handleOnChangeVehicleTracking(
                                                id
                                            );
                                        }}
                                    >
                                        <Option key="1">Chọn xe</Option>
                                        {vehicles &&
                                            vehicles.map((i) => {
                                                return (
                                                    <Option
                                                        key={i._id}
                                                        value={i._id}
                                                    >
                                                        {i.value_vi} -{' '}
                                                        {i.license_plates} - Tài
                                                        xế: {i.driver}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddVehicleTrackingModal);

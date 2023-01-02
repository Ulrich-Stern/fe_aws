import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import CurrencyInput from 'react-currency-input-field';

import { Col, Row, Button, Modal, Select } from 'antd';
import { Input, DatePicker } from 'antd';

import { emitter } from '../../../../utils/emitter';
import {
    getAllCodeService,
    getAllCodeByKeyService,
} from '../../../../services/allCodeService';
import { addVehicleService } from '../../../../services/vehicleService';
import {
    getPriceService,
    editPriceService,
} from '../../../../services/priceService';

const { Option } = Select;

class EditPriceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicle_name: '',
            tonage_name: '',
            vehicle_code: 'V1_A',
            price_4: '',
            price_5_15: '',
            price_16_100: '',
            price_more: '',
            id: this.props.idInput,
        };
    }

    async componentDidMount() {
        await this.getPrice();
    }

    getPrice = async () => {
        try {
            let price = await getPriceService(this.state.id);
            price = price.price;

            let tonage = await getAllCodeByKeyService(price.vehicle_code);
            tonage = tonage.allCode;
            tonage = tonage[0];

            let vehicle = await getAllCodeByKeyService(tonage.type);
            vehicle = vehicle.allCode;
            vehicle = vehicle[0];

            let copyState = { ...this.state };
            copyState.price_4 = price.price_4;
            copyState.price_5_15 = price.price_5_15;
            copyState.price_16_100 = price.price_16_100;
            copyState.price_more = price.price_more;
            copyState.vehicle_code = price.vehicle_code;

            copyState.tonage_name = tonage.value_vi;
            copyState.vehicle_name = vehicle.value_vi;

            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    validateInput = () => {
        let arrInput = [
            'price_4',
            'price_5_15',
            'price_16_100',
            'price_more',
            'id',
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

    editPrice = async () => {
        try {
            let check = this.validateInput();
            if (check) {
                let result = await editPriceService(this.state);
                if (result.errCode !== 0) {
                    toast.error(result.errMessage);
                }
                // successful case
                else {
                    toast.success('Save price successful');
                    await this.props.initTableFromParent();
                    await this.props.handleCancel();
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
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
                                    this.editPrice();
                                }}
                            >
                                Submit
                            </Button>,
                        ]}
                        width={711}
                    >
                        {/* modal content */}
                        <h2>Sửa bảng giá cước xe (đơn vị vnđ)</h2>
                        <Row gutter={(12, 12)} className="row-address">
                            {/* vehicle type */}
                            <Col span="8" className="col-margin-bottom">
                                <div>
                                    <p>
                                        Mã code <span>*</span>
                                        <Input
                                            value={this.state.vehicle_code}
                                            disabled
                                        />
                                    </p>
                                </div>
                            </Col>

                            <Col span="8" className="col-margin-bottom">
                                <div>
                                    Loại xe
                                    <Select
                                        style={{
                                            width: '100%',
                                        }}
                                        value={this.state.vehicle_name}
                                        disabled
                                    ></Select>
                                </div>
                            </Col>

                            <Col span="8" className="col-margin-bottom">
                                <div>
                                    Loại trọng tải
                                    <Select
                                        style={{
                                            width: '100%',
                                        }}
                                        value={this.state.tonage_name}
                                        disabled
                                    ></Select>
                                </div>
                            </Col>

                            <Col span="12" className="col-margin-bottom">
                                <div>
                                    <p>
                                        Giá cước &lt; 4km <span>*</span>
                                    </p>
                                </div>
                                <div>
                                    <Input
                                        value={this.state.price_4}
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'price_4'
                                            );
                                        }}
                                    />
                                </div>
                            </Col>

                            <Col span="12" className="col-margin-bottom">
                                <div>
                                    <p>
                                        Giá cước 5 - 15km <span>*</span>{' '}
                                    </p>
                                </div>
                                <div>
                                    <Input
                                        value={this.state.price_5_15}
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'price_5_15'
                                            );
                                        }}
                                    />
                                </div>
                            </Col>

                            <Col span="12" className="col-margin-bottom">
                                <div>
                                    <p>
                                        Giá cước 16 - 100km <span>*</span>{' '}
                                    </p>
                                </div>
                                <div>
                                    <Input
                                        value={this.state.price_16_100}
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'price_16_100'
                                            );
                                        }}
                                    />
                                </div>
                            </Col>

                            <Col span="12" className="col-margin-bottom">
                                <div>
                                    <p>
                                        Giá cước &gt; 100km <span>*</span>
                                    </p>
                                </div>
                                <div>
                                    <Input
                                        value={this.state.price_more}
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'price_more'
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPriceModal);

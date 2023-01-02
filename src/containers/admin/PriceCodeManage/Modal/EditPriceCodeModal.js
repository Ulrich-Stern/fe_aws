import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { Col, Row, Button, Modal, Select, Input } from 'antd';

import { PRICE } from '../../../../utils';

import {
    getAllCodeService,
    editAllCodeService,
} from '../../../../services/allCodeService';

class EditPriceCodeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            priceCode: '',
            name: '',
            unit: '',
            priceValue: '',
            id: this.props.idInput,
            value_vi: '',
            value_en: '',
        };
    }

    async componentDidMount() {
        await this.getPriceCode();
    }

    getPriceCode = async () => {
        try {
            let priceCode = await getAllCodeService(this.state.id);
            priceCode = priceCode.allCode;

            let copyState = { ...this.state };
            copyState.priceCode = priceCode.key;
            copyState.name = PRICE.get(priceCode.key).name;
            copyState.unit = PRICE.get(priceCode.key).unit;
            copyState.priceValue = priceCode.value_vi;

            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error:', error);
        }
    };

    validateInput = () => {
        let arrInput = ['priceCode', 'id', 'value_vi', 'value_en'];
        for (let i = 0; i < arrInput.length; i++) {
            // return state element if it empty
            if (!this.state[arrInput[i]]) {
                toast.warning('Missing parameter: ' + arrInput[i]);
                return false;
            }
        }

        return true;
    };

    setValueViEn = () => {
        try {
            let copyState = { ...this.state };
            copyState.value_vi = this.state.priceValue;
            copyState.value_en = this.state.priceValue;

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

    editPrice = async () => {
        try {
            await this.setValueViEn();
            let check = this.validateInput();
            if (check) {
                let result = await editAllCodeService(this.state);
                if (result.errCode !== 0) {
                    toast.error(result.errMessage);
                }
                // successful case
                else {
                    toast.success('Save price successful');

                    await this.props.handleCancel();
                    await this.props.getAllPriceCode();
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
                        <h2>Sửa bảng giá dịch vụ</h2>
                        <Row gutter={(12, 12)} className="row-address">
                            {/* vehicle type */}
                            <Col span="8" className="col-margin-bottom">
                                <div>
                                    <p>
                                        Mã code <span>*</span>
                                    </p>
                                </div>
                                <div>
                                    <Input
                                        value={this.state.priceCode}
                                        disabled
                                    />
                                </div>
                            </Col>

                            <Col span="16" className="col-margin-bottom">
                                <div>
                                    <p>
                                        Nội dung <span>*</span>
                                    </p>
                                </div>
                                <div>
                                    <Select
                                        style={{
                                            width: '100%',
                                        }}
                                        value={this.state.name}
                                        disabled
                                    ></Select>
                                </div>
                            </Col>

                            <Col span="16" className="col-margin-bottom">
                                <div>
                                    <p>
                                        Giá trị <span>*</span>
                                    </p>
                                </div>
                                <div>
                                    <Input
                                        value={this.state.priceValue}
                                        onChange={(e) => {
                                            this.handleOnChangeInput(
                                                e,
                                                'priceValue'
                                            );
                                        }}
                                    />
                                </div>
                            </Col>

                            <Col span="8" className="col-margin-bottom">
                                <div>
                                    <p>
                                        Đơn vị <span>*</span>
                                    </p>
                                </div>
                                <div>
                                    <Select
                                        style={{
                                            width: '100%',
                                        }}
                                        value={this.state.unit}
                                        disabled
                                    ></Select>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPriceCodeModal);

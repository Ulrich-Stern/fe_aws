import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { Col, Row, Button, Modal } from 'antd';
import { Input } from 'antd';

import { emitter } from '../../../../utils/emitter';

import { addPriceService } from '../../../../services/priceService';

class AddPriceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            vehicle_code: '',
            price_4: '',
            price_5_15: '',
            price_16_100: '',
            price_more: '',
        };
        this.listenToEmitter();
    }

    async componentDidMount() {}

    // a listener
    // reset form
    listenToEmitter() {
        // nghe event
        emitter.on('EVENT_CLEAR_ADD_PRICE_MODAL_DATA', (data) => {
            this.setState({
                name: '',
                vehicle_code: '',
                price_4: '',
                price_5_15: '',
                price_16_100: '',
                price_more: '',
                id: '',
            });
        });
    }

    validateInput = () => {
        let arrInput = [
            'price_4',
            'price_5_15',
            'price_16_100',
            'price_more',
            'name',
            'vehicle_code',
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

    addPrice = async () => {
        try {
            let check = this.validateInput();
            if (check) {
                let result = await addPriceService(this.state);
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
                                    this.addPrice();
                                }}
                            >
                                Submit
                            </Button>,
                        ]}
                        width={711}
                    >
                        {/* modal content */}
                        <h2>Thêm mới giá cước xe (đơn vị vnđ)</h2>
                        <Row gutter={(12, 12)} className="row-address">
                            {/* vehicle type */}
                            <Col span="8" className="col-margin-bottom">
                                <div>
                                    <p>
                                        Mã code <span>*</span>
                                        <Input
                                            value={this.state.vehicle_code}
                                            onChange={(e) => {
                                                this.handleOnChangeInput(
                                                    e,
                                                    'vehicle_code'
                                                );
                                            }}
                                        />
                                    </p>
                                </div>
                            </Col>

                            <Col span="8" className="col-margin-bottom">
                                <div>
                                    Tên loại xe <span>*</span>
                                    <Input
                                        value={this.state.name}
                                        onChange={(e) => {
                                            this.handleOnChangeInput(e, 'name');
                                        }}
                                    />
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

export default connect(mapStateToProps, mapDispatchToProps)(AddPriceModal);

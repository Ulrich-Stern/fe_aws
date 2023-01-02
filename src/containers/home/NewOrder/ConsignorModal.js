import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Input, Select, Switch } from 'antd';
import { Col, Row, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {
    getAllProvinceVietNamService,
    getAllDistrictByCodeService,
    getAllWardByCodeService,
} from '../../../services/systemService';
import { AddBookAddressService } from '../../../services/addressBookService';
import { emitter } from '../../../utils/emitter';
import { LANGUAGE } from '../../../utils';

const { Option } = Select;

class ConsignorModal extends Component {
    // phải có constructor props này thì tk con mới băt được data và function tk cha
    //truyền vào.
    // Mặc định để tránh lỗi mình cứ cho constructor này vào
    constructor(props) {
        super(props);
        this.state = {
            // store api
            provinces: [],
            districts: [],
            wards: [],
            userProvinceCode: '',
            userProvinceName: 'Tỉnh/Thành phố',

            userDistrictCode: '',
            userDistrictName: 'Quận/Huyện',

            userWardCode: '',
            userWardName: 'Phường/Xã',

            own_user: this.props.userInfo._id,
            default: false,
            contact_name: '',
            alias: '',
            phone: '',
            street: '',
        };
        // init for listener
        this.listenToEmitter();
    }

    // a listener
    // reset form
    listenToEmitter() {
        // nghe event
        emitter.on('EVENT_CLEAR_ADD_ADDRESS_BOOK_MODAL_DATA', (data) => {
            this.setState({
                // store api
                districts: [],
                wards: [],
                userProvinceCode: '',
                userProvinceName: 'Tỉnh/Thành phố',

                userDistrictCode: '',
                userDistrictName: 'Quận/Huyện',

                userWardCode: '',
                userWardName: 'Phường/Xã',

                default: false,
                contact_name: '',
                alias: '',
                phone: '',
                street: '',
            });
        });
    }

    async componentDidMount() {
        try {
            await this.getAllProvinceVietNam();
        } catch (error) {
            console.log('error at sign up:', error);
        }
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
    // lấy phường
    getAllWardByCode = async (code) => {
        try {
            let wardsData = await getAllWardByCodeService(code);
            this.setState({
                wards: wardsData,
            });
        } catch (error) {
            console.log('error at sign up:', error);
        }
    };

    validateInput = () => {
        let arrInput = [
            'contact_name',
            'alias',
            'phone',
            'userProvinceCode',
            'userProvinceName',
            'userDistrictCode',
            'userDistrictName',
            'userWardCode',
            'userWardName',
            'street',
        ];
        for (let i = 0; i < arrInput.length; i++) {
            // return state element if it empty
            if (!this.state[arrInput[i]]) {
                alert('Missing parameter: ' + arrInput[i]);
                return false;
            }
        }

        if (
            !/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/.test(
                this.state.phone
            )
        ) {
            alert('Phone is not valid');
            return false;
        }
        return true;
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
        try {
            await this.getAllWardByCode(code);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeWard = async (code, data) => {
        let copyState = { ...this.state };
        copyState['userWardCode'] = code;
        copyState['userWardName'] = data.children;
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

    handleOnChangeIsDefault = (checked) => {
        this.setState({
            default: checked,
        });
    };

    // add address book
    handleClickAdd = async () => {
        try {
            let check = this.validateInput();
            if (check) {
                let result = await AddBookAddressService(this.state);
                // error case
                if (result.errCode !== 0) {
                    alert(result.errMessage);
                }
                // successful case
                else {
                    alert('save address book successful');
                    // update address book list -> choose the current address
                    this.props.chooseAddressUserJustEnteredFromParent();
                    // turn off modal
                    this.props.handleCancel();
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        let provinces = this.state.provinces;
        let districts = this.state.districts;
        let wards = this.state.wards;
        let lang = this.props.lang;
        return (
            <div className="text-center">
                <Modal
                    // syntax calls props from parent.
                    // Note: this function is defined by the parent,
                    // runs in the parent, the child only calls it
                    visible={this.props.isOpenAddModal}
                    onOk={this.handleOk}
                    onCancel={this.props.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.props.handleCancel}>
                            <FormattedMessage id="order.cancel" />
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={() => {
                                this.handleClickAdd();
                            }}
                        >
                            <FormattedMessage id="order.submit" />
                        </Button>,
                    ]}
                    width={711}
                >
                    {/* modal content */}
                    <h2>
                        <FormattedMessage id="order.add_address" />
                    </h2>
                    <Row gutter={(16, 32)} className="row-address">
                        {/* Contact name */}
                        <Col span={24} className="col-margin-bottom">
                            <div>
                                <p>
                                    <FormattedMessage id="order.consignee_name" />{' '}
                                    <span>*</span>
                                </p>
                                <Input
                                    value={this.state.contact_name}
                                    onChange={(e) => {
                                        this.handleOnChangeInput(
                                            e,
                                            'contact_name'
                                        );
                                    }}
                                />
                            </div>
                        </Col>
                        {/* Alias */}
                        <Col xs={24} sm={12} className="col-margin-bottom">
                            <div>
                                <p>
                                    <FormattedMessage id="address_book.alias" />{' '}
                                    <span>*</span>
                                </p>
                                <Input
                                    value={this.state.alias}
                                    onChange={(e) => {
                                        this.handleOnChangeInput(e, 'alias');
                                    }}
                                />
                            </div>
                        </Col>
                        {/* phone */}
                        <Col xs={24} sm={12}>
                            <div>
                                <p>
                                    <FormattedMessage id="address_book.phone" />{' '}
                                    <span>*</span>
                                </p>
                                <Input
                                    value={this.state.phone}
                                    onChange={(e) => {
                                        this.handleOnChangeInput(e, 'phone');
                                    }}
                                />
                            </div>
                        </Col>
                        {/* address */}
                        <Col span={24}>
                            <p>
                                <FormattedMessage id="order.consignee_address" />{' '}
                                <span>*</span>
                            </p>
                        </Col>
                        {/* Province */}
                        <Col xs={24} sm={8} className="col-margin-bottom">
                            <Select
                                // defaultValue="Tỉnh/Thành phố"
                                style={{
                                    width: '100%',
                                }}
                                onChange={(code, data) => {
                                    this.handleOnChangeProvince(code, data);
                                }}
                                value={this.state.userProvinceName}
                            >
                                {provinces &&
                                    provinces.map((i) => {
                                        return (
                                            <Option
                                                key={i.code}
                                                value={(i.code, i.data)}
                                            >
                                                {i.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Col>
                        {/* District */}
                        <Col xs={24} sm={8}>
                            <Select
                                // defaultValue="Quận/Huyện"
                                style={{
                                    width: '100%',
                                }}
                                onChange={(code, data) => {
                                    this.handleOnChangeDistrict(code, data);
                                }}
                                value={this.state.userDistrictName}
                            >
                                {districts &&
                                    districts.districts &&
                                    districts.districts.map((i) => {
                                        return (
                                            <Option
                                                key={i.code}
                                                value={(i.code, i.data)}
                                            >
                                                {i.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Col>
                        {/* Ward */}
                        <Col xs={24} sm={8}>
                            <Select
                                // defaultValue="Phường/Xã"
                                style={{
                                    width: '100%',
                                }}
                                onChange={(code, data) => {
                                    this.handleOnChangeWard(code, data);
                                }}
                                value={this.state.userWardName}
                            >
                                {wards &&
                                    wards.wards &&
                                    wards.wards.map((i) => {
                                        return (
                                            <Option
                                                key={i.code}
                                                value={(i.code, i.data)}
                                            >
                                                {i.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Col>
                        {/* street */}
                        <Col span={24} className="col-margin-bottom col-top">
                            <div>
                                <Input
                                    placeholder={
                                        LANGUAGE.VI === lang
                                            ? 'Số nhà, Đường, ...'
                                            : 'Street'
                                    }
                                    value={this.state.street}
                                    onChange={(e) => {
                                        this.handleOnChangeInput(e, 'street');
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {/* is Default? */}
                        <Col span={24}>
                            <div className="address-note">
                                <div>
                                    <ExclamationCircleOutlined className="icon-custom" />
                                    <p>
                                        <FormattedMessage id="order.defaul_address" />
                                    </p>
                                </div>
                                <Switch
                                    className="btn-switch"
                                    checked={this.state.default}
                                    onChange={(checked) => {
                                        this.handleOnChangeIsDefault(checked);
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { userInfo: state.user.userInfo, lang: state.app.language };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConsignorModal);

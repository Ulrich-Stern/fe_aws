import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Layout,
    Row,
    Col,
    Card,
    DatePicker,
    Typography,
    Button,
    Input,
    Select,
} from 'antd';

import { FormattedMessage } from 'react-intl';
import ConsigneeModal from './ConsigneeModal';
import { getAddressBookService } from '../../../services/addressBookService';
import {
    getAllProvinceVietNamService,
    getAllDistrictByCodeService,
    getAllWardByCodeService,
} from '../../../services/systemService';
import { LANGUAGE } from '../../../utils';

const { Title } = Typography;
const { Option } = Select;

class Consignee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // modal
            isOpenListModal: false,

            // store api
            provinces: [],
            districts: [],
            wards: [],
        };
    }

    getDetailAddressBookById = async (id) => {
        try {
            let data = await getAddressBookService(id);
            return data.ab;
        } catch (error) {
            console.log('Error:', error);
        }
    };

    showAddressConsigneeForm = async (_id) => {
        try {
            // set state receiver_id
            await this.props.setStateFromChild('receiver_id', _id);

            // get data api
            let ab = await this.getDetailAddressBookById(_id);

            // binding data form
            this.props.setStateFromChild(
                'receiver_contact_name',
                ab.contact_name
            );
            this.props.setStateFromChild('receiver_alias', ab.alias);

            this.props.setStateFromChild('receiver_phone', ab.phone);

            this.props.setStateFromChild(
                'receiver_addr_city_code',
                ab.addr_city.code
            );

            this.props.setStateFromChild(
                'receiver_addr_city_name',
                ab.addr_city.name
            );

            this.props.setStateFromChild(
                'receiver_addr_district_code',
                ab.addr_district.code
            );

            this.props.setStateFromChild(
                'receiver_addr_district_name',
                ab.addr_district.name
            );

            this.props.setStateFromChild(
                'receiver_addr_ward_code',
                ab.addr_ward.code
            );

            this.props.setStateFromChild(
                'receiver_addr_ward_name',
                ab.addr_ward.name
            );

            this.props.setStateFromChild(
                'receiver_addr_street',
                ab.addr_street
            );
        } catch (error) {
            console.log('Error:', error);
        }
    };

    showModal = () => {
        this.setState({ isOpenListModal: true });
    };

    handleCancel = async () => {
        try {
            this.setState({ isOpenListModal: false });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    // for form ===================================
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

    // lưu state
    handleOnChangeProvince = async (code, data) => {
        await this.props.setStateFromChild('receiver_addr_city_code', code);
        await this.props.setStateFromChild(
            'receiver_addr_city_name',
            data.children
        );

        try {
            await this.getAllDistrictByCode(code);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeDistrict = async (code, data) => {
        await this.props.setStateFromChild('receiver_addr_district_code', code);
        await this.props.setStateFromChild(
            'receiver_addr_district_name',
            data.children
        );
        try {
            await this.getAllWardByCode(code);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeWard = async (code, data) => {
        await this.props.setStateFromChild('receiver_addr_ward_code', code);
        await this.props.setStateFromChild(
            'receiver_addr_ward_name',
            data.children
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
    //end form =================================

    render() {
        let provinces = this.state.provinces;
        let districts = this.state.districts;
        let wards = this.state.wards;

        let lang = this.props.lang;

        return (
            <>
                {/* add modal */}
                <ConsigneeModal
                    // cách kế thừa biến và hàm của cha
                    isOpenListModal={this.state.isOpenListModal}
                    handleCancel={this.handleCancel}
                    addressBooks={this.props.addressBooks}
                    setStateFromChild={this.props.setStateFromChild}
                    showAddressConsigneeForm={this.showAddressConsigneeForm}
                    calculateFee={this.props.calculateFee}
                />

                <Card>
                    <Row gutter={[12, 12]}>
                        <Col span={17}>
                            <Title level={3}>
                                <FormattedMessage id="order.consignee" />{' '}
                                <span className="required">*</span>
                            </Title>
                        </Col>
                        <Col xs={24} sm={7}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.showModal();
                                }}
                            >
                                <i className="fas fa-map-marker-alt"></i> &nbsp;
                                <FormattedMessage id="order.list_address" />
                            </Button>
                        </Col>
                        {/* Contact name */}
                        <Col xs={24} sm={16}>
                            <Title level={5}>
                                <FormattedMessage id="order.consignee_name" />{' '}
                            </Title>
                            <Input
                                // placeholder={
                                //     <FormattedMessage id="order.consignee_name" />
                                // }
                                placeholder={
                                    LANGUAGE.VI === lang ? 'Họ và tên' : 'Name'
                                }
                                value={this.props.receiver_contact_name}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'receiver_contact_name',
                                        e.target.value
                                    );
                                }}
                            ></Input>
                        </Col>
                        {/* Alias */}
                        <Col xs={24} sm={8}>
                            <Title level={5}>
                                <FormattedMessage id="address_book.alias" />{' '}
                            </Title>
                            <Input
                                placeholder={
                                    LANGUAGE.VI === lang
                                        ? 'Tên gợi nhớ'
                                        : 'Alias'
                                }
                                value={this.props.receiver_alias}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'receiver_alias',
                                        e.target.value
                                    );
                                }}
                            ></Input>
                        </Col>
                        {/* Street */}
                        <Col xs={24} sm={16}>
                            <Title level={5}>
                                <FormattedMessage id="order.consignee_address" />{' '}
                            </Title>
                            <Input
                                placeholder={
                                    LANGUAGE.VI === lang ? 'Đường' : 'Street'
                                }
                                value={this.props.receiver_addr_street}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'receiver_addr_street',
                                        e.target.value
                                    );
                                }}
                            ></Input>
                        </Col>
                        {/* phone */}
                        <Col xs={24} sm={8}>
                            <Title level={5}>
                                <FormattedMessage id="address_book.phone" />{' '}
                            </Title>
                            <Input
                                placeholder={
                                    LANGUAGE.VI === lang
                                        ? 'Số điện thoại'
                                        : 'Phone'
                                }
                                value={this.props.receiver_phone}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'receiver_phone',
                                        e.target.value
                                    );
                                }}
                            ></Input>
                        </Col>
                        {/* Province */}
                        <Col xs={24} sm={8}>
                            <Title level={5}>
                                <FormattedMessage id="address_book.addr_city" />{' '}
                            </Title>
                            <Select
                                // defaultValue="Tỉnh/Thành phố"
                                style={{
                                    width: '100%',
                                }}
                                onChange={(code, data) => {
                                    this.handleOnChangeProvince(code, data);
                                }}
                                value={this.props.receiver_addr_city_code}
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
                            <Title level={5}>
                                <FormattedMessage id="address_book.district" />{' '}
                            </Title>

                            <Select
                                // defaultValue="Quận/Huyện"
                                style={{
                                    width: '100%',
                                }}
                                onChange={(code, data) => {
                                    this.handleOnChangeDistrict(code, data);
                                }}
                                value={this.props.receiver_addr_district_name}
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
                            <Title level={5}>
                                <FormattedMessage id="address_book.ward" />{' '}
                            </Title>

                            <Select
                                // defaultValue="Phường/Xã"
                                style={{
                                    width: '100%',
                                }}
                                onChange={(code, data) => {
                                    this.handleOnChangeWard(code, data);
                                }}
                                value={this.props.receiver_addr_ward_name}
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
                    </Row>
                </Card>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return { userInfo: state.user.userInfo, lang: state.app.language };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Consignee);

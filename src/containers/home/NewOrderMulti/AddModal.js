import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';

import { PlusCircleOutlined } from '@ant-design/icons';
import {
    Button,
    Typography,
    Select,
    Input,
    InputNumber,
    Row,
    Col,
    Card,
    Modal,
} from 'antd';

import ConsigneeModal from './ConsigneeModal';

import { getAddressBookService } from '../../../services/addressBookService';
import {
    getAllProvinceVietNamService,
    getAllDistrictByCodeService,
    getAllWardByCodeService,
} from '../../../services/systemService';
import { CommonUtils, dateFormat } from '../../../utils';

const { Option } = Select;
const { Title } = Typography;

class AddModal extends Component {
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
    async handleClickChoose(_id) {
        await this.props.handleCancel();
        await this.props.showAddressConsigneeForm(_id);
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

    // l???y t???nh
    getAllProvinceVietNam = async () => {
        let provincesData = await getAllProvinceVietNamService();
        this.setState({
            provinces: provincesData,
        });
    };
    // l???y qu???n
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
    // l???y ph?????ng
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

    // l??u state
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

    validateInput = () => {
        let arrInput = [
            'receiver_contact_name',
            'receiver_alias',
            'receiver_phone',
            'receiver_addr_city_code',
            'receiver_addr_city_name',
            'receiver_addr_district_code',
            'receiver_addr_district_name',
            'receiver_addr_ward_code',
            'receiver_addr_ward_name',
            'receiver_addr_street',
            'number_of_vehicle',
            'pickup_date',
        ];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.props[arrInput[i]]) {
                if (!this.state['pickup_date']) {
                    toast.warning('Ch??a ch???n th???i gian b???c h??ng');
                    //
                } else {
                    toast.warning('Ch??a nh???p ?????y ????? th??ng tin ng?????i nh???n');
                }

                return false;
            }
        }

        return true;
    };

    handleOnClickAddReceiver = async () => {
        try {
            let check = this.validateInput();
            if (check) {
                var returned_endate = moment(this.props.pickup_date).add(
                    24,
                    'hours'
                );
                await this.props.setStateFromChild(
                    'intend_time',
                    returned_endate
                );

                let current_receiver = {
                    // key: this.props.key_receiver,
                    key: Math.floor(Math.random() * 10000),

                    receiver_id: this.props.receiver_id,

                    address: {
                        receiver_contact_name: this.props.receiver_contact_name,
                        receiver_alias: this.props.receiver_alias,
                        receiver_phone: this.props.receiver_phone,

                        address: `${this.props.receiver_addr_street}, ${this.props.receiver_addr_ward_name}, ${this.props.receiver_addr_district_name}, ${this.props.receiver_addr_city_name}`,

                        receiver_addr_city_code:
                            this.props.receiver_addr_city_code,
                        receiver_addr_city_name:
                            this.props.receiver_addr_city_name,
                        receiver_addr_district_code:
                            this.props.receiver_addr_district_code,
                        receiver_addr_district_name:
                            this.props.receiver_addr_district_name,
                        receiver_addr_ward_code:
                            this.props.receiver_addr_ward_code,
                        receiver_addr_ward_name:
                            this.props.receiver_addr_ward_name,

                        receiver_addr_street: this.props.receiver_addr_street,
                    },

                    number_of_vehicle: this.props.number_of_vehicle,
                    total_price: this.props.total_price,
                    intend_time: returned_endate,
                };

                await this.props.addReceiverList(current_receiver);
                setTimeout(() => {
                    this.props.handleCancel();
                }, 1000);

                toast.success('Add receiver successfully!');
                // await this.props.calculateFee();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };
    //end form =================================

    render() {
        let provinces = this.state.provinces;
        let districts = this.state.districts;
        let wards = this.state.wards;

        return (
            <>
                {/* add modal */}
                <ConsigneeModal
                    // c??ch k??? th???a bi???n v?? h??m c???a cha
                    isOpenListModal={this.state.isOpenListModal}
                    handleCancel={this.handleCancel}
                    addressBooks={this.props.addressBooks}
                    setStateFromChild={this.props.setStateFromChild}
                    showAddressConsigneeForm={this.showAddressConsigneeForm}
                />

                <Modal
                    title="Th??m ??i???m d??? h??ng m???i"
                    visible={this.props.isOpenAddModal}
                    // onOk={this.props.closeAddModal}
                    onCancel={this.props.handleCancel}
                    bodyStyle={{ backgroundColor: '#F2F4F5' }}
                    width={700}
                    footer={[
                        <Button
                            type="primary"
                            onClick={() => {
                                this.handleOnClickAddReceiver();
                            }}
                        >
                            <PlusCircleOutlined />
                            Th??m ??i???m d??? h??ng
                        </Button>,
                        <Button
                            type="primary"
                            onClick={() => {
                                this.props.handleCancel();
                            }}
                        >
                            Tho??t
                        </Button>,
                    ]}
                >
                    <Row gutter={[12, 12]}>
                        <Col span={24}>
                            {/* form nh???p ng?????i nh???n */}
                            <Card>
                                <Row gutter={[12, 12]}>
                                    <Col span={17}>
                                        <Title level={3}>Ng?????i nh???n h??ng</Title>
                                    </Col>
                                    <Col span={7}>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                this.showModal();
                                            }}
                                        >
                                            <i className="fas fa-map-marker-alt"></i>{' '}
                                            &nbsp;Danh s??ch ?????a ch???
                                        </Button>
                                    </Col>
                                    {/* Contact name */}
                                    <Col span={16}>
                                        <Title level={5}>
                                            H??? v?? t??n ng?????i nh???n{' '}
                                        </Title>
                                        <Input
                                            placeholder="H??? v?? t??n ng?????i nh???n"
                                            value={
                                                this.props.receiver_contact_name
                                            }
                                            onChange={(e) => {
                                                this.props.setStateFromChild(
                                                    'receiver_contact_name',
                                                    e.target.value
                                                );
                                            }}
                                        ></Input>
                                    </Col>
                                    {/* Alias */}
                                    <Col span={8}>
                                        <Title level={5}>T??n g???i nh??? </Title>
                                        <Input
                                            placeholder="T??n g???i nh???"
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
                                    <Col span={16}>
                                        <Title level={5}>
                                            ?????a ch??? ng?????i nh???n{' '}
                                        </Title>
                                        <Input
                                            placeholder="S??? nh??, t??n ???????ng..."
                                            value={
                                                this.props.receiver_addr_street
                                            }
                                            onChange={(e) => {
                                                this.props.setStateFromChild(
                                                    'receiver_addr_street',
                                                    e.target.value
                                                );
                                            }}
                                        ></Input>
                                    </Col>
                                    {/* phone */}
                                    <Col span={8}>
                                        <Title level={5}>S??? ??i???n tho???i </Title>
                                        <Input
                                            placeholder="S??? ??i???n tho???i"
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
                                    <Col span={8}>
                                        <Title level={5}>T???nh/Th??nh ph??? </Title>
                                        <Select
                                            // defaultValue="T???nh/Th??nh ph???"
                                            style={{
                                                width: '100%',
                                            }}
                                            onChange={(code, data) => {
                                                this.handleOnChangeProvince(
                                                    code,
                                                    data
                                                );
                                            }}
                                            value={
                                                this.props
                                                    .receiver_addr_city_code
                                            }
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
                                        <Title level={5}>Qu???n/Huy???n </Title>

                                        <Select
                                            // defaultValue="Qu???n/Huy???n"
                                            style={{
                                                width: '100%',
                                            }}
                                            onChange={(code, data) => {
                                                this.handleOnChangeDistrict(
                                                    code,
                                                    data
                                                );
                                            }}
                                            value={
                                                this.props
                                                    .receiver_addr_district_name
                                            }
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
                                    {/* Ward */}
                                    <Col span={8}>
                                        <Title level={5}>Ph?????ng/X?? </Title>

                                        <Select
                                            // defaultValue="Ph?????ng/X??"
                                            style={{
                                                width: '100%',
                                            }}
                                            onChange={(code, data) => {
                                                this.handleOnChangeWard(
                                                    code,
                                                    data
                                                );
                                            }}
                                            value={
                                                this.props
                                                    .receiver_addr_ward_name
                                            }
                                        >
                                            {wards &&
                                                wards.wards &&
                                                wards.wards.map((i) => {
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
                                </Row>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card>
                                {/* <Title level={3}>Th??ng tin ????n h??ng</Title> */}
                                <Row gutter={[12, 12]}>
                                    <Title level={3}>
                                        S??? xe thu?? ??i h??nh tr??nh n??y
                                    </Title>
                                    <Col span={8}>
                                        <InputNumber
                                            min={1}
                                            max={100}
                                            defaultValue={1}
                                            style={{ width: '100%' }}
                                            value={this.props.number_of_vehicle}
                                            onChange={(e) => {
                                                this.props.setStateFromChild(
                                                    'number_of_vehicle',
                                                    e
                                                );
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card>
                                <Row gutter={[24, 24]}>
                                    <Col span={12}>
                                        <div>C?????c ph??:</div>
                                        <div>
                                            {this.props.total_price != '' ? (
                                                CommonUtils.formattedValue(
                                                    this.props.total_price
                                                )
                                            ) : (
                                                <div>0 VN??</div>
                                            )}
                                        </div>
                                    </Col>

                                    <Col span={12}>
                                        <div>Th???i gian giao h??ng d??? ki???n:</div>
                                        <div>...</div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddModal);

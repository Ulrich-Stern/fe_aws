import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
    Layout,
    Row,
    Col,
    DatePicker,
    Typography,
    Space,
    Button,
    Select,
    Input,
    Card,
    Popconfirm,
} from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import HeaderTag from '../../common/HeaderTag/HeaderTag';
import MenuOption from '../../common/MenuOption/MenuOption';
import OrderInfo from './OrderInfo';
import { FormattedMessage } from 'react-intl';
import Consignee from './Consignee';
import Consignor from './Consignor';
import PaymentInfo from './PaymentInfo';

import {
    getAllCodeService,
    getAllCodeByKeyService,
} from '../../../services/allCodeService';
import {
    getAddressBookActiveByUserIdService,
    getObjectAddressBookToDisplayService,
} from '../../../services/addressBookService';
import {
    getAllPayerByOwnUserService,
    getObjectPayerToDisplayService,
} from '../../../services/payerService';
import { CommonUtils, dateFormat } from '../../../utils';
import {
    addOrderService,
    addDraftOrderService,
} from '../../../services/orderService';
import { toast } from 'react-toastify';

import {
    getDistanceService,
    getCalcalateFeeService,
    calculateInsuranceService,
} from '../../../services/priceService';

const { Sider, Content, Footer } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

class NewOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsCode: [],
            vehiclesCode: [],
            paymentsCode: [],
            tonnagesCode: [],
            addressBooks: [],
            payers: [],

            // object order
            sender_id: '',
            own_user: this.props.userInfo._id,
            order_code: '',

            sender_id: '',
            receiver_id: '',

            receiver_contact_name: '',
            receiver_alias: '',
            receiver_phone: '',
            receiver_addr_city_code: '',
            receiver_addr_city_name: '',
            receiver_addr_district_code: '',
            receiver_addr_district_name: '',
            receiver_addr_ward_code: '',
            receiver_addr_ward_name: '',

            receiver_addr_street: '',

            // payer
            payer_id: '',
            payment_code: '',
            payment_reference_code: '',

            // gooods info
            weight: '',
            number_package: 1,
            commodity_value: '500000000',
            length: '',
            width: '',
            height: '',
            goods_code: '',

            number_of_vehicle: 1,
            vehicle_code: 'V1',
            tonage_code: '',

            pickup_date: '',
            // finish_date: '',

            is_frozen_storage: false,
            is_danger: false,
            do_buy_insurance: false,
            hire_loading_uploading: false,
            no_empty_container: false,

            description: '',
            cod_fee: '0',
            insurance: '0',
            total_price: '',
            intend_time: '',
            note: '',

            // tính Cước
            distance: '',
            loading_uploading_fee: '',
            cod: '0',

            // price code
            initInsurance: '',
        };
    }

    async componentDidMount() {
        await this.initState();
    }

    initState = async () => {
        let temp = await getAllCodeService('all', 'GOODS');
        let vhc = await getAllCodeService('all', 'VEHICLES');
        let pc = await getAllCodeService('all', 'PAYMENT');
        let vtc = await getAllCodeService('all', 'V1');

        let initInsurance = await getAllCodeByKeyService(
            'INIT_VALUE_INSURANCE'
        );
        initInsurance = initInsurance.allCode;
        initInsurance = initInsurance[0];
        initInsurance = initInsurance.value_vi;

        // handle list of address
        let userId = this.props.userInfo._id;
        let abl = await getAddressBookActiveByUserIdService(userId);
        let addressBooks = await getObjectAddressBookToDisplayService(
            abl.addressBook
        );

        // payer
        let p = await getObjectPayerToDisplayService(this.state.own_user);
        let copyState = { ...this.state };
        copyState['goodsCode'] = temp.allCode;
        copyState['vehiclesCode'] = vhc.allCode;
        copyState['paymentsCode'] = pc.allCode;
        copyState['tonnagesCode'] = vtc.allCode;
        copyState['addressBooks'] = addressBooks;
        copyState['payers'] = p;
        copyState['commodity_value'] = initInsurance;

        this.setState(
            {
                ...copyState,
            },
            () => {
                console.log('state:', this.state);
            }
        );
    };

    setStateFromChild = (id, value) => {
        let copyState = { ...this.state };
        copyState[id] = value;
        this.setState({ ...copyState }, () => {});
    };

    // refresh list of address books
    refreshListOfAddressBook = async () => {
        let userId = this.props.userInfo._id;
        let abl = await getAddressBookActiveByUserIdService(userId);
        let addressBooks = await this.getObjectAddressBooks(abl.addressBook);
        let copyState = { ...this.state };

        copyState['addressBooks'] = addressBooks;

        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    // refresh list of payer
    refreshListOfPayer = async () => {
        let p = await this.getObjectPayers();

        let copyState = { ...this.state };

        copyState['payers'] = p;

        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    refreshNewOrder = () => {
        window.location.reload();
    };

    validateInput = () => {
        let arrInput = [
            'sender_id',
            'own_user',
            // 'do_buy_insurance',
            'goods_code',
            'vehicle_code',
            // 'hire_loading_uploading',
            // 'is_danger',
            // 'is_frozen_storage',
            // 'no_empty_container',
            'number_of_vehicle',
            'number_package',
            'tonage_code',
            'weight',
            'pickup_date',
            // payer
            'payer_id',
            'payment_code',
            // receiver
            'receiver_addr_city_code',

            'receiver_addr_city_name',

            'receiver_addr_district_code',

            'receiver_addr_district_name',

            'receiver_addr_street',

            'receiver_addr_ward_code',

            'receiver_addr_ward_name',

            'receiver_alias',

            'receiver_contact_name',
        ];
        for (let i = 0; i < arrInput.length; i++) {
            // return state element if it empty
            if (!this.state[arrInput[i]]) {
                toast.warning('Missing parameter: ' + arrInput[i]);
                return false;
            }
        }

        if (this.state.do_buy_insurance == true) {
            let commodity_value = this.state.commodity_value;
            if (+commodity_value < 500000000) {
                toast.warning(
                    'Bảo hiểm chỉ áp dụng cho giá trị hàng hóa tối thiểu 500,000,000 VNĐ'
                );
                return;
            }
        }

        return true;
    };

    handleOnClickBookOrder = async () => {
        let check = this.validateInput();
        if (check) {
            try {
                var returned_endate = moment(this.state.pickup_date).add(
                    24,
                    'hours'
                );
                await this.setState({ intend_time: returned_endate });
                let result = await addOrderService(this.state);
                if (result.errCode !== 0) {
                    toast.error(result.errMessage);
                }
                // successful case
                else {
                    await toast.success('save order successful');
                    await this.refreshNewOrder();
                }
            } catch (error) {
                console.log('Error:', error);
            }
        }
    };

    handleOnClickSaveDraftOrder = async () => {
        let check = this.validateInput();
        if (check) {
            try {
                var returned_endate = moment(this.state.pickup_date).add(
                    24,
                    'hours'
                );
                await this.setState({ intend_time: returned_endate });
                let result = await addDraftOrderService(this.state);
                if (result.errCode !== 0) {
                    toast.error(result.errMessage);
                }
                // successful case
                else {
                    await toast.success('save order successful');
                    await this.refreshNewOrder();
                }
            } catch (error) {
                console.log('Error:', error);
            }
        }
    };

    // tính cước
    calculateFee = async () => {
        try {
            let insurance_fee = 0;
            if (this.state.do_buy_insurance == true) {
                let commodity_value = this.state.commodity_value;
                if (+commodity_value < 500000000) {
                    toast.warning(
                        'Bảo hiểm chỉ áp dụng cho giá trị hàng hóa tối thiểu 500,000,000 VNĐ'
                    );
                    return;
                } else {
                    insurance_fee = await calculateInsuranceService(
                        this.state.commodity_value
                    );
                }
            }

            let arrInput = [
                'sender_id',

                'goods_code',
                'vehicle_code',

                'tonage_code',
                'weight',

                // receiver
                'receiver_addr_city_code',

                'receiver_addr_city_name',

                'receiver_addr_district_code',

                'receiver_addr_district_name',

                'receiver_addr_street',

                'receiver_addr_ward_code',

                'receiver_addr_ward_name',

                'receiver_alias',

                'receiver_contact_name',
            ];
            for (let i = 0; i < arrInput.length; i++) {
                // return state element if it empty
                if (!this.state[arrInput[i]]) {
                    return;
                }
            }

            // start calculate fee

            // tính khoảng cách đường đi
            let distance = await getDistanceService(this.state);

            // tính tiền
            let total_fee = await getCalcalateFeeService(
                distance,
                this.state.number_of_vehicle,
                this.state
            );

            // bốc dỡ hàng
            let loading_uploading_fee = '';
            if (this.state.hire_loading_uploading == true) {
                loading_uploading_fee = +this.state.weight * 80000 * 2;
            }

            //cod
            let cod_fee = '';
            if (this.state.cod != '0') {
                cod_fee = +this.state.cod * 0.01;
            }

            let copyState = { ...this.state };
            copyState.distance = distance;
            copyState.total_price = total_fee;
            copyState.insurance_fee = insurance_fee;
            copyState.loading_uploading_fee = loading_uploading_fee.toString();
            copyState.cod_fee = cod_fee.toString();
            this.setState({ ...copyState }, () => {});
            toast.success(
                'PN Logistic báo giá: ' + CommonUtils.formattedValue(total_fee)
            );
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        return (
            <>
                <Layout>
                    <HeaderTag
                        breadcrumb1={<FormattedMessage id="common.dashboard" />}
                        breadcrumb2={<FormattedMessage id="common.new_order" />}
                    />
                    <Layout>
                        <Sider width="256" id="main">
                            <MenuOption />
                        </Sider>
                        <Layout
                            className="site-layout-background-neworder"
                            style={{ padding: '24px 24px' }}
                        >
                            <Content>
                                <Row gutter={[24, 24]}>
                                    {/* right area */}
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={24}
                                        xl={12}
                                    >
                                        <OrderInfo
                                            goodsCode={this.state.goodsCode}
                                            vehiclesCode={
                                                this.state.vehiclesCode
                                            }
                                            tonnagesCode={
                                                this.state.tonnagesCode
                                            }
                                            setStateFromChild={
                                                this.setStateFromChild
                                            }
                                            // order object
                                            weight={this.state.weight}
                                            number_package={
                                                this.state.number_package
                                            }
                                            commodity_value={
                                                this.state.commodity_value
                                            }
                                            length={this.state.length}
                                            width={this.state.width}
                                            height={this.state.height}
                                            //
                                            cod_fee={this.state.cod_fee}
                                            goods_code={this.state.goods_code}
                                            number_of_vehicle={
                                                this.state.number_of_vehicle
                                            }
                                            vehicle_code={
                                                this.state.vehicle_code
                                            }
                                            tonage_code={this.state.tonage_code}
                                            pickup_date={this.state.pickup_date}
                                            is_frozen_storage={
                                                this.state.is_frozen_storage
                                            }
                                            is_danger={this.state.is_danger}
                                            do_buy_insurance={
                                                this.state.do_buy_insurance
                                            }
                                            hire_loading_uploading={
                                                this.state
                                                    .hire_loading_uploading
                                            }
                                            no_empty_container={
                                                this.state.no_empty_container
                                            }
                                            description={this.state.description}
                                            calculateFee={this.calculateFee}
                                            insurance_fee={
                                                this.state.insurance_fee
                                            }
                                            loading_uploading_fee={
                                                this.state.loading_uploading_fee
                                            }
                                        />
                                    </Col>
                                    {/* left area */}
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={24}
                                        xl={12}
                                    >
                                        <Row gutter={[12, 12]}>
                                            {/* Consignor */}
                                            <Col span={24}>
                                                <Consignor
                                                    addressBooks={
                                                        this.state.addressBooks
                                                    }
                                                    // after clicking add -> refresh list address
                                                    refreshListOfAddressBook={
                                                        this
                                                            .refreshListOfAddressBook
                                                    }
                                                    setStateFromChild={
                                                        this.setStateFromChild
                                                    }
                                                    sender_id={
                                                        this.state.sender_id
                                                    }
                                                    calculateFee={
                                                        this.calculateFee
                                                    }
                                                />
                                            </Col>
                                            {/* Consignee */}
                                            <Col span={24}>
                                                <Consignee
                                                    addressBooks={
                                                        this.state.addressBooks
                                                    }
                                                    // after user selects address,
                                                    //receiver_id is assigned with setStateFromChild
                                                    setStateFromChild={
                                                        this.setStateFromChild
                                                    }
                                                    // According to receiver_id,
                                                    //Consignee will render data to form
                                                    receiver_id={
                                                        this.state.receiver_id
                                                    }
                                                    receiver_contact_name={
                                                        this.state
                                                            .receiver_contact_name
                                                    }
                                                    receiver_alias={
                                                        this.state
                                                            .receiver_alias
                                                    }
                                                    receiver_phone={
                                                        this.state
                                                            .receiver_phone
                                                    }
                                                    receiver_addr_city_code={
                                                        this.state
                                                            .receiver_addr_city_code
                                                    }
                                                    receiver_addr_city_name={
                                                        this.state
                                                            .receiver_addr_city_name
                                                    }
                                                    receiver_addr_district_code={
                                                        this.state
                                                            .receiver_addr_district_code
                                                    }
                                                    receiver_addr_district_name={
                                                        this.state
                                                            .receiver_addr_district_name
                                                    }
                                                    receiver_addr_ward_code={
                                                        this.state
                                                            .receiver_addr_ward_code
                                                    }
                                                    receiver_addr_ward_name={
                                                        this.state
                                                            .receiver_addr_ward_name
                                                    }
                                                    receiver_addr_street={
                                                        this.state
                                                            .receiver_addr_street
                                                    }
                                                    calculateFee={
                                                        this.calculateFee
                                                    }
                                                />
                                            </Col>
                                            {/* PaymentInfo */}
                                            <Col span={24}>
                                                <PaymentInfo
                                                    paymentsCode={
                                                        this.state.paymentsCode
                                                    }
                                                    payers={this.state.payers}
                                                    refreshListOfPayer={
                                                        this.refreshListOfPayer
                                                    }
                                                    setStateFromChild={
                                                        this.setStateFromChild
                                                    }
                                                    // order object
                                                    payer_id={
                                                        this.state.payer_id
                                                    }
                                                    payment_code={
                                                        this.state.payment_code
                                                    }
                                                    payment_reference_code={
                                                        this.state
                                                            .payment_reference_code
                                                    }
                                                />
                                            </Col>

                                            <Col span={24}>
                                                <Card>
                                                    <Title level={3}>
                                                        <FormattedMessage id="order.note" />
                                                    </Title>
                                                    <TextArea
                                                        rows={3}
                                                        value={this.state.note}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                note: e.target
                                                                    .value,
                                                            });
                                                        }}
                                                    />
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Content>

                            <br></br>

                            <Footer
                                style={{
                                    position: 'sticky',
                                    bottom: '0',
                                    backgroundColor: 'white',
                                    borderTop: '1px solid black',
                                }}
                            >
                                <Row gutter={[24, 24]}>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={24}
                                        xl={14}
                                    >
                                        {/* Estimated fare */}
                                        <Row gutter={[24, 24]}>
                                            <Col span={6}>
                                                <div>
                                                    <FormattedMessage id="order.distance" />
                                                    :
                                                </div>
                                                <div>
                                                    {this.state.distance
                                                        ? Math.round(
                                                              this.state
                                                                  .distance * 10
                                                          ) /
                                                              10 +
                                                          ' Km'
                                                        : '...'}
                                                </div>
                                            </Col>

                                            <Col span={6}>
                                                <div>
                                                    <FormattedMessage id="order.price" />
                                                    :
                                                </div>
                                                <div>
                                                    {this.state.total_price !=
                                                    '' ? (
                                                        CommonUtils.formattedValue(
                                                            this.state
                                                                .total_price
                                                        )
                                                    ) : (
                                                        <div>0 VNĐ</div>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div>
                                                    <FormattedMessage id="order.cod" />
                                                    :
                                                </div>
                                                <div>
                                                    {this.state.cod_fee ? (
                                                        CommonUtils.formattedValue(
                                                            this.state.cod_fee
                                                        )
                                                    ) : (
                                                        <div>0 VNĐ</div>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div>
                                                    <FormattedMessage id="order.arrive_time" />
                                                    :
                                                </div>
                                                <div>
                                                    {this.state.intend_time !=
                                                    ''
                                                        ? moment(
                                                              this.state
                                                                  .intend_time
                                                          ).format(
                                                              dateFormat.DATE_FORMAT
                                                          )
                                                        : '...'}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    {/* <Col span={5}></Col> */}
                                    {/* Save button */}
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={24}
                                        xl={10}
                                    >
                                        <Space
                                            className="button-right"
                                            size="large"
                                        >
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    this.handleOnClickSaveDraftOrder();
                                                }}
                                                className="blue-btn"
                                            >
                                                <FormattedMessage id="order.save_draft" />
                                            </Button>
                                            <Popconfirm
                                                title={`Xác nhận đặt đơn?`}
                                                onConfirm={() => {
                                                    this.handleOnClickBookOrder();
                                                }}
                                                // onCancel={cancel}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button type="primary">
                                                    <FormattedMessage id="order.confirm" />
                                                </Button>
                                            </Popconfirm>

                                            <Button
                                                onClick={this.refreshNewOrder}
                                                className="btn-refresh"
                                            >
                                                <SyncOutlined
                                                    style={{
                                                        marginRight: '3px',
                                                    }}
                                                />
                                                <FormattedMessage id="order.refresh" />
                                            </Button>
                                        </Space>
                                    </Col>
                                </Row>
                            </Footer>
                        </Layout>
                    </Layout>
                </Layout>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(NewOrder);

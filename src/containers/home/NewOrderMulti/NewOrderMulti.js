import React, { Component } from 'react';
import CurrencyInput from 'react-currency-input-field';
import moment from 'moment';
import { connect } from 'react-redux';

import {
    Layout,
    Row,
    Col,
    Space,
    Button,
    Card,
    Divider,
    Typography,
    Select,
    Input,
    InputNumber,
    Checkbox,
    Radio,
    DatePicker,
    Tabs,
} from 'antd';
import {
    SyncOutlined,
    FolderOpenOutlined,
    DownloadOutlined,
    PlusCircleOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';

import { FormattedMessage } from 'react-intl';
import AddModal from './AddModal';
import HeaderTag from '../../common/HeaderTag/HeaderTag';
import MenuOption from '../../common/MenuOption/MenuOption';
import Data from './Data';

import {
    getAllCodeService,
    getAllCodeByKeyService,
} from '../../../services/allCodeService';
import {
    getAddressBookActiveByUserIdService,
    getObjectAddressBookToDisplayService,
} from '../../../services/addressBookService';
import { getObjectPayerToDisplayService } from '../../../services/payerService';
import {
    addMultileOrderService,
    openNotificationWithIcon,
    openNotificationWithIcon_uploading,
    openNotificationWithIcon_frozen,
} from '../../../services/orderService';
import { CommonUtils, dateFormat } from '../../../utils';
import { LANGUAGE } from '../../../utils/constant';
import { toast } from 'react-toastify';

import {
    calculateInsuranceService,
    getDistanceInMultipleOrderService,
    getCalcalateFeeMultipleOrderService,
} from '../../../services/priceService';

var FileSaver = require('file-saver');

const { Sider, Content, Footer } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

class NewOrderMulti extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenAddModal: false,

            // all code
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
            total_price: '',
            intend_time: '',
            note: '',

            // receiver list:
            receiver_list: [],
            total_all: '0',
            update: false,
            key_receiver: 0,
            check_receiver_list: [],

            // excel
            dataFile: [],
            err_receiver_list: [],

            // t??nh C?????c
            distance: '',
            loading_uploading_fee: '',
            cod: '0',
            insurance_fee: '',

            // price code
            percentFrozen: '',
            loadingUploadingFee: '',
            vat: '',
            initInsurance: '',
            percentInsurance: '',
        };
    }

    async componentDidMount() {
        await this.getPriceCode();
        await this.initState();
    }

    // price code
    getPriceCode = async () => {
        try {
            let percentFrozen = await getAllCodeByKeyService('PERCENT_FROZEN');
            percentFrozen = percentFrozen.allCode;
            percentFrozen = percentFrozen[0];

            let loadingUploadingFee = await getAllCodeByKeyService(
                'LOADING_UPLOADING_FEE'
            );
            loadingUploadingFee = loadingUploadingFee.allCode;
            loadingUploadingFee = loadingUploadingFee[0];

            let percentInsurance = await getAllCodeByKeyService(
                'PERCENT_INSURANCE'
            );
            percentInsurance = percentInsurance.allCode;
            percentInsurance = percentInsurance[0];

            let initInsurance = await getAllCodeByKeyService(
                'INIT_VALUE_INSURANCE'
            );
            initInsurance = initInsurance.allCode;
            initInsurance = initInsurance[0];

            let vat = await getAllCodeByKeyService('VAT');
            vat = vat.allCode;
            vat = vat[0];

            let copyState = { ...this.state };
            copyState.percentFrozen = percentFrozen.value_en;
            copyState.loadingUploadingFee = loadingUploadingFee.value_en;
            copyState.percentInsurance = percentInsurance.value_en;
            copyState.initInsurance = initInsurance.value_en;
            copyState.vat = vat.value_en;

            this.setState({ ...copyState }, () => {});
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    // HANDLE ADD MODAL =====================================================
    showModal = () => {
        this.setState({ isOpenAddModal: true });
    };

    handleCancel = () => {
        this.setState({
            // reset data form add modal
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

            number_of_vehicle: 1,

            isOpenAddModal: false,
        });
        setTimeout(async () => {
            await this.calculateFee();
        }, 2000);
    };

    // HANDLE ADD MODAL =====================================================

    initState = async () => {
        let temp = await getAllCodeService('all', 'GOODS');
        let vhc = await getAllCodeService('all', 'VEHICLES');
        let pc = await getAllCodeService('all', 'PAYMENT');
        let vtc = await getAllCodeService('all', 'V1');

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

        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    // HANDLE ONCHANGE ONCLICK ===============================================
    setStateFromChild = (id, value) => {
        let copyState = { ...this.state };
        copyState[id] = value;
        this.setState({ ...copyState }, () => {});
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

    handleOnChangeInputByValue = (id, value) => {
        let copyState = { ...this.state };
        copyState[id] = value;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    getAllVehicleTonnageType = async () => {
        let vtt = await getAllCodeService('all', this.state.vehicle_code);
        await this.handleOnChangeInputByValue('tonnagesCode', vtt.allCode);
    };

    // radio button
    async handleOnChangeVehicle(event) {
        await this.handleOnChangeInputByValue(
            'vehicle_code',
            event.target.value
        );
        // The tonnage displayed according to the selected vehicle type
        await this.getAllVehicleTonnageType();
    }
    // END HANDLE ONCHANGE ONCLICK ===============================================

    addReceiverList = async (obj) => {
        // update ????? table refresh khi add ??i???m nh???n m???i
        this.setState({ update: false });

        let copyState = { ...this.state };
        let copy_receiver_list = this.state.receiver_list;
        copy_receiver_list.push(obj);

        copyState.receiver_list = copy_receiver_list;
        copyState.update = true;

        this.setState({ ...copyState }, () => {});

        // ph???i t??nh 2 l???n nh?? v???y m???i c???p nh???t state ???????c
        await this.calculateFee();
    };

    addErrReceiverList = async (obj) => {
        this.setState({ update: false });

        let copyState = { ...this.state };
        let copy_receiver_list = this.state.err_receiver_list;
        copy_receiver_list.push(obj);

        copyState.err_receiver_list = copy_receiver_list;
        copyState.update = true;

        this.setState({ ...copyState }, () => {});
        await this.updateTotalAll();
    };

    // handle onchange row
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            check_receiver_list: selectedRowKeys,
        });
    };

    handleDeleteRow = async () => {
        try {
            await this.setState({ update: false });
            // get data
            let check_receiver_list = this.state.check_receiver_list;
            let receiver_list = this.state.receiver_list;

            let filtered = receiver_list;

            // remove receiver in check list
            await check_receiver_list.forEach(async (i) => {
                let idx = i;

                await receiver_list.forEach(function (item, index, object) {
                    if (item.key == idx) {
                        object.splice(index, 1);
                    }
                });
            });

            // update state
            let copyState = { ...this.state };
            copyState.update = true;
            copyState.receiver_list = filtered;
            copyState.check_receiver_list = [];

            await this.setState({ ...copyState }, () => {});

            toast.success('???? x??a 1 ??i???m d??? h??ng!');

            await this.calculateFee();
        } catch (error) {
            console.log('Error:', error);
        }
    };

    // t??nh ph?? total_all, ???? bao g???m ph?? d???ch v???
    updateTotalAll = async () => {
        try {
            // ph???i c?? update th?? table m???i c???p nh???t l???i khi c?? distance v?? gi?? m???i
            this.setState({ update: false });

            let temp = +this.state.total_all;

            let receiverList = this.state.receiver_list;

            if (temp >= 0) {
                await receiverList.forEach((i) => {
                    temp = temp + +i.total_fee;
                });
            }

            temp = temp.toString();

            let copyState = { ...this.state };
            copyState.total_all = temp.toString();
            copyState.update = true;

            this.setState({ ...copyState }, () => {});
            if (temp && temp != '0' && isNaN(temp) == false) {
                toast.success(
                    'PN Logistic b??o gi??: ' + CommonUtils.formattedValue(temp)
                );
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    validateInput = () => {
        let arrInput = [
            'sender_id',
            'own_user',
            'goods_code',
            'vehicle_code',

            'number_of_vehicle',
            'number_package',
            'tonage_code',
            'weight',
            'pickup_date',
            // payer
            'payer_id',
            'payment_code',
            // receiver
        ];
        for (let i = 0; i < arrInput.length; i++) {
            // return state element if it empty
            if (!this.state[arrInput[i]]) {
                if (!this.state['sender_id']) {
                    toast.warning('Ch??a ch???n ng?????i g???i h??ng');
                } else if (!this.state['goods_code']) {
                    //
                    toast.warning('Ch??a ch???n lo???i h??ng h??a');
                } else if (!this.state['vehicle_code']) {
                    //
                    toast.warning('Ch??a ch???n lo???i xe');
                } else if (!this.state['weight']) {
                    //
                    toast.warning('Ch??a nh???p kh???i l?????ng th???c');
                } else if (!this.state['tonage_code']) {
                    //
                    toast.warning('Ch??a ch???n lo???i tr???ng t???i');
                    //
                } else if (!this.state['number_of_vehicle']) {
                    toast.warning('Ch??a ch???n s??? xe');
                    //
                } else if (!this.state['number_package']) {
                    toast.warning('Ch??a ch???n s??? ki???n h??ng');
                    //
                } else if (!this.state['payer_id']) {
                    toast.warning('Ch??a ch???n ng?????i thanh to??n');
                    //
                } else if (!this.state['pickup_date']) {
                    toast.warning('Ch??a ch???n th???i gian b???c h??ng');
                    //
                } else if (!this.state['payment_code']) {
                    toast.warning('Ch??a ch???n h??nh th???c thanh to??n');
                }

                return false;
            }
        }

        if (this.state.receiver_list.length == 0) {
            toast.warning('Ch??a ch???n ng?????i nh???n!');
            return false;
        }

        return true;
    };

    handleClickCreateMultipleOrder = async () => {
        try {
            let check = this.validateInput();
            if (check) {
                await addMultileOrderService(this.state);
                await toast.success('?????t v???n ????n th??nh c??ng');
                await this.refreshNewOrder();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    refreshNewOrder = () => {
        setTimeout(() => {
            window.location.reload();
        }, 4000);
    };

    // file upload
    handleReadExcel = async (file) => {
        try {
            let dataFile = await CommonUtils.readExcel(file);

            if (dataFile === false) {
                toast.error('Kh??ng ?????c ???????c file!');
                return;
            }
            await this.setStateFromChild('dataFile', dataFile);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    downloadFile = () => {
        FileSaver.saveAs('resource/Mau-receiver.xlsx', 'Mau-receiver.xlsx');
    };

    pushDataExcel = async () => {
        if (!this.state.pickup_date) {
            toast.warning('Ch??a ch???n ng??y b???c h??ng!');
            return;
        }

        let dataFile = this.state.dataFile;
        // if file error
        if (!dataFile || dataFile.length == 0) {
            toast.error('Ch??a ch???n file!');
        } else {
            let countSuccess = 0;
            dataFile.forEach(async (i) => {
                // validate
                if (
                    i['H??? t??n'] &&
                    i['T??n li??n l???c'] &&
                    i['??i???n tho???i'] &&
                    i['?????a ch??? nh???n'] &&
                    i['Ph?????ng/X??'] &&
                    i['Qu???n/Huy???n'] &&
                    i['T???nh/Th??nh'] &&
                    i['S??? xe'] &&
                    this.state.pickup_date != ''
                ) {
                    // success case
                    countSuccess++;
                    var returned_endate = moment(this.state.pickup_date).add(
                        24,
                        'hours'
                    );
                    await this.setStateFromChild(
                        'intend_time',
                        returned_endate
                    );

                    let current_receiver = await {
                        key: Math.floor(Math.random() * 10000),

                        receiver_id: '',

                        address: {
                            receiver_contact_name: i['H??? t??n'],
                            receiver_alias: i['T??n li??n l???c'],
                            receiver_phone: i['??i???n tho???i'],

                            address: `${i['?????a ch??? nh???n']}, ${i['Ph?????ng/X??']}, ${i['Qu???n/Huy???n']}, ${i['T???nh/Th??nh']}`,

                            receiver_addr_city_code: '404',
                            receiver_addr_city_name: i['T???nh/Th??nh'],
                            receiver_addr_district_code: '404',
                            receiver_addr_district_name: i['Qu???n/Huy???n'],
                            receiver_addr_ward_code: '404',
                            receiver_addr_ward_name: i['Ph?????ng/X??'],

                            receiver_addr_street: i['?????a ch??? nh???n'],
                        },

                        number_of_vehicle: i['S??? xe'],
                        total_price: this.state.total_price,
                        intend_time: returned_endate,
                    };

                    await this.addReceiverList(current_receiver);
                } else {
                    // case: failure
                    let err_receiver = await {
                        key: Math.floor(Math.random() * 10000),

                        receiver_id: '',

                        address: {
                            receiver_contact_name: i['H??? t??n'] || '',
                            receiver_alias: i['T??n li??n l???c'] || '',
                            receiver_phone: i['??i???n tho???i'] || '',

                            address: `${i['?????a ch??? nh???n'] || ''}, ${
                                i['Ph?????ng/X??'] || ''
                            }, ${i['Qu???n/Huy???n'] || ''}, ${
                                i['T???nh/Th??nh'] || ''
                            }`,

                            receiver_addr_city_code: '',
                            receiver_addr_city_name: i['T???nh/Th??nh'] || '',
                            receiver_addr_district_code: '',
                            receiver_addr_district_name: i['Qu???n/Huy???n'] || '',
                            receiver_addr_ward_code: '',
                            receiver_addr_ward_name: i['Ph?????ng/X??'] || '',

                            receiver_addr_street: i['?????a ch??? nh???n'] || '',
                        },

                        number_of_vehicle: i['S??? xe'] || '',
                        total_price: '',
                        intend_time: '',
                    };
                    await this.addErrReceiverList(err_receiver);
                }
            });

            // t??nh ti???n cho ????n excel n???a ch???
            // ????? n?? t???i l???i table sau khi t??nh gi??
            setTimeout(async () => {
                await this.calculateFee();
            }, 2000);

            toast.success('Nh???p ' + countSuccess + ' ??i???m d??? th??nh c??ng!');
        }
    };

    clickPushDataExcel = async () => {
        try {
            await this.pushDataExcel();
            // ????? n?? t???i l???i table sau khi t??nh gi??
            setTimeout(() => {
                this.calculateFee();
            }, 3000);
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    // t??nh c?????c
    // tuy nhi??n do api t??nh t???n time out n??n ??? ????y ch??? t???m t??nh ???????c ph?? d???ch v???,
    // ph?? c?????c xe s??? t??nh ??? h??m updateTotal
    calculateFee = async () => {
        try {
            // need to refresh table list -> update new fee
            this.setState({ update: false });

            let arrInput = [
                'sender_id',

                'goods_code',
                'vehicle_code',

                'tonage_code',
                'weight',
            ];
            for (let i = 0; i < arrInput.length; i++) {
                // return state element if it empty
                if (!this.state[arrInput[i]]) {
                    if (!this.state['sender_id']) {
                        toast.warning('Ch??a ch???n ng?????i g???i h??ng');
                    } else if (!this.state['goods_code']) {
                        toast.warning('Ch??a ch???n lo???i h??ng h??a');
                    } else if (!this.state['vehicle_code']) {
                        toast.warning('Ch??a ch???n lo???i xe');
                    } else if (!this.state['weight']) {
                        toast.warning('Ch??a nh???p kh???i l?????ng th???c');
                    } else if (!this.state['tonage_code']) {
                        toast.warning('Ch??a ch???n lo???i tr???ng t???i');
                    }

                    return;
                }
            }

            // start calculate fee

            //b???o hi???m
            let insurance_fee = 0;
            if (this.state.do_buy_insurance == true) {
                let commodity_value = this.state.commodity_value;
                if (+commodity_value < 500000000) {
                    toast.warning(
                        'B???o hi???m ch??? ??p d???ng cho gi?? tr??? h??ng h??a t???i thi???u 500,000,000 VN??'
                    );
                    return;
                } else {
                    insurance_fee = await calculateInsuranceService(
                        this.state.commodity_value
                    );
                }
            }

            // b???c d??? h??ng
            let loading_uploading_fee = '';
            if (this.state.hire_loading_uploading == true) {
                loading_uploading_fee = +this.state.weight * 80000 * 2;
            }

            //cod
            let cod_fee = '';
            if (this.state.cod != '0') {
                cod_fee = +this.state.cod * 0.01;
            }

            // t??nh ri??ng t???ng ????n
            if (
                !this.state.receiver_list &&
                this.state.receiver_list.length == 0
            ) {
                console.log('thi???u n??i nh???n');
                return;
            }

            let receiver_list = this.state.receiver_list;
            let distance = '';
            let total_fee = '';
            var total_all = 0;
            await receiver_list.forEach(async (i) => {
                // t??nh kho???ng c??ch ???????ng ??i
                distance = await getDistanceInMultipleOrderService(
                    this.state,
                    i.address.address
                );
                i.distance = distance;

                // t??nh ti???n
                total_fee = await getCalcalateFeeMultipleOrderService(
                    distance,
                    i.number_of_vehicle,
                    this.state
                );

                i.total_fee = total_fee;

                // total_all = +total_all + +total_fee;
            });

            // t??nh total all cho t???t c???
            // c???ng b???o hi???m
            if (this.state.do_buy_insurance == true) {
                let insurance_fee =
                    +this.state.commodity_value * (0.04 / 100) * (110 / 100);

                total_all = +total_all + insurance_fee;
            }

            // ph?? b???c d??? h??ng - 80000/1T???n
            if (this.state.hire_loading_uploading == true) {
                total_all = +total_all + +this.state.weight * 80000 * 2;
            }

            // cod_fee
            if (this.state.cod) {
                total_all = +total_all + +this.state.cod * 0.01;
            }

            total_all = Math.round(+total_all);

            let copyState = { ...this.state };
            copyState.distance = distance;
            // copyState.total_price = total_fee;
            copyState.insurance_fee = insurance_fee;
            copyState.loading_uploading_fee = loading_uploading_fee.toString();
            copyState.cod_fee = cod_fee.toString();
            copyState.receiver_list = receiver_list;
            copyState.update = true;
            copyState.total_all = total_all.toString();
            this.setState({ ...copyState }, () => {});

            await this.updateTotalAll();
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        let goodsCode = this.state.goodsCode;
        let vehiclesCode = this.state.vehiclesCode;
        let tonnagesCode = this.state.tonnagesCode;
        let lang = this.props.lang;
        let paymentsCode = this.state.paymentsCode;
        let payers = this.state.payers;
        let addressBooks = this.state.addressBooks;

        // handle check box table
        // rowSelection of table
        const rowSelection = {
            // binding data - like value property
            selectedRowKeys: this.state.check_receiver_list,
            // handle click in a check box of the row
            onChange: this.onSelectChange,
        };

        return (
            <>
                <Layout>
                    <HeaderTag
                        breadcrumb1={<FormattedMessage id="common.dashboard" />}
                        breadcrumb2={
                            <FormattedMessage id="common.order_multi" />
                        }
                    />
                    <Layout>
                        <Sider width="256" id="main">
                            <MenuOption />
                        </Sider>
                        <Layout
                            className="site-layout-background-neworders"
                            style={{ padding: '24px 24px' }}
                        >
                            <Content>
                                <Row gutter={[12, 12]}>
                                    <Col span={24}>
                                        <Card>
                                            <Row gutter={[36, 12]}>
                                                {/* Qu???n l?? file  */}
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={12}
                                                >
                                                    <Row gutter={[12, 12]}>
                                                        {/*  */}
                                                        <Col
                                                            span={24}
                                                            style={{
                                                                display: 'flex',
                                                            }}
                                                        >
                                                            <FolderOpenOutlined
                                                                style={{
                                                                    fontSize:
                                                                        '24px',
                                                                    color: '#FDD901',
                                                                }}
                                                            />
                                                            &nbsp;
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.manage_file" />
                                                            </Title>
                                                            <Divider
                                                                type="vertical"
                                                                style={{
                                                                    height: '80%',
                                                                    borderLeft:
                                                                        '2px solid #7B809A',
                                                                }}
                                                            />
                                                            <FormattedMessage id="order.down_file" />
                                                            <a
                                                                onClick={() => {
                                                                    this.downloadFile();
                                                                }}
                                                                download
                                                            >
                                                                &nbsp;
                                                                <FormattedMessage id="order.here" />
                                                            </a>
                                                        </Col>
                                                        <Col sm={24} md={16}>
                                                            <Input
                                                                placeholder={
                                                                    LANGUAGE.VI ===
                                                                    lang
                                                                        ? 'Ch???n file (.xlsx)'
                                                                        : 'Choose file (.xlsx)'
                                                                }
                                                                type="file"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const file =
                                                                        e.target
                                                                            .files[0];
                                                                    this.handleReadExcel(
                                                                        file
                                                                    );
                                                                }}
                                                            ></Input>
                                                        </Col>
                                                        <Col span={1}></Col>

                                                        <Col sm={24} md={6}>
                                                            <Button
                                                                style={{
                                                                    height: '100%',
                                                                }}
                                                                onClick={
                                                                    this
                                                                        .clickPushDataExcel
                                                                }
                                                            >
                                                                <DownloadOutlined />
                                                                <FormattedMessage id="order.push_data" />
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={0}
                                                    xl={1}
                                                >
                                                    <Divider
                                                        type="vertical"
                                                        style={{
                                                            height: '100%',
                                                            borderLeft:
                                                                '1px solid #7B809A',
                                                        }}
                                                    ></Divider>
                                                </Col>
                                                {/*  Ng?????i nh???n h??ng */}
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={11}
                                                >
                                                    <Row gutter={[12, 12]}>
                                                        <Col span={24}>
                                                            <div
                                                                className="input-uploading"
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                }}
                                                            >
                                                                <i
                                                                    className="fas fa-map-marker-alt"
                                                                    style={{
                                                                        fontSize:
                                                                            '24px',
                                                                        color: '#FDD901',
                                                                    }}
                                                                ></i>
                                                                &nbsp;
                                                                <Title
                                                                    level={5}
                                                                >
                                                                    <FormattedMessage id="order.consignor" />{' '}
                                                                    <span className="required">
                                                                        *
                                                                    </span>
                                                                </Title>
                                                            </div>
                                                        </Col>
                                                        {/* ?????a ch??? g???i h??ng */}
                                                        <Col span={24}>
                                                            <div>
                                                                <Select
                                                                    defaultValue={
                                                                        <FormattedMessage id="order.shipping_address" />
                                                                    }
                                                                    style={{
                                                                        width: '100%',
                                                                    }}
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        this.handleOnChangeInputByValue(
                                                                            'sender_id',
                                                                            e
                                                                        );
                                                                    }}
                                                                    // onBlur={() => {
                                                                    //     this.calculateFee();
                                                                    // }}
                                                                >
                                                                    {addressBooks &&
                                                                        addressBooks.map(
                                                                            (
                                                                                i
                                                                            ) => {
                                                                                return (
                                                                                    <Option
                                                                                        key={
                                                                                            i._id
                                                                                        }
                                                                                        value={
                                                                                            i._id
                                                                                        }
                                                                                        style={{
                                                                                            fontSize:
                                                                                                '12px',
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            i.name
                                                                                        }
                                                                                    </Option>
                                                                                );
                                                                            }
                                                                        )}
                                                                </Select>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                    <Col span={24}>
                                        {/* <Th??ng tin d???ch v??? - h??ng h??a /> */}
                                        <Card>
                                            <Title level={3}>
                                                <FormattedMessage id="order.service_info" />
                                            </Title>
                                            {/* grid ch??nh */}
                                            <Row gutter={[48, 48]}>
                                                {/* b??n ph???i */}
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={12}
                                                >
                                                    <Row gutter={[12, 12]}>
                                                        <Col span={24}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.vehicle_type" />
                                                            </Title>
                                                            <Radio.Group
                                                                defaultValue="V1"
                                                                buttonStyle="solid"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.handleOnChangeVehicle(
                                                                        e
                                                                    );
                                                                }}
                                                            >
                                                                {vehiclesCode &&
                                                                    vehiclesCode.map(
                                                                        (i) => {
                                                                            return (
                                                                                <Radio.Button
                                                                                    key={
                                                                                        i.key
                                                                                    }
                                                                                    value={
                                                                                        i.key
                                                                                    }
                                                                                >
                                                                                    {LANGUAGE.VI ===
                                                                                    lang
                                                                                        ? i.value_vi
                                                                                        : i.value_en}
                                                                                </Radio.Button>
                                                                            );
                                                                        }
                                                                    )}
                                                            </Radio.Group>
                                                        </Col>
                                                        {/* ////////////////
                                                        ////////////
                                                        ////////// */}
                                                        <Col sm={24} md={8}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.total_weight" />{' '}
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                            </Title>{' '}
                                                            <InputNumber
                                                                min={1}
                                                                max={100}
                                                                defaultValue={0}
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                value={
                                                                    this.state
                                                                        .weight
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'weight',
                                                                        e
                                                                    );
                                                                }}
                                                                // onBlur={() => {
                                                                //     this.calculateFee();
                                                                // }}
                                                            />
                                                        </Col>
                                                        <Col sm={24} md={8}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.package" />
                                                            </Title>
                                                            <InputNumber
                                                                min={1}
                                                                max={100}
                                                                defaultValue={0}
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                value={
                                                                    this.state
                                                                        .number_package
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'number_package',
                                                                        e
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col
                                                            sm={24}
                                                            md={8}
                                                        ></Col>
                                                        <Col span={24}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.converted_weight" />
                                                            </Title>
                                                        </Col>
                                                        <Col sm={24} md={8}>
                                                            {' '}
                                                            <InputNumber
                                                                min={1}
                                                                max={100}
                                                                defaultValue={0}
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                value={
                                                                    this.state
                                                                        .length
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'length',
                                                                        e
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col sm={24} md={8}>
                                                            <InputNumber
                                                                min={1}
                                                                max={100}
                                                                defaultValue={0}
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                value={
                                                                    this.state
                                                                        .width
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'width',
                                                                        e
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col sm={24} md={8}>
                                                            <InputNumber
                                                                min={1}
                                                                max={100}
                                                                defaultValue={0}
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                value={
                                                                    this.state
                                                                        .height
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'height',
                                                                        e
                                                                    );
                                                                }}
                                                            />
                                                        </Col>

                                                        <Col sm={24} md={8}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.cod" />
                                                            </Title>
                                                            <CurrencyInput
                                                                id="input-example"
                                                                name="input-name"
                                                                suffix=" VN??"
                                                                decimalSeparator="."
                                                                groupSeparator=","
                                                                defaultValue={0}
                                                                decimalsLimit={
                                                                    2
                                                                }
                                                                onValueChange={(
                                                                    value,
                                                                    name
                                                                ) => {
                                                                    this.handleOnChangeInputByValue(
                                                                        'cod',
                                                                        value
                                                                    );
                                                                }}
                                                                // onBlur={() => {
                                                                //     this.calculateFee();
                                                                // }}
                                                            />
                                                        </Col>
                                                        <Col span={16}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.goods_type" />{' '}
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                            </Title>
                                                            <Select
                                                                defaultValue={
                                                                    <FormattedMessage id="order.goods_type" />
                                                                }
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.handleOnChangeInputByValue(
                                                                        'goods_code',
                                                                        e
                                                                    );
                                                                }}
                                                                // onBlur={() => {
                                                                //     this.calculateFee();
                                                                // }}
                                                            >
                                                                {goodsCode &&
                                                                    goodsCode.map(
                                                                        (i) => {
                                                                            return (
                                                                                <Option
                                                                                    key={
                                                                                        i.key
                                                                                    }
                                                                                    value={
                                                                                        i.key
                                                                                    }
                                                                                >
                                                                                    {LANGUAGE.VI ===
                                                                                    lang
                                                                                        ? i.value_vi
                                                                                        : i.value_en}
                                                                                </Option>
                                                                            );
                                                                        }
                                                                    )}
                                                            </Select>
                                                        </Col>

                                                        <Col sm={24} md={8}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.loading_time" />{' '}
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                            </Title>
                                                            <DatePicker
                                                                format="DD-MM-YYYY HH:mm"
                                                                disabledDate={(
                                                                    current
                                                                ) => {
                                                                    return (
                                                                        current &&
                                                                        current <
                                                                            moment().endOf(
                                                                                'day'
                                                                            )
                                                                    );
                                                                }}
                                                                value={
                                                                    this.state
                                                                        .pickup_date
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'pickup_date',
                                                                        e
                                                                    );
                                                                }}
                                                            />
                                                        </Col>

                                                        <Col span={16}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.weight_type" />{' '}
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                            </Title>
                                                            <Select
                                                                defaultValue={
                                                                    <FormattedMessage id="order.select_weight_type" />
                                                                }
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.handleOnChangeInputByValue(
                                                                        'tonage_code',
                                                                        e
                                                                    );
                                                                }}
                                                                // onBlur={() => {
                                                                //     this.calculateFee();
                                                                // }}
                                                            >
                                                                {tonnagesCode &&
                                                                    tonnagesCode.map(
                                                                        (i) => {
                                                                            return (
                                                                                <Option
                                                                                    key={
                                                                                        i.key
                                                                                    }
                                                                                    value={
                                                                                        i.key
                                                                                    }
                                                                                >
                                                                                    {LANGUAGE.VI ===
                                                                                    lang
                                                                                        ? i.value_vi
                                                                                        : i.value_en}
                                                                                </Option>
                                                                            );
                                                                        }
                                                                    )}
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                {/* b??n tr??i */}
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={12}
                                                >
                                                    <Row gutter={[12, 12]}>
                                                        {/* ?????ng ?? mua b???o hi???m                                                            hi???m */}
                                                        <Col sm={24} md={8}>
                                                            <Title level={5}>
                                                                &nbsp;
                                                            </Title>
                                                            <Checkbox
                                                                value={
                                                                    this.state
                                                                        .do_buy_insurance
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.handleOnChangeInputByValue(
                                                                        'do_buy_insurance',
                                                                        e.target
                                                                            .checked
                                                                    );
                                                                }}
                                                                onBlur={() => {
                                                                    this.calculateFee();
                                                                }}
                                                            >
                                                                <FormattedMessage id="order.buy_insurance" />
                                                            </Checkbox>
                                                        </Col>
                                                        <Col span={16}>
                                                            {this.state
                                                                .do_buy_insurance ==
                                                            true ? (
                                                                <div>
                                                                    <Title
                                                                        level={
                                                                            5
                                                                        }
                                                                    >
                                                                        <FormattedMessage id="order.goods_value" />
                                                                    </Title>
                                                                    <CurrencyInput
                                                                        id="input-example"
                                                                        name="input-name"
                                                                        suffix=" VN??"
                                                                        decimalSeparator="."
                                                                        groupSeparator=","
                                                                        defaultValue={
                                                                            1000000
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            value,
                                                                            name
                                                                        ) => {
                                                                            this.handleOnChangeInputByValue(
                                                                                'commodity_value',
                                                                                value
                                                                            );
                                                                        }}
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .commodity_value
                                                                        }
                                                                        onBlur={() => {
                                                                            this.calculateFee();
                                                                        }}
                                                                    />
                                                                    &nbsp;
                                                                    &nbsp;
                                                                    <span
                                                                        onClick={() => {
                                                                            openNotificationWithIcon(
                                                                                'info',
                                                                                this
                                                                                    .state
                                                                                    .percentInsurance,
                                                                                this
                                                                                    .state
                                                                                    .vat
                                                                            );
                                                                        }}
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                        }}
                                                                    >
                                                                        <InfoCircleOutlined
                                                                            style={{
                                                                                color: '#52c41a',
                                                                            }}
                                                                        />
                                                                    </span>
                                                                    <br />
                                                                    <span>
                                                                        &nbsp;
                                                                        <FormattedMessage id="order.insurance_fee" />
                                                                        {this
                                                                            .state
                                                                            .insurance_fee
                                                                            ? CommonUtils.formattedValue(
                                                                                  this
                                                                                      .state
                                                                                      .insurance_fee
                                                                              )
                                                                            : '0 VN??'}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    &nbsp;
                                                                </div>
                                                            )}
                                                        </Col>

                                                        <Col sm={24} md={12}>
                                                            <Checkbox
                                                                value={
                                                                    this.state
                                                                        .is_frozen_storage
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'is_frozen_storage',
                                                                        e.target
                                                                            .checked
                                                                    );
                                                                }}
                                                                onBlur={() => {
                                                                    this.calculateFee();
                                                                }}
                                                            >
                                                                <FormattedMessage id="order.freight" />{' '}
                                                                &nbsp; &nbsp;
                                                                <span
                                                                    onClick={() => {
                                                                        openNotificationWithIcon_frozen(
                                                                            'info',
                                                                            this
                                                                                .state
                                                                                .percentFrozen
                                                                        );
                                                                    }}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    <InfoCircleOutlined
                                                                        style={{
                                                                            color: '#52c41a',
                                                                        }}
                                                                    />
                                                                </span>
                                                            </Checkbox>
                                                        </Col>
                                                        <Col sm={24} md={12}>
                                                            <Checkbox
                                                                value={
                                                                    this.state
                                                                        .is_danger
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'is_danger',
                                                                        e.target
                                                                            .checked
                                                                    );
                                                                }}
                                                            >
                                                                <FormattedMessage id="order.dangerous_goods" />
                                                            </Checkbox>
                                                        </Col>

                                                        <Col sm={24} md={12}>
                                                            <Checkbox
                                                                value={
                                                                    this.state
                                                                        .no_empty_container
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'no_empty_container',
                                                                        e.target
                                                                            .checked
                                                                    );
                                                                }}
                                                            >
                                                                <FormattedMessage id="order.only_tow_head" />
                                                            </Checkbox>
                                                        </Col>
                                                        <Col sm={24} md={12}>
                                                            <Checkbox
                                                                value={
                                                                    this.state
                                                                        .hire_loading_uploading
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'hire_loading_uploading',
                                                                        e.target
                                                                            .checked
                                                                    );
                                                                }}
                                                                onBlur={() => {
                                                                    this.calculateFee();
                                                                }}
                                                            >
                                                                <FormattedMessage id="order.hire_loading" />
                                                                &nbsp; &nbsp;
                                                                <span
                                                                    onClick={() => {
                                                                        openNotificationWithIcon_uploading(
                                                                            'info',
                                                                            this
                                                                                .state
                                                                                .loadingUploadingFee
                                                                        );
                                                                    }}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    <InfoCircleOutlined
                                                                        style={{
                                                                            color: '#52c41a',
                                                                        }}
                                                                    />
                                                                </span>
                                                                {this.state
                                                                    .hire_loading_uploading ==
                                                                    true &&
                                                                    this.state
                                                                        .loading_uploading_fee && (
                                                                        <div>
                                                                            {' Ph??: ' +
                                                                                CommonUtils.formattedValue(
                                                                                    this
                                                                                        .state
                                                                                        .loading_uploading_fee
                                                                                )}
                                                                        </div>
                                                                    )}
                                                            </Checkbox>
                                                        </Col>

                                                        {/* h???t checkbox */}

                                                        <Col span={24}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.goods_description" />
                                                            </Title>
                                                            <TextArea
                                                                rows={3}
                                                                value={
                                                                    this.state
                                                                        .description
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'description',
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                            />
                                                        </Col>

                                                        {/* ghi ch?? */}
                                                        <Col span={24}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.note" />
                                                            </Title>
                                                            <TextArea
                                                                rows={4}
                                                                value={
                                                                    this.state
                                                                        .note
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'note',
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                    {/* Th??ng tin thanh to??n */}
                                    <Col span={24}>
                                        <Card>
                                            <Row gutter={[12, 12]}>
                                                <Col span={24}>
                                                    <Title level={3}>
                                                        <FormattedMessage id="order.payment_info" />{' '}
                                                    </Title>
                                                </Col>
                                                {/* b??n tr??i */}
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={12}
                                                >
                                                    <Row gutter={[12]}>
                                                        <Col span={17}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.payer" />{' '}
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                            </Title>
                                                        </Col>
                                                        {/* <Col span={7}>
                                                            <Button type="primary">
                                                                <i className="fas fa-user-plus"></i>{' '}
                                                                &nbsp; Nh???p
                                                                th??ng tin
                                                            </Button>
                                                        </Col> */}

                                                        <Col span={24}>
                                                            <Select
                                                                defaultValue={
                                                                    LANGUAGE.VI ===
                                                                    lang
                                                                        ? 'Ch???n ng?????i thanh to??n'
                                                                        : 'Choose payer'
                                                                }
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.handleOnChangeInputByValue(
                                                                        'payer_id',
                                                                        e
                                                                    );
                                                                }}
                                                            >
                                                                {payers &&
                                                                    payers.map(
                                                                        (i) => {
                                                                            return (
                                                                                <Option
                                                                                    key={
                                                                                        i._id
                                                                                    }
                                                                                    value={
                                                                                        i._id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        i.name
                                                                                    }
                                                                                </Option>
                                                                            );
                                                                        }
                                                                    )}
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                {/* b??n ph???i */}
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={12}
                                                    xl={12}
                                                >
                                                    <Row gutter={[12, 12]}>
                                                        <Col sm={24} md={12}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.payment_method" />{' '}
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                            </Title>
                                                            <Select
                                                                defaultValue={
                                                                    LANGUAGE.VI ===
                                                                    lang
                                                                        ? 'Ch???n ph????ng th???c thanh to??n'
                                                                        : 'Choose payment method'
                                                                }
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setStateFromChild(
                                                                        'payment_code',
                                                                        e
                                                                    );
                                                                }}
                                                            >
                                                                {paymentsCode &&
                                                                    paymentsCode.map(
                                                                        (i) => {
                                                                            return (
                                                                                <Option
                                                                                    key={
                                                                                        i.key
                                                                                    }
                                                                                    value={
                                                                                        i.key
                                                                                    }
                                                                                >
                                                                                    {LANGUAGE.VI ===
                                                                                    lang
                                                                                        ? i.value_vi
                                                                                        : i.value_en}
                                                                                </Option>
                                                                            );
                                                                        }
                                                                    )}
                                                            </Select>
                                                        </Col>
                                                        <Col sm={24} md={12}>
                                                            <Title level={5}>
                                                                <FormattedMessage id="order.reference_code" />
                                                            </Title>
                                                            <Input
                                                                placeholder={
                                                                    LANGUAGE.VI ===
                                                                    lang
                                                                        ? 'M?? tham chi???u'
                                                                        : 'Reference code'
                                                                }
                                                            ></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                    <Col
                                        xs={0}
                                        sm={0}
                                        md={0}
                                        lg={12}
                                        xl={17}
                                    ></Col>
                                    <Col xs={24} sm={24} md={24} lg={12} xl={7}>
                                        {/* C???m button */}
                                        <AddModal
                                            isOpenAddModal={
                                                this.state.isOpenAddModal
                                            }
                                            handleCancel={this.handleCancel}
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
                                            receiver_id={this.state.receiver_id}
                                            receiver_contact_name={
                                                this.state.receiver_contact_name
                                            }
                                            receiver_alias={
                                                this.state.receiver_alias
                                            }
                                            receiver_phone={
                                                this.state.receiver_phone
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
                                                this.state.receiver_addr_street
                                            }
                                            // new
                                            number_of_vehicle={
                                                this.state.number_of_vehicle
                                            }
                                            total_price={this.state.total_price}
                                            pickup_date={this.state.pickup_date}
                                            addReceiverList={
                                                this.addReceiverList
                                            }
                                            key_receiver={
                                                this.state.key_receiver
                                            }
                                            //fee
                                            calculateFee={this.calculateFee}
                                        />
                                        <Card>
                                            <Space
                                                className="button-right"
                                                size="large"
                                            >
                                                <Button
                                                    onClick={() =>
                                                        this.showModal()
                                                    }
                                                    type="primary"
                                                >
                                                    <PlusCircleOutlined />
                                                    <FormattedMessage id="order.add_picking_place" />
                                                </Button>
                                                {/* <Button>
                                    <CheckCircleOutlined />
                                    T???o ????n
                                </Button> */}

                                                {/* <Button>
                                                    <EditOutlined />
                                                    S???a
                                                </Button> */}

                                                <Button
                                                    onClick={() => {
                                                        this.handleDeleteRow();
                                                    }}
                                                    type="danger"
                                                >
                                                    <DeleteOutlined />
                                                    <FormattedMessage id="order.delete" />
                                                </Button>
                                            </Space>
                                            {/* </Col>
                    </Row> */}
                                        </Card>
                                    </Col>
                                    <Col span={24}>
                                        <Tabs type="card" size="large">
                                            <TabPane
                                                tab={
                                                    LANGUAGE.VI === lang
                                                        ? 'Th??nh c??ng'
                                                        : 'Success' +
                                                          ' (' +
                                                          this.state
                                                              .receiver_list
                                                              .length +
                                                          ')'
                                                }
                                                key="1"
                                            >
                                                <Data
                                                    receiver_list={
                                                        this.state.update ==
                                                        true
                                                            ? this.state
                                                                  .receiver_list
                                                            : null
                                                    }
                                                    rowSelection={
                                                        this.state.update ==
                                                        true
                                                            ? rowSelection
                                                            : null
                                                    }
                                                />
                                            </TabPane>
                                            <TabPane
                                                tab={
                                                    LANGUAGE.VI === lang
                                                        ? 'Th???t b???i'
                                                        : 'Fail' + ' (0)'
                                                }
                                                key="2"
                                            >
                                                <Data
                                                    receiver_list={
                                                        this.state.update ==
                                                        true
                                                            ? this.state
                                                                  .err_receiver_list
                                                            : null
                                                    }
                                                />
                                            </TabPane>
                                        </Tabs>
                                    </Col>
                                </Row>
                            </Content>
                            {/* L??u */}
                            <Footer
                                style={{
                                    position: 'sticky',
                                    bottom: '0',
                                    backgroundColor: 'white',
                                    borderTop: '1px solid black',
                                }}
                            >
                                <Row gutter={[24, 24]}>
                                    <Col sm={24} md={9}>
                                        <Row gutter={[24, 24]}>
                                            <Col sm={24} md={12}>
                                                <div>
                                                    <FormattedMessage id="order.price" />
                                                    :
                                                </div>
                                                <Title level={5}>
                                                    {this.state.total_all ? (
                                                        CommonUtils.formattedValue(
                                                            this.state.total_all
                                                        )
                                                    ) : (
                                                        <div>0 VN??</div>
                                                    )}
                                                </Title>
                                            </Col>
                                            <Col sm={24} md={12}>
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
                                                        <div>0 VN??</div>
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col sm={0} md={5}></Col>
                                    <Col sm={24} md={10}>
                                        <Space
                                            className="button-right"
                                            size="large"
                                        >
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    this.handleClickCreateMultipleOrder();
                                                }}
                                            >
                                                <FormattedMessage id="order.confirm" />
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    window.location.reload();
                                                }}
                                            >
                                                <SyncOutlined />
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

export default connect(mapStateToProps, mapDispatchToProps)(NewOrderMulti);

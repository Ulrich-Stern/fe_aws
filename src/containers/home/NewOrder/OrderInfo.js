import React, { Component } from 'react';
import { connect } from 'react-redux';
import CurrencyInput from 'react-currency-input-field';

import {
    Row,
    Col,
    Card,
    DatePicker,
    Checkbox,
    Typography,
    Radio,
    Input,
    Select,
    InputNumber,
    Button,
    notification,
    Space,
} from 'antd';
import moment from 'moment';
import { InfoCircleOutlined } from '@ant-design/icons';

import { FormattedMessage } from 'react-intl';
import { LANGUAGE } from '../../../utils';
import {
    getAllCodeService,
    getAllCodeByKeyService,
} from '../../../services/allCodeService';
import { CommonUtils, dateFormat } from '../../../utils';

import {
    addMultileOrderService,
    openNotificationWithIcon,
    openNotificationWithIcon_uploading,
    openNotificationWithIcon_frozen,
} from '../../../services/orderService';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

class OrderInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percentFrozen: '',
            loadingUploadingFee: '',
            vat: '',
            initInsurance: '',
            percentInsurance: '',
        };
    }

    async componentDidMount() {
        await this.getPriceCode();
    }

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

    getAllVehicleTonnageType = async () => {
        let vtt = await getAllCodeService('all', this.props.vehicle_code);
        await this.props.setStateFromChild('tonnagesCode', vtt.allCode);
    };

    // radio button
    async handleOnChangeVehicle(event) {
        await this.props.setStateFromChild('vehicle_code', event.target.value);
        // The tonnage displayed according to the selected vehicle type
        await this.getAllVehicleTonnageType();
    }

    render() {
        let goodsCode = this.props.goodsCode;
        let vehiclesCode = this.props.vehiclesCode;
        let tonnagesCode = this.props.tonnagesCode;
        let lang = this.props.lang;
        return (
            <>
                <Card>
                    <Title level={3}>
                        <FormattedMessage id="order.order_info" />
                    </Title>
                    <Row gutter={[12, 12]}>
                        <Col span={24}>
                            <Title level={5}>
                                <FormattedMessage id="order.vehicle_type" />
                            </Title>
                            <Radio.Group
                                defaultValue="V1"
                                buttonStyle="solid"
                                onChange={(e) => {
                                    this.handleOnChangeVehicle(e);
                                }}
                            >
                                {vehiclesCode &&
                                    vehiclesCode.map((i) => {
                                        return (
                                            <Radio.Button
                                                key={i.key}
                                                value={i.key}
                                            >
                                                {LANGUAGE.VI === lang
                                                    ? i.value_vi
                                                    : i.value_en}
                                            </Radio.Button>
                                        );
                                    })}
                            </Radio.Group>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Title level={5}>
                                <FormattedMessage id="order.total_weight" />{' '}
                                <span className="required">*</span>
                            </Title>{' '}
                            <InputNumber
                                min={1}
                                max={100}
                                defaultValue={0}
                                style={{ width: '100%' }}
                                value={this.props.weight}
                                onChange={(e) => {
                                    this.props.setStateFromChild('weight', e);
                                }}
                                onBlur={() => {
                                    this.props.calculateFee();
                                }}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Title level={5}>
                                <FormattedMessage id="order.package" />
                            </Title>
                            <InputNumber
                                min={1}
                                max={100}
                                defaultValue={1}
                                style={{ width: '100%' }}
                                value={this.props.number_package}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'number_package',
                                        e
                                    );
                                }}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Title level={5}>
                                <FormattedMessage id="order.#vehicle" />
                            </Title>
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
                                onBlur={() => {
                                    this.props.calculateFee();
                                }}
                            />
                        </Col>
                        <Col span={24}>
                            <Title level={5}>
                                <FormattedMessage id="order.converted_weight" />
                            </Title>
                        </Col>
                        <Col xs={24} sm={8}>
                            {' '}
                            <InputNumber
                                min={1}
                                max={100}
                                defaultValue={0}
                                style={{ width: '100%' }}
                                value={this.props.length}
                                onChange={(e) => {
                                    this.props.setStateFromChild('length', e);
                                }}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <InputNumber
                                min={1}
                                max={100}
                                defaultValue={0}
                                style={{ width: '100%' }}
                                value={this.props.width}
                                onChange={(e) => {
                                    this.props.setStateFromChild('width', e);
                                }}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <InputNumber
                                min={1}
                                max={100}
                                defaultValue={0}
                                style={{ width: '100%' }}
                                value={this.props.height}
                                onChange={(e) => {
                                    this.props.setStateFromChild('height', e);
                                }}
                            />
                        </Col>

                        <Col xs={24} sm={8}>
                            <Title level={5}>
                                <FormattedMessage id="order.cod" />
                            </Title>
                            <CurrencyInput
                                id="input-example"
                                name="input-name"
                                suffix=" VNĐ"
                                decimalSeparator="."
                                groupSeparator=","
                                defaultValue={0}
                                decimalsLimit={2}
                                onValueChange={(value, name) => {
                                    this.props.setStateFromChild('cod', value);
                                }}
                                onBlur={() => {
                                    this.props.calculateFee();
                                }}
                            />
                        </Col>
                        <Col span={16}>
                            <Title level={5}>
                                <FormattedMessage id="order.goods_type" />{' '}
                                <span className="required">*</span>
                            </Title>
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'goods_code',
                                        e
                                    );
                                }}
                            >
                                {goodsCode &&
                                    goodsCode.map((i) => {
                                        return (
                                            <Option key={i.key} value={i.key}>
                                                {LANGUAGE.VI === lang
                                                    ? i.value_vi
                                                    : i.value_en}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Col>

                        <Col xs={24} sm={8}>
                            <Title level={5}>
                                <FormattedMessage id="order.loading_time" />{' '}
                                <span className="required">*</span>
                            </Title>
                            <DatePicker
                                format="DD-MM-YYYY HH:mm"
                                disabledDate={(current) => {
                                    return (
                                        current &&
                                        current < moment().endOf('day')
                                    );
                                }}
                                value={this.props.pickup_date}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'pickup_date',
                                        e
                                    );
                                }}
                            />
                        </Col>
                        <Col span={16}>
                            <Title level={5}>
                                <FormattedMessage id="order.weight_type" />{' '}
                                <span className="required">*</span>
                            </Title>
                            <Select
                                defaultValue={
                                    <FormattedMessage id="order.select_weight_type" />
                                }
                                style={{
                                    width: '100%',
                                }}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'tonage_code',
                                        e
                                    );
                                }}
                                onBlur={() => {
                                    this.props.calculateFee();
                                }}
                            >
                                {tonnagesCode &&
                                    tonnagesCode.map((i) => {
                                        return (
                                            <Option key={i.key} value={i.key}>
                                                {LANGUAGE.VI === lang
                                                    ? i.value_vi
                                                    : i.value_en}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Col>
                        {/* handle mua bảo hiểm */}
                        <Col xs={24} sm={8}>
                            <Title level={5}>&nbsp;</Title>
                            <Checkbox
                                value={this.props.do_buy_insurance}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'do_buy_insurance',
                                        e.target.checked
                                    );
                                }}
                                onBlur={() => {
                                    this.props.calculateFee();
                                }}
                            >
                                <FormattedMessage id="order.buy_insurance" />
                            </Checkbox>
                        </Col>
                        <Col span={16}>
                            {this.props.do_buy_insurance == true ? (
                                <div>
                                    <Title level={5}>
                                        <FormattedMessage id="order.goods_value" />
                                    </Title>
                                    <CurrencyInput
                                        id="input-example"
                                        name="input-name"
                                        suffix=" VNĐ"
                                        decimalSeparator="."
                                        groupSeparator=","
                                        defaultValue={1000000}
                                        decimalsLimit={2}
                                        onValueChange={(value, name) => {
                                            this.props.setStateFromChild(
                                                'commodity_value',
                                                value
                                            );
                                        }}
                                        value={this.props.commodity_value}
                                        onBlur={() => {
                                            this.props.calculateFee();
                                        }}
                                    />
                                    &nbsp; &nbsp;
                                    <span
                                        onClick={() => {
                                            openNotificationWithIcon(
                                                'info',
                                                this.state.percentInsurance,
                                                this.state.vat
                                            );
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <InfoCircleOutlined
                                            style={{ color: '#52c41a' }}
                                        />
                                    </span>
                                    <br />
                                    <span>
                                        &nbsp;{' '}
                                        <FormattedMessage id="order.insurance_fee" />
                                        :{' '}
                                        {this.props.insurance_fee
                                            ? CommonUtils.formattedValue(
                                                  this.props.insurance_fee
                                              )
                                            : '0 VNĐ'}
                                    </span>
                                </div>
                            ) : (
                                <div>&nbsp;</div>
                            )}
                        </Col>
                        {/* check box ==============================*/}

                        <Col span={24}>
                            <Checkbox
                                value={this.props.is_frozen_storage}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'is_frozen_storage',
                                        e.target.checked
                                    );
                                }}
                                onBlur={() => {
                                    this.props.calculateFee();
                                }}
                            >
                                <FormattedMessage id="order.freight" /> &nbsp;
                                &nbsp;
                                <span
                                    onClick={() => {
                                        openNotificationWithIcon_frozen(
                                            'info',
                                            this.state.percentFrozen
                                        );
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <InfoCircleOutlined
                                        style={{ color: '#52c41a' }}
                                    />
                                </span>
                            </Checkbox>
                        </Col>
                        <Col span={24}>
                            <Checkbox
                                value={this.props.is_danger}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'is_danger',
                                        e.target.checked
                                    );
                                }}
                            >
                                <FormattedMessage id="order.dangerous_goods" />
                            </Checkbox>
                        </Col>

                        <Col span={24}>
                            <Checkbox
                                value={this.props.no_empty_container}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'no_empty_container',
                                        e.target.checked
                                    );
                                }}
                                onBlur={() => {
                                    this.props.calculateFee();
                                }}
                            >
                                <FormattedMessage id="order.only_tow_head" />
                            </Checkbox>
                        </Col>
                        <Col span={24}>
                            <Checkbox
                                value={this.props.hire_loading_uploading}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'hire_loading_uploading',
                                        e.target.checked
                                    );
                                }}
                                onBlur={() => {
                                    this.props.calculateFee();
                                }}
                            >
                                <FormattedMessage id="order.hire_loading" />{' '}
                                &nbsp; &nbsp;
                                <span
                                    onClick={() => {
                                        openNotificationWithIcon_uploading(
                                            'info',
                                            this.state.loadingUploadingFee
                                        );
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <InfoCircleOutlined
                                        style={{ color: '#52c41a' }}
                                    />
                                </span>
                                {this.props.hire_loading_uploading == true &&
                                    this.props.loading_uploading_fee && (
                                        <>
                                            {' Phí: ' +
                                                CommonUtils.formattedValue(
                                                    this.props
                                                        .loading_uploading_fee
                                                )}
                                        </>
                                    )}
                            </Checkbox>
                        </Col>
                        {/* end check box ============================== */}

                        <Col span={24}>
                            <Title level={5}>
                                <FormattedMessage id="order.goods_description" />
                            </Title>
                            <TextArea
                                rows={4}
                                value={this.props.description}
                                onChange={(e) => {
                                    this.props.setStateFromChild(
                                        'description',
                                        e.target.value
                                    );
                                }}
                            />
                        </Col>
                    </Row>
                </Card>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return { lang: state.app.language };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderInfo);

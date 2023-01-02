import axios from '../axios';

import { notification } from 'antd';

import { getAddressBookService } from './addressBookService';
import { getAllCodeByKeyService } from './allCodeService';
import { getAllPayerService } from './payerService';
import { getAllUsersService } from './userService';
import { getTrackingService } from './trackingService';

import { getInvoiceByConditionService } from './invoiceService';

const crypto = require('crypto');

// api =======================================================================
const addOrderService = (data) => {
    // console.log('addOrderService:', data);
    let objOrder = {
        own_user: data.own_user,

        sender_id: data.sender_id,
        receiver_id: data.receiver_id,

        receiver_contact_name: data.receiver_contact_name,
        receiver_alias: data.receiver_alias,
        receiver_phone: data.receiver_phone,

        receiver_addr_city_code: data.receiver_addr_city_code,
        receiver_addr_city_name: data.receiver_addr_city_name,

        receiver_addr_district_code: data.receiver_addr_district_code,
        receiver_addr_district_name: data.receiver_addr_district_name,

        receiver_addr_ward_code: data.receiver_addr_ward_code,
        receiver_addr_ward_name: data.receiver_addr_ward_name,

        receiver_addr_street: data.receiver_addr_street,

        // payer
        payer_id: data.payer_id,
        payment_code: data.payment_code,
        payment_reference_code: data.payment_reference_code,

        weight: data.weight,
        number_package: data.number_package,
        commodity_value: data.commodity_value,
        length: data.length,
        width: data.width,
        height: data.height,
        goods_code: data.goods_code,

        number_of_vehicle: data.number_of_vehicle,
        vehicle_code: data.vehicle_code,
        tonage_code: data.tonage_code,

        pickup_date: data.pickup_date,
        finish_date: data.finish_date,

        is_frozen_storage: data.is_frozen_storage,
        is_danger: data.is_danger,
        do_buy_insurance: data.do_buy_insurance,
        hire_loading_uploading: data.hire_loading_uploading,
        no_empty_container: data.no_empty_container,

        description: data.description,
        note: data.note,

        cod_fee: data.cod_fee,
        total_price: data.total_price,
        intend_time: data.intend_time,

        //add fee
        loading_uploading_fee: data.loading_uploading_fee,
        distance: data.distance,
        insurance_fee: data.insurance_fee,
        cod: data.cod,
    };

    return axios.post('/api/order/create-new-order', objOrder);
};

// const getAllOrderByOwnUserService = (userId) => {
//     // ko có init - hạn chế dùng
//     // template string
//     return axios.get(`/api/order/get-all-order-by-own-user?own_user=${userId}`);
// };

const getOrderService = (idInput) => {
    // template string
    return axios.get(`/api/order/get-all-order?id=${idInput}`);
};

const getOrderByStatusService = (statusInput, own_userInput) => {
    if (!own_userInput) {
        // template string
        return axios.get(
            `/api/order/get-all-order-by-status?status=${statusInput}`
        );
    } else {
        // template string
        return axios.get(
            `/api/order/get-all-order-by-status?status=${statusInput}&own_user=${own_userInput}`
        );
    }
};

const getOrderByStatusInProcessService = () => {
    // template string
    return axios.get(`/api/order/get-all-order-by-status-in-process`);
};

const addDraftOrderService = (data) => {
    // console.log('addOrderService:', data);
    let objOrder = {
        own_user: data.own_user,

        sender_id: data.sender_id,
        receiver_id: data.receiver_id,

        receiver_contact_name: data.receiver_contact_name,
        receiver_alias: data.receiver_alias,
        receiver_phone: data.receiver_phone,

        receiver_addr_city_code: data.receiver_addr_city_code,
        receiver_addr_city_name: data.receiver_addr_city_name,

        receiver_addr_district_code: data.receiver_addr_district_code,
        receiver_addr_district_name: data.receiver_addr_district_name,

        receiver_addr_ward_code: data.receiver_addr_ward_code,
        receiver_addr_ward_name: data.receiver_addr_ward_name,

        receiver_addr_street: data.receiver_addr_street,

        // payer
        payer_id: data.payer_id,
        payment_code: data.payment_code,
        payment_reference_code: data.payment_reference_code,

        weight: data.weight,
        number_package: data.number_package,
        commodity_value: data.commodity_value,
        length: data.length,
        width: data.width,
        height: data.height,
        goods_code: data.goods_code,

        number_of_vehicle: data.number_of_vehicle,
        vehicle_code: data.vehicle_code,
        tonage_code: data.tonage_code,

        pickup_date: data.pickup_date,
        finish_date: data.finish_date,

        is_frozen_storage: data.is_frozen_storage,
        is_danger: data.is_danger,
        do_buy_insurance: data.do_buy_insurance,
        hire_loading_uploading: data.hire_loading_uploading,
        no_empty_container: data.no_empty_container,

        description: data.description,
        note: data.note,

        cod_fee: data.cod_fee,
        total_price: data.total_price,
        intend_time: data.intend_time,

        //add fee
        loading_uploading_fee: data.loading_uploading_fee,
        distance: data.distance,
        insurance_fee: data.insurance_fee,
        cod: data.cod,
    };

    return axios.post('/api/order/create-new-draft-order', objOrder);
};

const editOrderService = (data) => {
    // console.log('editOrderService:', data);
    let objOrder = {
        id: data.orderId,
        status: data.status,
    };

    return axios.put('/api/order/edit-order', objOrder);
};

const searchOrderByOrderCodeService = (order_code) => {
    // template string
    return axios.get(
        `/api/order/search-order-by-order-code?order_code=${order_code}`
    );
};

// handle logic ========================================================================
const initTableOrderService = async (dataFromApi) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('dataFromApi at initTableOrderService:', dataFromApi);
            let temp = [];
            let idx = 0;
            // ordinal numbering for row
            await dataFromApi.forEach(async (i) => {
                // handle data
                // own_user
                var own_user = i.own_user_record;

                own_user = own_user[0];
                var own_user_name = `${own_user.name} - ${own_user.email}`;

                // order_status
                let status = i.status_record;
                status = status[0];
                let status_name_input = status.value_vi;

                // sender
                let sender = i.sender_record;
                sender = sender[0];
                let sender_address = handleStringFormatAddress(
                    sender.addr_street,
                    sender.addr_ward.name,
                    sender.addr_district.name,
                    sender.addr_city.name
                );
                let sender_contact_name = sender.contact_name;
                let sender_phone = sender.phone;
                let sender_addr_district = sender.addr_district.name;
                let sender_addr_city = sender.addr_city.name;

                //receiver
                let receiver_address = handleStringFormatAddress(
                    i.receiver_addr_street,
                    i.receiver_addr_ward.name,
                    i.receiver_addr_district.name,
                    i.receiver_addr_city.name
                );

                let receiver_addr_district = i.receiver_addr_district.name;
                let receiver_addr_city = i.receiver_addr_city.name;

                //  vehicle
                let vehicle = i.vehicle_record;
                vehicle = vehicle[0];
                let vehicle_name_input = vehicle.value_vi;

                let tonage = i.tonage_record;
                tonage = tonage[0];
                let tonage_name_input = tonage.value_vi;

                // size
                let size_input = `${i.length} x ${i.width} x ${i.height}`;

                // payer
                let payer = i.payer_record;

                payer = payer[0];
                let payer_name_input = '';
                if (payer.payment_type == 'atm') {
                    payer_name_input = `${payer.payer_name} - ${payer.bank} - ATM: ${payer.atm_id}`;
                } else {
                    payer_name_input = `${payer.payer_name} - Momo: ${payer.phone}`;
                }

                // payment_code
                let payment_code = i.payment_record;

                payment_code = payment_code[0];
                let payment_code_input = payment_code.value_vi;

                // get tracking number
                let trackings = i.tracking_record;

                // is multiple order
                let check_multiple_order_record = i.check_multiple_order_record;
                let isMultipleOrder = false;
                if (check_multiple_order_record.length > 1) {
                    isMultipleOrder = true;
                }

                // invoice
                let invoice = i.invoice_record;
                if (invoice.length > 0) {
                    invoice = invoice[0];
                }

                // add to orderList
                idx++;
                await temp.push({
                    key: i._id,
                    no: idx,
                    own_user: {
                        own_user: own_user._id,
                        own_user_name: own_user_name,
                    },

                    order_code: {
                        order_code: i.order_code,
                        key: i._id,
                        isMultipleOrder: isMultipleOrder,
                    },
                    status: {
                        status_name_input: status_name_input,
                        status: i.status,
                        invoice:
                            invoice && invoice.status ? invoice.status : '',
                    },
                    sender: {
                        contact_name: sender_contact_name,
                        phone: sender_phone,
                        address: sender_address,
                        sender_addr_district: sender_addr_district,
                        sender_addr_city: sender_addr_city,
                    },
                    receiver: {
                        contact_name: i.receiver_contact_name,
                        phone: i.receiver_phone,
                        address: receiver_address,
                        receiver_addr_district: receiver_addr_district,
                        receiver_addr_city: receiver_addr_city,
                    },
                    vehicle: {
                        vehicle_name: vehicle_name_input,
                        tonage_name: tonage_name_input,
                        number_of_vehicle: i.number_of_vehicle,
                    },
                    goods: {
                        number_package: i.number_package,
                        weight: i.weight,
                        size: size_input,
                    },

                    service: {
                        is_frozen_storage: i.is_frozen_storage,
                        is_danger: i.is_danger,
                        do_buy_insurance: i.do_buy_insurance,
                        hire_loading_uploading: i.hire_loading_uploading,
                        no_empty_container: i.no_empty_container,
                    },
                    fee: {
                        cod_fee: i.cod_fee,
                        commodity_value: i.commodity_value,
                        total_price: i.total_price,
                        insurance_fee: i.insurance_fee,
                        cod: i.cod,
                        loading_uploading_fee: i.loading_uploading_fee,
                    },
                    payer: {
                        payer_name: payer_name_input,
                        payment_code: payment_code_input,
                        payment_reference_code: i.payment_reference_code,
                    },

                    description: i.description,

                    note: i.note,

                    pickup_date: i.pickup_date,
                    intend_time: i.intend_time,
                    finish_date: i.finish_date,
                    createDate: i.created.time,

                    trackings: {
                        trackings: trackings,
                        num_of_trackings: trackings.length,
                        number_of_vehicle: i.number_of_vehicle,
                        percent: Math.floor(
                            (+trackings.length /
                                parseFloat(+i.number_of_vehicle)) *
                                100
                        ),
                    },
                });
            });

            resolve(temp);
        } catch (error) {
            console.log('Error: ', error);
            reject(error);
        }
    });
};

const initOnceOrderToDisplayService = async function (orderFromApi) {
    try {
        let temp = {};

        let order = orderFromApi;
        // vehicle
        // handle data
        // own_user
        let own_user = await getAllUsersService(order.own_user);
        own_user = own_user.user;
        let own_user_name = `${own_user.name} - ${own_user.email}`;

        // order_status
        let status = await getAllCodeByKeyService(order.status);
        status = status.allCode;
        let status_name_input = status[0].value_vi;

        // sender
        let sender = await getAddressBookService(order.sender_id);
        sender = sender.ab;
        let sender_address = handleStringFormatAddress(
            sender.addr_street,
            sender.addr_ward.name,
            sender.addr_district.name,
            sender.addr_city.name
        );
        let sender_contact_name = sender.contact_name;
        let sender_phone = sender.phone;
        let sender_addr_district = sender.addr_district.name;
        let sender_addr_city = sender.addr_city.name;

        //receiver
        let receiver_address = handleStringFormatAddress(
            order.receiver_addr_street,
            order.receiver_addr_ward.name,
            order.receiver_addr_district.name,
            order.receiver_addr_city.name
        );
        let receiver_addr_district = order.receiver_addr_district.name;
        let receiver_addr_city = order.receiver_addr_city.name;

        //  vehicle
        let vehicle = await getAllCodeByKeyService(order.vehicle_code);
        vehicle = vehicle.allCode;
        let vehicle_name_input = vehicle[0].value_vi;

        let tonage = await getAllCodeByKeyService(order.tonage_code);
        tonage = tonage.allCode;
        let tonage_name_input = tonage[0].value_vi;

        // size
        let size_input = `${order.length} x ${order.width} x ${order.height}`;

        // payer
        let payer = await getAllPayerService(order.payer_id);

        payer = payer.payer;
        let payer_name_input = '';
        if (payer.payment_type == 'atm') {
            payer_name_input = `${payer.payer_name} - ${payer.bank} - ATM: ${payer.atm_id}`;
        } else {
            payer_name_input = `${payer.payer_name} - Momo: ${payer.phone}`;
        }

        // payment_code
        let payment_code = await getAllCodeByKeyService(order.payment_code);
        payment_code = await payment_code.allCode;

        let payment_code_input = payment_code[0].value_vi;

        // goods_code
        let goods_code = await getAllCodeByKeyService(order.goods_code);
        goods_code = await goods_code.allCode;
        let goods_code_input = goods_code[0].value_vi;

        temp = {
            key: order._id,
            own_user: {
                own_user: own_user._id,
                own_user_name: own_user_name,
            },

            order_code: {
                order_code: order.order_code,
                key: order._id,
            },
            status: {
                status_name_input: status_name_input,
                status: order.status,
            },
            sender: {
                contact_name: sender_contact_name,
                phone: sender_phone,
                address: sender_address,
                sender_addr_district: sender_addr_district,
                sender_addr_city: sender_addr_city,
            },
            receiver: {
                contact_name: order.receiver_contact_name,
                phone: order.receiver_phone,
                address: receiver_address,
                receiver_addr_district: receiver_addr_district,
                receiver_addr_city: receiver_addr_city,
            },
            vehicle: {
                vehicle_name: vehicle_name_input,
                tonage_name: tonage_name_input,
                number_of_vehicle: order.number_of_vehicle,
            },
            goods: {
                number_package: order.number_package,
                weight: order.weight,
                size: size_input,
            },

            service: {
                is_frozen_storage: order.is_frozen_storage,
                is_danger: order.is_danger,
                do_buy_insurance: order.do_buy_insurance,
                hire_loading_uploading: order.hire_loading_uploading,
                no_empty_container: order.no_empty_container,
            },
            fee: {
                cod_fee: order.cod_fee,
                commodity_value: order.commodity_value,
                total_price: order.total_price,
            },
            payer: {
                payer_name: payer_name_input,
                payment_code: payment_code_input,
                payment_reference_code: order.payment_reference_code,
            },

            description: order.description,

            note: order.note,

            pickup_date: order.pickup_date,
            intend_time: order.intend_time,
            finish_date: order.finish_date,
            createDate: order.created.time,
        };

        return temp;
    } catch (error) {
        console.log('Error: ', error);
    }
};

const handleStringFormatAddress = (street, ward, district, city) => {
    return `${street}, ${ward}, ${district}, ${city}`;
};

const checkIsMultipleOrderService = async (orderId) => {
    try {
        let order = await getOrderService(orderId);
        order = order.order;
        let orderList = await searchOrderByOrderCodeService(order.order_code);
        orderList = orderList.order;

        if (orderList.length > 1) {
            return true;
        } else return false;
    } catch (error) {
        console.log('Error:', error);
    }
};

// end logic ====================================================

const searchOrderByMultipleCondition = (data) => {
    // object search
    var filters = {
        status: data.status === 'all' ? undefined : data.status,
        start_date: data.start_date === '' ? undefined : data.start_date,
        end_date: data.end_date === '' ? undefined : data.end_date,
        is_last_30: 'false',
        is_last_7: 'false',
        is_last_month: 'false',
        own_user: !data.own_user ? undefined : data.own_user,
    };

    // if we use time_filter_mode, we do not use start_date and end_date
    filters[`${data.time_filter_mode}`] = 'true';

    return axios.post('/api/order/search-order-by-mutilple-condition', filters);
};

const addMultileOrderService = async (data) => {
    // single order -> create unique order code
    const id = await crypto.randomBytes(4).toString('hex');
    // console.log(id);

    let receiver_list = data.receiver_list;
    await receiver_list.forEach(async (i) => {
        let objOrder = await {
            // phần chung
            // tự tạo order_code giống nhau cho tất cả đơn chung
            order_code: id,

            own_user: data.own_user,

            sender_id: data.sender_id,

            // payer
            payer_id: data.payer_id,
            payment_code: data.payment_code,
            payment_reference_code: data.payment_reference_code,

            weight: data.weight,
            number_package: data.number_package,
            commodity_value: data.commodity_value,
            length: data.length,
            width: data.width,
            height: data.height,
            goods_code: data.goods_code,

            vehicle_code: data.vehicle_code,
            tonage_code: data.tonage_code,

            pickup_date: data.pickup_date,
            finish_date: data.finish_date,

            is_frozen_storage: data.is_frozen_storage,
            is_danger: data.is_danger,
            do_buy_insurance: data.do_buy_insurance,
            hire_loading_uploading: data.hire_loading_uploading,
            no_empty_container: data.no_empty_container,

            description: data.description,
            note: data.note,

            cod_fee: data.cod_fee,

            //add fee
            loading_uploading_fee: data.loading_uploading_fee,
            distance: i.distance,
            insurance_fee: data.insurance_fee,
            cod: data.cod,

            // phần riêng theo list receiver

            receiver_id: i.receiver_id,

            receiver_contact_name: i.address.receiver_contact_name,
            receiver_alias: i.address.receiver_alias,
            receiver_phone: i.address.receiver_phone,

            receiver_addr_city_code: i.address.receiver_addr_city_code,
            receiver_addr_city_name: i.address.receiver_addr_city_name,

            receiver_addr_district_code: i.address.receiver_addr_district_code,
            receiver_addr_district_name: i.address.receiver_addr_district_name,

            receiver_addr_ward_code: i.address.receiver_addr_ward_code,
            receiver_addr_ward_name: i.address.receiver_addr_ward_name,

            receiver_addr_street: i.address.receiver_addr_street,

            total_price: i.total_fee,
            intend_time: i.intend_time,
            number_of_vehicle: i.number_of_vehicle,
        };

        await callApiCreateMultiOrderService(objOrder);
    });
};

const callApiCreateMultiOrderService = (data) => {
    return axios.post('/api/order/create-multi-order', data);
};

const editOrderByOrderCodeService = (data) => {
    console.log('editOrderByOrderCodeService:', data);
    let objOrder = {
        order_code: data.order_code,
        status: data.status,
    };

    return axios.put('/api/order/edit-order-by-order-code', objOrder);
};

const openNotificationWithIcon = (type, PERCENT_INSURANCE, VAT) => {
    notification[type]({
        message: 'Bảo hiểm hàng hóa',
        style: {
            width: 570,
        },
        description: `Cách tính:
        Phí bảo hiểm = ${PERCENT_INSURANCE}% giá trị hàng hóa * (100% + ${VAT}%) (thêm ${VAT}% VAT).  
        PN Logistic chỉ mua bảo hiểm của Công ty Bảo hiểm giúp khách hàng, trách nhiệm bảo hiểm hàng hóa thuộc về Công ty Bảo hiểm.
        `,
        placement: 'top',
    });
};

const openNotificationWithIcon_uploading = (type, LOADING_UPLOADING_FEE) => {
    notification[type]({
        message: 'Phí thuê bốc dỡ hàng',
        style: {
            width: 570,
        },
        description: `${LOADING_UPLOADING_FEE} VNĐ / 1 tấn/ 1 điểm bốc dỡ hàng
        `,
        placement: 'top',
    });
};

const openNotificationWithIcon_frozen = (type, percent_frozen) => {
    notification[type]({
        message: 'Xe đông lạnh ',
        style: {
            width: 570,
        },
        description: `Giá cước cao hơn khoảng ${percent_frozen}% bình thường.
        `,
        placement: 'top',
    });
};

const getAllOrderByOwnUserInitTableService = (userId) => {
    // template string
    return axios.get(
        `/api/order/get-all-order-by-own-user-init-table?own_user=${userId}`
    );
};

export {
    addOrderService,
    // getAllOrderByOwnUserService,
    getOrderService,
    getOrderByStatusService,
    getOrderByStatusInProcessService,
    addDraftOrderService,
    editOrderService,
    searchOrderByOrderCodeService,
    initTableOrderService,
    searchOrderByMultipleCondition,
    initOnceOrderToDisplayService,
    addMultileOrderService,
    checkIsMultipleOrderService,
    editOrderByOrderCodeService,
    openNotificationWithIcon,
    openNotificationWithIcon_uploading,
    openNotificationWithIcon_frozen,
    getAllOrderByOwnUserInitTableService,
};

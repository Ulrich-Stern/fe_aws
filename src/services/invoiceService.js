import axios from '../axios';
import { getAllCodeByKeyService } from './allCodeService';
import { getAllPayerService } from './payerService';

const getInvoiceByConditionService = (userId, orderId, order_code) => {
    let condObj = {
        own_user: userId,
        order_id: orderId,
        order_code: order_code,
    };
    //  removing undefined fields from an object
    Object.keys(condObj).forEach((key) =>
        condObj[key] === undefined || condObj[key] === ''
            ? delete condObj[key]
            : {}
    );
    // template string
    return axios.post(`/api/invoice/get-invoice-by-condition`, condObj);
};

const getAllInvoiceService = (id) => {
    // template string

    // let $temp = axios.get(`/api/invoice/get-invoice?id=all`);
    // console.log($temp);
    return axios.get(`/api/invoice/get-invoice?id=${id}`);
};

const addInvoiceService = (data) => {
    let invoiceObj = {
        own_user: data.own_user,
        order_id: data.order_id,
        sub_total: data.sub_total,
        total: data.total,
        due_date: data.due_date,
        content: data.content,
        tax: data.tax,
        main_fee: data.main_fee,
        order_code: data.order_code,
    };

    return axios.post('/api/invoice/create-new-invoice', invoiceObj);
};

const initTableInvoiceService = async (dataFromApi) => {
    try {
        let temp = [];
        let idx = 0;

        await dataFromApi.forEach(async (i) => {
            idx++;

            // own_user
            let own_user = i.own_user_record;

            own_user = own_user[0];
            let own_user_name = `${own_user.name} - ${own_user.email}`;
            let companyName = own_user.companyName;
            let id_or_tax = own_user.id_or_tax;
            let own_user_address = `${own_user.addr_street} - ${own_user.addr_ward.name} - ${own_user.addr_district.name} - ${own_user.addr_city.name}`;

            // order_id
            let order = i.order_record;
            order = order[0];
            let order_code = order.order_code;

            //payer
            // // payer
            // let payer = await getAllPayerService(order.payer_id);

            // payer = payer.payer;
            // let payer_name_input = '';
            // if (payer.payment_type == 'atm') {
            //     payer_name_input = `${payer.payer_name} - ${payer.bank} - ATM: ${payer.atm_id}`;
            // } else {
            //     payer_name_input = `${payer.payer_name} - Momo: ${payer.phone}`;
            // }

            // // payment_code
            // let payment_code = await getAllCodeByKeyService(order.payment_code);
            // payment_code = await payment_code.allCode;
            // let payment_code_input = payment_code[0].value_vi;

            await temp.push({
                key: i._id,
                no: idx,
                own_user: {
                    own_user: own_user._id,
                    own_user_name: own_user_name,
                    companyName: companyName,
                    id_or_tax: id_or_tax,
                    own_user_address: own_user_address,
                },

                main_fee: i.main_fee,
                sub_total: i.sub_total,
                total: i.total,
                due_date: i.due_date,
                content: i.content,
                tax: i.tax,
                status: i.status,

                order_code: {
                    order_code: order_code,
                    order_id: i.order_id,
                    is_multiple:
                        i.order_record_list && i.order_record_list.length > 1
                            ? true
                            : false,
                },
                // payer: {
                //     payer_name: payer_name_input,
                //     payment_code: payment_code_input,
                //     payment_reference_code: order.payment_reference_code,
                // },
                created: i.created.time,

                // optional
                insurance: i.insurance,
                cod_money: i.cod_money,
                loading_unloading_fee: i.loading_unloading_fee,
                container_retal_fee: i.container_retal_fee,
            });
        });

        return temp;
    } catch (error) {
        console.log('Error: ', error);
    }
};

const initTableInvoiceOnceService = async (dataFromApi) => {
    try {
        if (!dataFromApi || dataFromApi.length === 0) {
            return null;
        }
        let temp = [];
        let idx = 0;

        // await dataFromApi.forEach(async (i) => {
        var i = dataFromApi[0];
        idx++;

        // own_user
        let own_user = i.own_user_record;

        own_user = own_user[0];
        let own_user_name = `${own_user.name} - ${own_user.email}`;
        let companyName = own_user.companyName;
        let id_or_tax = own_user.id_or_tax;
        let own_user_address = `${own_user.addr_street} - ${own_user.addr_ward.name} - ${own_user.addr_district.name} - ${own_user.addr_city.name}`;

        // order_id
        let order = i.order_record;
        order = order[0];
        let order_code = order.order_code;

        //payer
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

        await temp.push({
            key: i._id,
            no: idx,
            own_user: {
                own_user: own_user._id,
                own_user_name: own_user_name,
                companyName: companyName,
                id_or_tax: id_or_tax,
                own_user_address: own_user_address,
            },

            main_fee: i.main_fee,
            sub_total: i.sub_total,
            total: i.total,
            due_date: i.due_date,
            content: i.content,
            tax: i.tax,
            status: i.status,

            order_code: { order_code: order_code, order_id: i.order_id },
            payer: {
                payer_name: payer_name_input,
                payment_code: payment_code_input,
                payment_reference_code: order.payment_reference_code,
            },
            created: i.created.time,

            // optional
            insurance: i.insurance,
            cod_money: i.cod_money,
            loading_unloading_fee: i.loading_unloading_fee,
            container_retal_fee: i.container_retal_fee,
        });
        // });

        return temp;
    } catch (error) {
        console.log('Error: ', error);
    }
};

const getInvoicesByOrderCodeService = (order_code) => {
    return axios.get(
        `/api/invoice/search-invoice-by-order-code?order_code=${order_code}`
    );
};

const getInvoicesByMultipleConditionCodeService = (data) => {
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
    if (data.time_filter_mode) {
        filters[`${data.time_filter_mode}`] = 'true';
    }

    return axios.post(
        '/api/invoice/search-invoice-by-mutilple-condition',
        filters
    );
};

const editInvoiceService = (data) => {
    let objInvoice = {
        id: data.invoice_id,
        status: data.status,
    };

    return axios.put('/api/invoice/edit-invoice', objInvoice);
};

export {
    getInvoiceByConditionService,
    initTableInvoiceService,
    getAllInvoiceService,
    initTableInvoiceOnceService,
    addInvoiceService,
    getInvoicesByOrderCodeService,
    getInvoicesByMultipleConditionCodeService,
    editInvoiceService,
};

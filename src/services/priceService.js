import axios from '../axios';

import { getLocateSerice, getDistanceAPIService } from './systemService';

import { getAddressBookService } from './addressBookService';

import { getAllCodeByKeyService } from './allCodeService';

const getPriceService = (id, vehicle_code) => {
    if (!vehicle_code) {
        return axios.get(`/api/price/get-all-price?id=${id}`);
    } else {
        // template string
        return axios.get(
            `/api/price/get-all-price?id=${id}&vehicle_code=${vehicle_code}`
        );
    }
};

const editPriceService = (data) => {
    let priceObj = {
        price_4: data.price_4,
        price_5_15: data.price_5_15,
        price_16_100: data.price_16_100,
        price_more: data.price_more,
        id: data.id,
    };

    return axios.put('/api/price/edit-price', priceObj);
};

const addPriceService = (data) => {
    let priceObj = {
        name: data.name,
        vehicle_code: data.vehicle_code,
        price_4: data.price_4,
        price_5_15: data.price_5_15,
        price_16_100: data.price_16_100,
        price_more: data.price_more,
        id: data.id,
    };

    return axios.post('/api/price/create-new-price', priceObj);
};

const deletePriceService = (id) => {
    return axios.delete('/api/price/delete-price', { data: { id: id } });
};

// handle logic ========================================================================
const initTablePriceService = async (dataFromApi) => {
    try {
        // console.log('dataFromApi:', dataFromApi);
        let temp = [];
        let idx = 0;
        // ordinal numbering for row
        await dataFromApi.forEach(async (i) => {
            // handle data
            let allcode = await getAllCodeByKeyService(i.vehicle_code);
            allcode = allcode.allCode;
            allcode = allcode[0];
            // console.log('allcode:', allcode);

            let vehicle = await getAllCodeByKeyService(allcode.type);
            vehicle = vehicle.allCode;
            vehicle = vehicle[0];
            // console.log('vehicle:', vehicle);
            // add to orderList
            idx++;
            await temp.push({
                key: i._id,
                no: idx,
                vehicle: vehicle,

                tonage: allcode,
                name: i.name,
                price_4: i.price_4,
                price_5_15: i.price_5_15,
                price_16_100: i.price_16_100,
                price_more: i.price_more,
            });
        });

        return temp;
    } catch (error) {
        console.log('Error: ', error);
    }
};

const getDistanceService = async (data) => {
    try {
        let sender_id = data.sender_id;

        let sender = await getAddressBookService(sender_id);

        sender = sender.ab;

        let sender_location = {
            long: sender.long,
            lat: sender.lat,
        };

        let receiver = `${data.receiver_addr_ward_name}, ${data.receiver_addr_district_name}, ${data.receiver_addr_city_name}`;
        let receiver_location = await getLocateSerice(receiver);

        let distance = await getDistanceAPIService(
            sender_location,
            receiver_location
        );

        distance = Math.round(distance);
        distance = distance.toString();

        return distance;
    } catch (error) {
        console.log('Error: ', error);
    }
};

const calculateInsuranceService = async (commodity_value) => {
    try {
        if (+commodity_value >= 500000000) {
            let insurance_fee = +commodity_value * (0.04 / 100) * (108 / 100);
            insurance_fee = Math.round(insurance_fee);
            insurance_fee = insurance_fee.toString();
            return insurance_fee;
        }
        return 0;
    } catch (error) {
        console.log('Error: ', error);
    }
};

const getCalcalateFeeService = async (distance, number_of_vehicle, data) => {
    try {
        // get price of this vehicle tonange
        let price = await getPriceService('all', data.tonage_code);
        price = price.price;
        price = price[0];

        // tính đơn giá
        let cur_price = 0;
        if (+distance < 4) {
            cur_price = price.price_4;
            distance = 1;
        } else if (+distance < 15) {
            cur_price = price.price_5_15;
        } else if (+distance < 100) {
            cur_price = price.price_16_100;
        } else {
            cur_price = price.price_more;
        }

        // tính tiền gốc
        let total_fee = +number_of_vehicle * +cur_price * +distance;

        // cộng bảo hiểm
        if (data.do_buy_insurance == true) {
            let insurance_fee =
                +data.commodity_value * (0.04 / 100) * (110 / 100);

            total_fee = +total_fee + insurance_fee;
        }

        // bảo quản đông lạnh
        if (data.is_frozen_storage == true) {
            total_fee = +total_fee * 1.3;
        }

        // phí bốc dỡ hàng - 80000/1Tấn
        if (data.hire_loading_uploading == true) {
            total_fee = +total_fee + +data.weight * 80000 * 2;
        }

        // cod_fee
        if (data.cod) {
            total_fee = +total_fee + +data.cod * 0.01;
        }

        total_fee = Math.round(total_fee);
        total_fee = total_fee.toString();
        return total_fee;
    } catch (error) {
        console.log('Error: ', error);
    }
};

const getDistanceInMultipleOrderService = async (data, address_receiver) => {
    try {
        let sender_id = data.sender_id;

        let sender = await getAddressBookService(sender_id);

        sender = sender.ab;

        let sender_location = {
            long: sender.long,
            lat: sender.lat,
        };

        let receiver = address_receiver;
        let receiver_location = await getLocateSerice(receiver);

        let distance = await getDistanceAPIService(
            sender_location,
            receiver_location
        );

        distance = Math.round(distance * 10) / 10;
        distance = distance.toString();

        return distance;
    } catch (error) {
        console.log('Error: ', error);
    }
};

const getCalcalateFeeMultipleOrderService = async (
    distance,
    number_of_vehicle,
    data
) => {
    try {
        // get price of this vehicle tonange
        let price = await getPriceService('all', data.tonage_code);
        price = price.price;
        price = price[0];

        // tính đơn giá
        let cur_price = 0;
        if (+distance < 4) {
            cur_price = price.price_4;
            distance = 1;
        } else if (+distance < 15) {
            cur_price = price.price_5_15;
        } else if (+distance < 100) {
            cur_price = price.price_16_100;
        } else {
            cur_price = price.price_more;
        }

        // tính tiền gốc
        let total_fee = +number_of_vehicle * +cur_price * +distance;

        // bảo quản đông lạnh
        if (data.is_frozen_storage == true) {
            total_fee = +total_fee * 1.3;
        }

        total_fee = Math.round(total_fee);
        total_fee = total_fee.toString();
        return total_fee;
    } catch (error) {
        console.log('Error: ', error);
    }
};

const getAllPriceInitTableService = (id, vehicle_code) => {
    if (!vehicle_code) {
        return axios.get(`/api/price/get-all-price-init-table?id=${id}`);
    } else {
        // template string
        return axios.get(
            `/api/price/get-all-price-init-table?id=${id}&vehicle_code=${vehicle_code}`
        );
    }
};

export {
    getPriceService,
    getDistanceService,
    getCalcalateFeeService,
    calculateInsuranceService,
    getDistanceInMultipleOrderService,
    getCalcalateFeeMultipleOrderService,
    initTablePriceService,
    editPriceService,
    addPriceService,
    deletePriceService,
    getAllPriceInitTableService,
};

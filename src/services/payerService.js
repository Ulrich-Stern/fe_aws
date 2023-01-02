import axios from '../axios';

const getAllPayerByOwnUserService = (userId) => {
    // template string
    return axios.get(`/api/payer/get-all-payer-by-own-user?own_user=${userId}`);
};

const addPayerService = (data) => {
    // console.log('data at addPayerService:', data);
    let objPayer = {};
    if (data.payment_type == 'atm') {
        objPayer = {
            own_user: data.own_user,
            payer_name: data.payer_name,
            bank: data.bank,
            atm_id: data.atm_id,
            payment_type: data.payment_type,
        };
    } else {
        objPayer = {
            own_user: data.own_user,
            payer_name: data.payer_name,
            phone: data.phone,
            payment_type: data.payment_type,
        };
    }
    return axios.post('/api/payer/create-new-payer', objPayer);
};

const getAllPayerService = (userId) => {
    // template string
    return axios.get(`/api/payer/get-all-payer?id=${userId}`);
};

// LOGIC
// ex name: 'Jack 1 - ocb - ATM: 124', _id: '632aded3e81e77b841514001'
const getObjectPayerToDisplayService = async (userId) => {
    let dataInput = await getAllPayerByOwnUserService(userId);
    dataInput = dataInput.payer;
    let obj = [];
    dataInput.forEach((i) => {
        let name = '';
        if (i.payment_type == 'atm') {
            name = `${i.payer_name} - ${i.bank} - ATM: ${i.atm_id}`;
        } else {
            name = `${i.payer_name} - Momo: ${i.phone}`;
        }

        let _id = i._id;
        obj.push({
            name: name,
            _id: _id,
        });
    });
    return obj;
};

export {
    addPayerService,
    getAllPayerByOwnUserService,
    getAllPayerService,
    getObjectPayerToDisplayService,
};

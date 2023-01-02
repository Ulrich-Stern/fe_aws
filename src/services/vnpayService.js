import axios from '../axios';

const createPaymentUrlService = (data) => {
    let order_code = data.order_code;
    order_code = order_code.order_code;
    let payObj = {
        amount: data.total || '',
        bankCode: '',
        orderDescription: order_code || '',
        orderType: 'billpayment',
        language: '',
    };

    return axios.post('/create_payment_url', payObj);
};

export { createPaymentUrlService };

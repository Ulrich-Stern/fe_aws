import actionTypes from './actionTypes';

import {
    getPriceService,
    initTablePriceService,
    getAllPriceInitTableService,
} from '../../services/priceService';

import {
    initTableOrderService,
    getAllOrderByOwnUserInitTableService,
} from '../../services/orderService';

import { toast } from 'react-toastify';

export const fetchAllPrice = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getPriceService('all');
            let temp = await getAllPriceInitTableService('all');
            // console.log('temp:', temp);
            if (res && res.errCode === 0) {
                dispatch(fetchAllPriceSuccess(res.price, temp.price));
            } else {
                dispatch(fetchAllPriceFail());
            }
        } catch (error) {
            console.log('redux error:', error);
            dispatch(fetchAllPriceFail());
        }
    };
};

export const fetchAllPriceSuccess = (pricesFromApiRedux, pricesRedux) => ({
    type: actionTypes.FETCH_ALL_PRICE_SUCCESS,
    pricesFromApiRedux: pricesFromApiRedux,
    pricesRedux: pricesRedux,
});

export const fetchAllPriceFail = () => ({
    type: actionTypes.FETCH_ALL_PRICE_FAIL,
});

export const initTableOrderRedux = (dataFromApi) => {
    return async (dispatch, getState) => {
        try {
            let temp = await initTableOrderService(dataFromApi);
            // console.log('temp: ', temp);

            dispatch(initTableOrderSuccess(temp));
        } catch (error) {
            console.log('redux error:', error);
            dispatch(initTableOrderFail());
        }
    };
};

export const initTableOrderSuccess = (orderListRedux) => ({
    type: actionTypes.INIT_TABLE_ORDER_SUCCESS,
    orderListRedux: orderListRedux,
});

export const initTableOrderFail = () => ({
    type: actionTypes.INIT_TABLE_ORDER_FAIL,
});

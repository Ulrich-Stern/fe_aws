import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    userInfo: null,
    pricesFromApiRedux: [],
    pricesRedux: [],
    orderListRedux: [],
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        // vai trò là listener , bắt dispatch gọi từ component và thay đổi state
        case actionTypes.FETCH_ALL_PRICE_SUCCESS:
            state.pricesRedux = action.pricesRedux;
            state.pricesFromApiRedux = action.pricesFromApiRedux;
            return {
                ...state,
            };
        case actionTypes.FETCH_ALL_PRICE_FAIL:
            return {
                ...state,
            };

        // order
        case actionTypes.INIT_TABLE_ORDER_SUCCESS:
            state.orderListRedux = action.orderListRedux;
            return {
                ...state,
            };
        case actionTypes.INIT_TABLE_ORDER_FAIL:
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default adminReducer;

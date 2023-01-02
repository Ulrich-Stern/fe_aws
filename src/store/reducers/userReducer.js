import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    userInfo: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        // vai trò là listener , bắt dispatch gọi từ component và thay đổi state
        case actionTypes.USER_LOGIN_SUCCESS:
            // console.log('check reducer of USER_LOGIN_SUCCESS:', action);
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.userInfo,
            };
        case actionTypes.USER_LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null,
            };
        case actionTypes.PROCESS_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null,
            };
        default:
            return state;
    }
};

export default userReducer;

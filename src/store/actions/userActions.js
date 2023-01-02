import actionTypes from "./actionTypes";

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS,
});

// khai báo các action sẽ có, để các component import  từ đây
export const userLoginSuccess = (userInfo) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: userInfo,
});

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL,
});

export const processLogout = () => ({
    type: actionTypes.PROCESS_LOGOUT,
});

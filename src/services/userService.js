import axios from '../axios';
import * as queryString from 'query-string';

const handleLoginService = (email, password) => {
    return axios.post('/api/user/login', {
        email: email,
        password: password,
    });
};
// export default userService;

const getAllUsersService = (userId) => {
    // template string
    return axios.get(`/api/user/get-all-user?id=${userId}`);
};

// response này chính là json response khi check postman
const createNewUserService = (data) => {
    // console.log('data at createNewUserService:', data);
    let newUser = {
        email: data.userEmail,
        password: data.userPassword,
        name: data.userName,
        phone: data.userPhone,

        addr_city_code: data.userProvinceCode,
        addr_city_name: data.userProvinceName,

        addr_district_code: data.userDistrictCode,
        addr_district_name: data.userDistrictName,

        addr_ward_code: data.userWardCode,
        addr_ward_name: data.userWardName,

        addr_street: data.userStreet,
        gender: data.userGender,
        isBusiness: data.userIsBusiness,
    };
    return axios.post('/api/user/create-new-user', newUser);
};

const deleteUserService = (userId) => {
    // console.log('id', userId);
    return axios.delete('/api/user/delete-user', { data: { id: userId } });
};

const editUserService = (data) => {
    let newUser = {
        id: data.id,
        email: data.userEmail,
        name: data.userName,
        phone: data.userPhone,

        addr_city_code: data.userProvinceCode,
        addr_city_name: data.userProvinceName,

        addr_district_code: data.userDistrictCode,
        addr_district_name: data.userDistrictName,

        addr_ward_code: data.userWardCode,
        addr_ward_name: data.userWardName,

        addr_street: data.userStreet,
        gender: data.userGender,
        isBusiness: data.userIsBusiness,
        companyName: data.companyName,
    };
    // console.log('new user', newUser);
    return axios.put('/api/user/edit-user', newUser);
};

const changePasswordService = (data) => {
    return axios.post('/api/user/change-password', {
        id: data.id,
        old_password: data.old_password,
        new_password: data.new_password,
    });
};

const recoveryPasswordService = (emailInput) => {
    return axios.post('/api/user/forgot-password', {
        email: emailInput,
    });
};

export {
    handleLoginService,
    getAllUsersService,
    createNewUserService,
    deleteUserService,
    editUserService,
    changePasswordService,
    recoveryPasswordService,
};

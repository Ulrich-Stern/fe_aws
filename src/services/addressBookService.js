import axios from '../axios';
import * as queryString from 'query-string';

const AddBookAddressService = (data) => {
    // console.log('data at AddBookAddressService:', data);
    let newAddBookAddress = {
        own_user: data.own_user,
        default: data.default,
        contact_name: data.contact_name,
        alias: data.alias,

        addr_city_code: data.userProvinceCode,
        addr_city_name: data.userProvinceName,

        addr_district_code: data.userDistrictCode,
        addr_district_name: data.userDistrictName,

        addr_ward_code: data.userWardCode,
        addr_ward_name: data.userWardName,

        addr_street: data.street,
        phone: data.phone,

        lat: data.curLat,
        long: data.curLong,
    };
    return axios.post(
        '/api/address-book/create-address-book',
        newAddBookAddress
    );
};

const getAddressBookService = (userId) => {
    // template string
    return axios.get(`/api/address-book/get-address-book?id=${userId}`);
};

const getAddressBookByUserIdService = (userId) => {
    // template string
    return axios.get(
        `/api/address-book/get-all-address-books-by-user-id?id=${userId}`
    );
};

const getAddressBookActiveByUserIdService = (userId) => {
    // template string
    return axios.get(
        `/api/address-book/get-all-address-books-active-by-user-id?id=${userId}`
    );
};

const editAddressBookService = (data) => {
    return axios.put('/api/address-book/edit-address-book', data);
};

// logic
// example: name: 'Bob- SĐT: 0123456789- dsfsdf- Xã Lê Lợi- Huyện Nậm Nhùn- Tỉnh Lai Châu', _id: '6326f69dc194cd0198780407'

const getObjectAddressBookToDisplayService = (addressBook) => {
    let obj = [];
    let count = 0;
    addressBook.forEach((i) => {
        let name = handleStringFormatAddressBook(
            i.alias,
            i.phone,
            i.addr_street,
            i.addr_ward.name,
            i.addr_district.name,
            i.addr_city.name
        );
        let _id = i._id;
        obj.push({
            name: name,
            _id: _id,
            index: count,
            map: { lat: i.lat, long: i.long },
        });
        count++;
    });
    return obj;
};

const handleStringFormatAddressBook = (
    alias,
    phone,
    street,
    ward,
    district,
    city
) => {
    return `${alias}- SĐT: ${phone}- ${street}- ${ward}- ${district}- ${city}`;
};

export {
    AddBookAddressService,
    getAddressBookService,
    getAddressBookByUserIdService,
    editAddressBookService,
    getAddressBookActiveByUserIdService,
    getObjectAddressBookToDisplayService,
};

import axios from '../axios';
import * as queryString from 'query-string';
const MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1IjoicGhvbmdsZSIsImEiOiJjbDBqMGsyaHQwMjl6M2VuZTN3MDA5MWoyIn0.SnO81tLnFfe6IQAWKYdJiQ';

// api địa chỉ
const getAllProvinceVietNamService = () => {
    return fetch('https://provinces.open-api.vn/api/?depth=1')
        .then((res) => res.json())
        .then((data) => {
            return data;
        });
};

const getAllDistrictByCodeService = (code) => {
    return fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
            return data;
        });
};

const getAllWardByCodeService = (code) => {
    return fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
            return data;
        });
};

// MAP BOX
const getLocateSerice = (address) => {
    return fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/"${address}".json?access_token=${MAPBOX_ACCESS_TOKEN}`
    )
        .then((res) => res.json())
        .then(function (responseloca) {
            let locate = {
                lat: responseloca.features[0].center[1],
                long: responseloca.features[0].center[0],
            };
            // console.log('locate 0: ', locate);
            return locate;
        })
        .catch(function (err) {
            console.log('Error: ' + err);
        });
};

const getDistanceAPIService = (addone, addtwo) => {
    return fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${addone.long},${addone.lat};${addtwo.long},${addtwo.lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
    )
        .then((res) => res.json())
        .then(function (responseloca) {
            const distance = responseloca.routes[0].distance / 1000;
            // console.log('distance 0: ', distance);
            return distance;
        })
        .catch(function (err) {
            console.log('Error: ' + err);
        });
};

export {
    getAllProvinceVietNamService,
    getAllDistrictByCodeService,
    getAllWardByCodeService,
    getLocateSerice,
    getDistanceAPIService,
};

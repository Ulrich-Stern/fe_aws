import axios from '../axios';

const getVehicleService = (idInput, vehicle_code) => {
    if (vehicle_code) {
        // template string
        return axios.get(
            `api/vehicle/get-all-vehicle?id=${idInput}&type=${vehicle_code}`
        );
    } else {
        // template string
        return axios.get(`api/vehicle/get-all-vehicle?id=${idInput}`);
    }
};

const addVehicleService = (data) => {
    // console.log('data at addVehicleService:', data);
    let vehicleObj = {
        license_plates: data.license_plates,
        vehicle_code: data.vehicle,
        phone: data.phone,
        driver: data.driver,
        tonage_code: data.tonage,
    };

    return axios.post('/api/vehicle/create-new-vehicle', vehicleObj);
};

const editVehicleService = (data) => {
    // console.log('data at editVehicleService:', data);
    let vehicleObj = {
        license_plates: data.license_plates,
        phone: data.phone,
        driver: data.driver,
        id: data.id,
        status: data.status,
    };

    return axios.put('/api/vehicle/edit-vehicle', vehicleObj);
};

const deleteVehicleService = (id) => {
    return axios.delete('/api/vehicle/delete-vehicle', { data: { id: id } });
};

export {
    getVehicleService,
    addVehicleService,
    editVehicleService,
    deleteVehicleService,
};

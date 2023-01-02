import axios from '../axios';
import { getVehicleService } from './vehicleService';

const getLogTripService = (idInput, trackingIdInput) => {
    // template string
    return axios.get(
        `api/log-trip/get-all-log-trip?id=${idInput}&tracking_id=${trackingIdInput}`
    );
};

const initLogTripsToDisplayService = async function (logTripsFromApi) {
    try {
        let temp = [];
        let idx = -1;
        let logTrips = logTripsFromApi;

        await logTrips.forEach(async (i) => {
            let vehicle = await getVehicleService(i.vehicle_id);
            vehicle = vehicle.vehicle;

            idx++;
            temp.push({
                idx: idx,
                key: i._id,
                vehicle: vehicle,
            });
        });

        return temp;
    } catch (error) {
        console.log('Error: ', error);
    }
};

const addLogTripService = (data) => {
    // console.log('data at addLogTripService:', data);
    let objLog = {
        tracking_id: data.tracking_id,
        content: data.content,
        city: data.userProvinceName,
        district: data.userDistrictName,
        time: data.time,
        actual_goods_weight: data.actual_goods_weight,
        type: data.log_trip_type,
    };

    return axios.post('/api/log-trip/create-new-log-trip', objLog);
};

export { getLogTripService, initLogTripsToDisplayService, addLogTripService };

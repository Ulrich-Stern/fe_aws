import axios from '../axios';
import { ORDER_STATUS } from '../utils';

const getTrackingService = (idInput, orderIdInput) => {
    // template string
    return axios.get(
        `api/tracking/get-all-tracking?id=${idInput}&order_id=${orderIdInput}`
    );
};

const initTrackingsToDisplayService = async function (trackingsFromApi) {
    try {
        let temp = [];
        let idx = -1;
        let trackings = trackingsFromApi;

        await trackings.forEach(async (i) => {
            let vehicle = i.vehicle_record;
            vehicle = vehicle[0];

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

const addTrackingService = (data) => {
    // console.log('data at addTrackingService ', data);
    let objTracking = {
        order_id: data.order_id,
        vehicle_id: data.vehicle_id,
    };

    return axios.post('/api/tracking/create-new-tracking', objTracking);
};

const deleteTrackingService = (idInput) => {
    return axios.delete('/api/tracking/delete-tracking', {
        data: {
            id: idInput,
        },
    });
};

const displayProgressBarFollowByOrderStatusService = (orderStatus) => {
    // Progress Bar = 0
    if (
        orderStatus === ORDER_STATUS.ORDER_STATUS_1 ||
        orderStatus === ORDER_STATUS.ORDER_STATUS_2 ||
        orderStatus === ORDER_STATUS.ORDER_STATUS_3 ||
        orderStatus === ORDER_STATUS.ORDER_STATUS_4 ||
        orderStatus === ORDER_STATUS.ORDER_STATUS_9
    ) {
        return 0;
    }
    // Progress Bar: Bốc hàng
    else if (
        orderStatus === ORDER_STATUS.ORDER_STATUS_5 ||
        orderStatus === ORDER_STATUS.ORDER_STATUS_6
    ) {
        return 1;
    }
    // Progress Bar: Dỡ hàng
    else if (orderStatus === ORDER_STATUS.ORDER_STATUS_7) {
        return 2;
    }
    // Progress Bar: Hoàn thành
    else {
        return 3;
    }
};

export {
    getTrackingService,
    initTrackingsToDisplayService,
    addTrackingService,
    deleteTrackingService,
    displayProgressBarFollowByOrderStatusService,
};

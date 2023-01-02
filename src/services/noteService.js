import axios from '../axios';

const getAllNoteByOrderIdService = (orderId) => {
    // template string
    return axios.get(`/api/note/get-all-note-by-order-id?order_id=${orderId}`);
};

const addNoteService = (data) => {
    // console.log('data at addNoteService:', data);
    let objNote = {
        order_id: data.orderId,
        author: data.author,
        note: data.note,
    };

    return axios.post('/api/note/create-new-note', objNote);
};

const getAllNoteService = (userId) => {
    // template string
    return axios.get(`/api/note/get-all-note?id=${userId}`);
};

export { addNoteService, getAllNoteByOrderIdService, getAllNoteService };

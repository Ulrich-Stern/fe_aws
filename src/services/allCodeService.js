import axios from '../axios';

const getAllCodeService = (idInput, typeInput) => {
    // template string
    return axios.get(
        `api/all-code/get-all-code?id=${idInput}&type=${typeInput}`
    );
};

const getAllCodeByKeyService = (keyInput) => {
    // template string
    return axios.get(`api/all-code/get-all-code-by-key?key=${keyInput}`);
};

const editAllCodeService = (data) => {
    let objAllcode = {
        id: data.id,
        value_vi: data.value_vi,
        value_en: data.value_en,
    };
    console.log('obj:', objAllcode);
    return axios.put('/api/all-code/edit-all-code', objAllcode);
};

export { getAllCodeService, getAllCodeByKeyService, editAllCodeService };

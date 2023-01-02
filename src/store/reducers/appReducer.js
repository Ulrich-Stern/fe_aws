import actionTypes from '../actions/actionTypes';
import { path } from '../../utils/constant';

const initContentOfConfirmModal = {
    isOpen: false,
    messageId: '',
    handleFunc: null,
    dataFunc: null,
};

const initialState = {
    started: true,
    language: 'vi',
    systemMenuPath: path.ADMIN_HOME,
    contentOfConfirmModal: {
        ...initContentOfConfirmModal,
    },
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.APP_START_UP_COMPLETE:
            return {
                ...state,
                started: true,
            };
        case actionTypes.SET_CONTENT_OF_CONFIRM_MODAL:
            return {
                ...state,
                contentOfConfirmModal: {
                    ...state.contentOfConfirmModal,
                    ...action.contentOfConfirmModal,
                },
            };
        case actionTypes.CHANGE_LANGUAGE:
            console.log('check reducer của redux', action);
            return {
                // ý nghĩa: trả về state y chang, ngoại trừ language là mới mà ở action có đổ languageInput
                ...state,
                language: action.language,
            };
        default:
            return state;
    }
};

export default appReducer;

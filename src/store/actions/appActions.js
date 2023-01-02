import actionTypes from './actionTypes';

export const appStartUpComplete = () => ({
    type: actionTypes.APP_START_UP_COMPLETE,
});

export const setContentOfConfirmModal = (contentOfConfirmModal) => ({
    type: actionTypes.SET_CONTENT_OF_CONFIRM_MODAL,
    contentOfConfirmModal: contentOfConfirmModal,
});

export const changeLanguageApp = (languageInput) => ({
    // cái actionTypes này sẽ được dùng làm mã (hay tên của action  ) để tk appReducer biết action nào
    // type là  name string thôi, ở đây ta import như là hằng
    //để tiện cho edit sau này
    type: actionTypes.CHANGE_LANGUAGE,
    language: languageInput,
});

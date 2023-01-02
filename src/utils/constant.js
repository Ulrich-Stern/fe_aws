export const path = {
    HOME: '/',
    LOGIN: '/login',
    LOG_OUT: '/logout',
    SYSTEM: '/system',
    NEW_ORDER: '/new-order',
    // CREATE_ORDER: '/create-order',
    CREATE_ODER_MULTI_DESTINATION: '/new-order-multi',
    ORDER_LIST: '/orders',
    DETAIL_ORDER: '/order',
    TRACKING: '/trackings',
    INVOICE: '/invoices',
    ADDRESS_BOOK: '/address-book',
    SETTING: '/setting',
    SIGNUP: '/signup',
    CHANGE_PASS: '/change-pass',
    PAYMENT: '/payment',
    PAYMENT_DETAIL: '/payment-detail',
    CONFIDENT_SCORE: '/confident-score',
    // admin
    USER_MANAGE_DETAIL: '/system/user-manage-detail',
    USER_ADDR: '/system/user-address',
    USER_PAYMENT: '/system/user-payment',
    USER_MANAGE: '/system/user-manage',
    ORDER_MANAGE_PROCESS: '/system/order-manage-process',
    ORDER_MANAGE_DETAIL: '/system/order-manage-detail',
    VEHICLE_MANAGE: '/system/vehicle-manage',
    INVOICE_MANAGE: '/system/invoice-manage',
    PRICE_MANAGE: '/system/price-manage',
    ADMIN_HOME: '/system/home',
    PRICE_CODE_MANAGE: '/system/price-code-manage',
};

export const LANGUAGE = {
    VI: 'vi',
    EN: 'en',
};

export const manageActions = {
    ADD: 'ADD',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
};

export const dateFormat = {
    DATE_FORMAT: 'DD-MM-YYYY, hh:mm a',
};

export const YesNoObj = {
    YES: 'Y',
    NO: 'N',
};

export const ORDER_STATUS = {
    // draf
    ORDER_STATUS_1: 'ORDER_STATUS_1',
    //Wait for confirmation
    ORDER_STATUS_2: 'ORDER_STATUS_2',
    //Confirmed
    ORDER_STATUS_3: 'ORDER_STATUS_3',
    //Scheduled
    ORDER_STATUS_4: 'ORDER_STATUS_4',
    //Loading goods
    ORDER_STATUS_5: 'ORDER_STATUS_5',
    //Being transported
    ORDER_STATUS_6: 'ORDER_STATUS_6',
    //Unloading
    ORDER_STATUS_7: 'ORDER_STATUS_7',
    //Completed
    ORDER_STATUS_8: 'ORDER_STATUS_8',
    // Cancelled
    ORDER_STATUS_9: 'ORDER_STATUS_9',
};

export const INVOICE_STATUS = {
    PAID: 'paid',
    UNPAID: 'unpaid',
};

export const PRICE = new Map([
    [
        'PERCENT_FROZEN',
        { name: '% cước tính thêm với hàng đông lạnh', unit: '%' },
    ],
    [
        'LOADING_UPLOADING_FEE',
        {
            name: 'Phí thuê bốc dỡ hàng',
            unit: 'VNĐ / 1 tấn/ 1 điểm bốc dỡ hàng',
        },
    ],
    [
        'VAT',
        {
            name: 'Thuế VAT',
            unit: '%',
        },
    ],
    [
        'PERCENT_INSURANCE',
        {
            name: '% tính phí bảo hiểm hàng hóa',
            unit: '%',
        },
    ],
    [
        'INIT_VALUE_INSURANCE',
        {
            name: 'Giá trị hàng hóa tối thiểu khi mua bảo hiểm',
            unit: 'VNĐ',
        },
    ],
]);

export const VEHICLE_STATUS = {
    FREE: 'FREE',
    BUSY: 'BUSY',
};

export const LOG_TRIP_TYPE = {
    LOADED: 'LOADED',
    UNLOADED: 'UNLOADED',
    OTHER: 'OTHER',
};

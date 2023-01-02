import { path } from '../../../utils/constant';
export const adminMenu = [
    // {
    //     //hệ thống
    //     name: 'menu.system.header',
    //     menus: [
    //         {
    //             name: 'menu.system.system-administrator.header',
    //             subMenus: [
    //                 {
    //                     name: 'menu.system.system-administrator.user-manage',
    //                     link: '/system/user-manage',
    //                 },
    //                 {
    //                     name: 'menu.system.system-administrator.product-manage',
    //                     link: '/system/product-manage',
    //                 },
    //                 {
    //                     name: 'menu.system.system-administrator.register-package-group-or-account',
    //                     link: '/system/register-package-group-or-account',
    //                 },
    //             ],
    //         },
    //         // { name: 'menu.system.system-parameter.header', link: '/system/system-parameter' },
    //     ],
    // },
    {
        name: 'Trang chủ',
        menus: [
            { name: 'Trang chủ', link: path.ADMIN_HOME },
            { name: 'Trang khách hàng', link: path.HOME },
        ],
    },
    {
        name: 'Vận đơn',
        menus: [
            {
                name: 'Quản lý vận đơn',
                link: path.ORDER_MANAGE_PROCESS,
            },
            // {
            //     name: 'Đã hoàn thành',
            //     link: '',
            // },
        ],
    },
    {
        name: 'Khách hàng',
        menus: [
            {
                name: 'Quản lý khách hàng',
                link: path.USER_MANAGE,
            },
        ],
    },
    {
        name: 'Hóa đơn',
        menus: [
            {
                name: 'Quán lý hóa đơn',
                link: path.INVOICE_MANAGE,
            },
            // {
            //     name: 'Chờ xử lý',
            //     link: '',
            // },
            // {
            //     name: 'Đã hoàn thành',
            //     link: '',
            // },
        ],
    },
    {
        name: 'Quản lý',
        menus: [
            {
                name: 'Quản lý giá cước xe',
                link: path.PRICE_MANAGE,
            },
            {
                name: 'Quản lý giá dịch vụ',
                link: path.PRICE_CODE_MANAGE,
            },
            {
                name: 'Quản lý xe, tài xế',
                link: path.VEHICLE_MANAGE,
            },
        ],
    },
];

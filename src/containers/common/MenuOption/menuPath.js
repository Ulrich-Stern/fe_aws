// import {
//     MenuOutlined,
//     AppstoreOutlined,
//     FolderViewOutlined,
//     BankOutlined,
//     DatabaseOutlined,
//     SettingOutlined,
// } from '@ant-design/icons';

// import { path } from '../../../utils/constant';

// function getItem(label, key, icon, children, type) {
//     return {
//         label,
//         key,
//         icon,
//         children,
//         type,
//     };
// }

// const items2 = [
//     getItem(
//         'DASHBOARD',
//         null,
//         null,
//         [getItem('Tổng quan', path.HOME, <AppstoreOutlined />)],
//         'group'
//     ),
//     getItem(
//         'PAGES',
//         null,
//         null,
//         [
//             getItem('Vận đơn', 'order', <MenuOutlined />, [
//                 getItem('Tạo vận đơn', path.NEW_ORDER),
//                 getItem(
//                     'Tạo đơn nhiều điểm dỡ',
//                     path.CREATE_ODER_MULTI_DESTINATION
//                 ),
//                 getItem('Danh sách vận đơn', path.ORDER_LIST),
//             ]),
//             getItem('Theo dõi vận đơn', path.TRACKING, <FolderViewOutlined />),
//             getItem('Hóa đơn', path.INVOICE, <BankOutlined />),
//             getItem('Sổ địa chỉ', path.ADDRESS_BOOK, <DatabaseOutlined />),
//             getItem('Cấu hình tài khoản', path.SETTING, <SettingOutlined />),
//         ],
//         'group'
//     ),
// ];

// const items = {
//     dashboard: {
//         label: 'DASHBOARD',
//         children: {
//             small_dashboard: { label: 'Tổng quan', key: path.HOME },
//         },
//     },
//     pages: {
//         label: 'PAGES',
//         children: {
//             order: {
//                 label: 'Vận đơn',
//                 children: {
//                     create_order: {
//                         label: 'Tạo vận đơn',
//                         key: path.NEW_ORDER,
//                     },
//                     create_multi_order: {
//                         label: 'Tạo đơn nhiều điểm dỡ',
//                         key: path.CREATE_ODER_MULTI_DESTINATION,
//                     },
//                     order_list: {
//                         label: 'Danh sách vận đơn',
//                         key: path.ORDER_LIST,
//                     },
//                 },
//             },
//             tracking: { label: 'Theo dõi vận đơn', key: path.TRACKING },
//             invoice: { label: 'Hóa đơn', key: path.INVOICE },
//             address_book: { label: 'Sổ địa chỉ', key: path.ADDRESS_BOOK },
//             setting: { label: 'Cấu hình tài khoản', key: path.SETTING },
//         },
//     },
// };

// export { items, items2 };

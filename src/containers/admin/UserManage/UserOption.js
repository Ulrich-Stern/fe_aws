import React from 'react';
import { connect } from 'react-redux';
import {
    useHistory,
    useLocation,
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { Menu } from 'antd';
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
} from '@ant-design/icons';

import { path } from '../../../utils/constant';

function UserOption() {
    let history = useHistory();
    let onClick = (e) => {
        history.push(e.key);
        // console.log('key:', e.key);
    };
    // set style for menu item by current page
    const { pathname } = useLocation();
    // theo key menu item
    var page = '/' + pathname.replace('/', '');
    // console.log('page:', page);

    return (
        <>
            <Menu
                mode="horizontal"
                defaultSelectedKeys={page}
                className="menu-option"
                onClick={onClick}
            >
                <Menu.Item key={path.USER_MANAGE_DETAIL}>Chi tiết</Menu.Item>
                <Menu.Item key={path.USER_ADDR}>Sổ địa chỉ</Menu.Item>
            </Menu>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserOption);

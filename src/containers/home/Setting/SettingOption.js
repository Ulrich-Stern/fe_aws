import React from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { Menu } from 'antd';
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
} from '@ant-design/icons';

import { path } from '../../../utils/constant';

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const items = [
    getItem(
        <FormattedMessage id="order.account_info" />,
        path.SETTING,
        <MailOutlined />,
        null
    ),
    getItem(
        <FormattedMessage id="order.change_pass" />,
        path.CHANGE_PASS,
        <AppstoreOutlined />,
        null
    ),
    getItem(
        <FormattedMessage id="order.payment_info" />,
        path.PAYMENT,
        <SettingOutlined />,
        null
    ),
    // getItem(
    //     <FormattedMessage id="order.confident_score" />,
    //     path.CONFIDENT_SCORE,
    //     <SettingOutlined />,
    //     null
    // ),
];

function SettingOption() {
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
                mode="inline"
                // openKeys={openKeys}
                // onOpenChange={onOpenChange}
                style={{
                    width: 300,
                }}
                items={items}
                defaultSelectedKeys={page}
                onClick={onClick}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingOption);

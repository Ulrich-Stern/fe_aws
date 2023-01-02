import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { Menu, Button } from 'antd';
import {
    MenuOutlined,
    AppstoreOutlined,
    FolderViewOutlined,
    BankOutlined,
    DatabaseOutlined,
    SettingOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';

import { items } from './menuPath';
import { path } from '../../../utils/constant';
import { partialRight } from 'lodash';

const { SubMenu } = Menu;

function MenuOption() {
    let history = useHistory();
    let onClick = (e) => {
        history.push(e.key);
        // console.log('key:', e.key);
    };
    // set style for menu item by current page
    const { pathname } = useLocation();
    var page = '/' + pathname.replace('/', '');

    // setting
    if (
        page === path.SETTING ||
        page === path.CHANGE_PASS ||
        page === path.PAYMENT ||
        page === path.PAYMENT_DETAIL ||
        page === path.CONFIDENT_SCORE
    ) {
        page = path.SETTING;
    }

    var inOrderMenu = false;

    // open Order SubMenu
    if (
        page == path.NEW_ORDER ||
        page == path.CREATE_ODER_MULTI_DESTINATION ||
        page == path.ORDER_LIST
    ) {
        inOrderMenu = true;
    } else {
        inOrderMenu = false;
    }

    return (
        <>
            <Menu
                id="mySidebar"
                onClick={onClick}
                style={{
                    width: 256,
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    padding: '0 0px 0px',
                }}
                // highlight current card
                defaultSelectedKeys={page}
                defaultOpenKeys={inOrderMenu ? 'order_submenu' : null}
                mode="inline"
                theme="dark"
                className="nav_bar"
                // hide menu
            >
                {/* dashboard */}
                <Menu.ItemGroup
                    title={
                        <span>
                            <span className="title_text">DASHBOARD</span>
                        </span>
                    }
                >
                    <Menu.Item key={path.HOME}>
                        <AppstoreOutlined />{' '}
                        <FormattedMessage id="menu.dashboard" />
                    </Menu.Item>
                </Menu.ItemGroup>
                {/* pages */}
                <Menu.ItemGroup
                    title={
                        <span>
                            <span className="title_text">PAGES</span>
                        </span>
                    }
                >
                    {/* phần order */}
                    <SubMenu
                        key="order_submenu"
                        title={<FormattedMessage id="menu.pages.order" />}
                    >
                        <Menu.Item key={path.NEW_ORDER}>
                            <FormattedMessage id="menu.pages.create_order" />
                        </Menu.Item>
                        <Menu.Item key={path.CREATE_ODER_MULTI_DESTINATION}>
                            <FormattedMessage id="menu.pages.create_multi_order" />
                        </Menu.Item>
                        <Menu.Item key={path.ORDER_LIST}>
                            <FormattedMessage id="menu.pages.order_list" />
                        </Menu.Item>
                    </SubMenu>
                    {/* phần tracking */}
                    <Menu.Item key={path.TRACKING}>
                        <FolderViewOutlined />{' '}
                        <FormattedMessage id="menu.pages.tracking" />
                    </Menu.Item>
                    {/* phần invoice */}
                    <Menu.Item key={path.INVOICE}>
                        <BankOutlined />{' '}
                        <FormattedMessage id="menu.pages.invoice" />
                    </Menu.Item>
                    {/* phần address book */}
                    <Menu.Item key={path.ADDRESS_BOOK}>
                        <DatabaseOutlined />{' '}
                        <FormattedMessage id="menu.pages.address_book" />
                    </Menu.Item>
                    {/* setting */}
                    <Menu.Item key={path.SETTING}>
                        <SettingOutlined />{' '}
                        <FormattedMessage id="menu.pages.setting" />
                    </Menu.Item>
                </Menu.ItemGroup>
            </Menu>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuOption);

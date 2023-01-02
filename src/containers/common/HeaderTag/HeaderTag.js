import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Layout, Breadcrumb, Button } from 'antd';
import {
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';

import LogoPN from '../../../assets/images/logo/logonew.png';
import logoshort from '../../../assets/images/logo/logoshort.png';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';

// nhấn ctr và đưa chuột vào chữ language đi
import { LANGUAGE } from '../../../utils';
import { changeLanguageApp } from '../../../store/actions';
import { path } from '../../../utils/constant';

const { Header } = Layout;

class HeaderTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }
    handleChangeLanguage = (language) => {
        // fire redux event: gọi 1 action
        this.props.changeLanguageAppRedux(language);
    };

    closeNavRun = () => {
        let collapsed = this.state.collapsed;
        if (collapsed === true) {
            window.openNav();
        } else {
            window.closeNav();
        }
        this.setState({
            collapsed: !collapsed,
        });
    };

    render() {
        const { processLogout, lang, userInfo } = this.props;
        // console.log('this.props:', this.props);
        let languageInRedux = this.props.lang;

        return (
            <>
                <Header className="header-container">
                    <div className="left-header">
                        <div className="logoPN">
                            <img src={LogoPN} style={{ height: '50px' }} />
                        </div>
                        <div className="logoPN" id="logoshort">
                            <img src={logoshort} style={{ height: '50px' }} />
                        </div>
                        <div className="collapsed-button">
                            <Button
                                type="primary"
                                onClick={this.closeNavRun}
                                style={{
                                    marginBottom: 16,
                                }}
                                id="collapsed_button"
                            >
                                {this.state.collapsed ? (
                                    <MenuUnfoldOutlined />
                                ) : (
                                    <MenuFoldOutlined />
                                )}
                            </Button>
                        </div>

                        <Breadcrumb
                            style={{ margin: '16px 0' }}
                            className="header-breadcrumb"
                        >
                            <Breadcrumb.Item>
                                <a
                                    href={path.HOME}
                                    className="a-first-breadcumb"
                                >
                                    {this.props.breadcrumb1}
                                </a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                {this.props.breadcrumb2}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="right-header">
                        {/* cụm button */}
                        <div className="btn-group">
                            <button
                                className="btn btn-secondary btn-sm dropdown-toggle"
                                type="button"
                                data-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i>
                                    {/* <FormattedMessage id="common.hello" /> */}
                                    {this.props.userInfo &&
                                    this.props.userInfo.name
                                        ? this.props.userInfo.name
                                        : ''}{' '}
                                </i>
                            </button>
                            <div className="dropdown-menu custom-dropdown-menu">
                                <div className="dropdown-item">
                                    {' '}
                                    {/* go to system admin */}
                                    {this.props &&
                                    this.props.userInfo &&
                                    this.props.userInfo.role === 'admin' ? (
                                        <div className="user-name">
                                            <Link to={path.ADMIN_HOME}>
                                                <FormattedMessage id="common.admin_page" />{' '}
                                            </Link>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="dropdown-item-custom">
                                    {/* chuyển động ngôn ngữ */}
                                    <div className="languages">
                                        <span
                                            className={
                                                lang === LANGUAGE.VI
                                                    ? 'languages-vi active'
                                                    : 'languages-vi'
                                            }
                                            onClick={() =>
                                                this.handleChangeLanguage(
                                                    LANGUAGE.VI
                                                )
                                            }
                                        >
                                            VN
                                        </span>
                                        <span
                                            className={
                                                lang === LANGUAGE.EN
                                                    ? 'languages-en active'
                                                    : 'languages-en'
                                            }
                                            onClick={() =>
                                                this.handleChangeLanguage(
                                                    LANGUAGE.EN
                                                )
                                            }
                                        >
                                            EN
                                        </span>
                                    </div>
                                </div>
                                <div className="dropdown-item-custom">
                                    {/* logout */}
                                    <div
                                        className="btn btn-logout"
                                        onClick={processLogout}
                                    >
                                        {/* <i className="fas fa-sign-out-alt"></i> */}
                                        Đăng xuất <LogoutOutlined />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Header>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        lang: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderTag);

import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions';
import Navigator from '../../../components/Navigator';
import { adminMenu } from './adminMenu';
import './Header.scss';
import { LANGUAGE } from '../../../utils';
import { changeLanguageApp } from '../../../store/actions';

class Header extends Component {
    handleChangeLanguage = (language) => {
        // fire redux event: gọi 1 action
        this.props.changeLanguageAppRedux(language);
    };

    render() {
        const { processLogout, lang, userInfo } = this.props;

        return (
            <div className="header-admin-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={adminMenu} />
                </div>

                <div className="right-header">
                    {/* xin chào */}
                    <div className="user-name">
                        <i>Xin chào Admin, </i>
                        {/* luôn nhớ check kĩ data có empty không,
                        trước khi display data , ->tránh chương trình bị sập*/}
                        {this.props.userInfo && this.props.userInfo.name
                            ? this.props.userInfo.name
                            : ''}
                    </div>
                    {/* chuyển động ngôn ngữ - tắt ở admin */}
                    {/* <div className="languages">
                        <span
                            className={
                                lang === LANGUAGE.VI
                                    ? 'languages-vi active'
                                    : 'languages-vi'
                            }
                            onClick={() =>
                                this.handleChangeLanguage(LANGUAGE.VI)
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
                                this.handleChangeLanguage(LANGUAGE.EN)
                            }
                        >
                            EN
                        </span>
                    </div> */}
                    {/* nút logout */}
                    <div
                        className="btn btn-logout-header"
                        onClick={processLogout}
                    >
                        <i className="fas fa-times"></i>
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);

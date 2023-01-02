import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { Layout, Breadcrumb } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

import LogoPN from '../../../assets/images/logo/logonew.png';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';

// nhấn ctr và đưa chuột vào chữ language đi
import { LANGUAGE } from '../../../utils';
import { changeLanguageApp } from '../../../store/actions';
const { Header } = Layout;

class HeaderTagAdmin extends Component {
    constructor(props) {
        super(props);
    }
    handleChangeLanguage = (language) => {
        // fire redux event: gọi 1 action
        this.props.changeLanguageAppRedux(language);
    };
    render() {
        const { processLogout, lang, userInfo } = this.props;
        // console.log('this.props.user:', this.props.userInfo);
        let languageInRedux = this.props.lang;
        return (
            <>
                <Header className="header-container1">
                    <div className="left-header">
                        <Breadcrumb
                            style={{ margin: '16px 0' }}
                            className="header-breadcrumb"
                        >
                            <Breadcrumb.Item>
                                {this.props.breadcrumb1}
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                {this.props.breadcrumb2}
                            </Breadcrumb.Item>
                        </Breadcrumb>
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

export default connect(mapStateToProps, mapDispatchToProps)(HeaderTagAdmin);

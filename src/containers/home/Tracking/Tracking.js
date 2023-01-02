import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Layout } from 'antd';

import HeaderTag from '../../common/HeaderTag/HeaderTag';
import MenuOption from '../../common/MenuOption/MenuOption';
import DetailTracking from './DetailTracking';
import { FormattedMessage } from 'react-intl';

const { Sider, Content } = Layout;

class Tracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isOpenAddModal: false,
        };
    }

    render() {
        return (
            <>
                <Layout>
                    <HeaderTag
                        breadcrumb1="Trang chủ"
                        breadcrumb2="Sổ địa chỉ"
                    />
                    <Layout>
                        <Sider width="256" id="main">
                            <MenuOption />
                        </Sider>
                        <Layout
                            // className="site-layout-background"
                            style={{ padding: '24px 24px' }}
                        >
                            <Content>
                                <DetailTracking />
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </>
        );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Tracking);

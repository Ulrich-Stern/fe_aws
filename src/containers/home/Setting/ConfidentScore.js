import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Layout, Card } from 'antd';

import HeaderTag from '../../common/HeaderTag/HeaderTag';
import MenuOption from '../../common/MenuOption/MenuOption';
import SettingOption from './SettingOption';
import ScoreTable from './ScoreTable';
import { FormattedMessage } from 'react-intl';

const { Sider, Content } = Layout;

class ConfidentScore extends Component {
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
                        breadcrumb1={<FormattedMessage id="common.dashboard" />}
                        breadcrumb2={<FormattedMessage id="common.setting" />}
                    />
                    <Layout>
                        <Sider width="256" id="main">
                            <MenuOption />
                        </Sider>
                        <Layout
                            className="layout_background"
                            style={{ padding: '44px 24px 24px' }}
                        >
                            <Sider
                                width={300}
                                style={{ height: 'fit-content' }}
                                className="nav_custom"
                                id="setting_menu"
                            >
                                <SettingOption />
                            </Sider>
                            <Layout>
                                <Content>
                                    <Card
                                        bordered={false}
                                        className="card_height"
                                    >
                                        <div className="score_top">
                                            <p> 850</p>
                                        </div>
                                        <div className="container">
                                            <div className="progress-segment">
                                                {/* <p>200</p> */}
                                                <div className="item red-common"></div>
                                                <div className="item orange-common"></div>
                                                <div className="item gold-common"></div>
                                                <div className="item yellow-common">
                                                    <p> Good</p>
                                                </div>
                                                <div className="item green-common"></div>
                                                {/* <p>900</p> */}
                                            </div>
                                        </div>
                                        <div className="flex score_text">
                                            <p>
                                                <FormattedMessage id="order.history" />
                                            </p>
                                            <p>
                                                <FormattedMessage id="order.updated_date" />
                                                : 10/12/2022
                                            </p>
                                        </div>
                                        <ScoreTable />
                                    </Card>
                                </Content>
                            </Layout>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfidentScore);

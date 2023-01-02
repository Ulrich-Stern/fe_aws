import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Layout, Row, Card, Button, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';

import HeaderTag from '../../../common/HeaderTag/HeaderTag';
import MenuOption from '../../../common/MenuOption/MenuOption';
import SettingOption from '../SettingOption';
import AddMethodModal from './AddMethodModal';
import { getAllPayerByOwnUserService } from '../../../../services/payerService';

const { Sider, Content } = Layout;
const { Text } = Typography;

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenAddModal: false,
            payers: [],
        };
    }

    componentDidMount = async () => {
        await this.getDataPayer();
    };

    getDataPayer = async () => {
        try {
            let id = this.props.userInfo._id;
            let p = await getAllPayerByOwnUserService(id);
            // console.log(p);
            this.setState({ payers: p.payer });
        } catch (error) {
            console.log('Error: ' + error);
        }
    };

    showModal = () => {
        this.setState({ isOpenAddModal: true });
    };

    handleCancel = () => {
        try {
            this.setState({ isOpenAddModal: false });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        let payers = this.state.payers;
        return (
            <>
                <AddMethodModal
                    isOpenAddModal={this.state.isOpenAddModal}
                    showModal={this.showModal}
                    handleCancel={this.handleCancel}
                    refreshDataPayerFromParent={this.getDataPayer}
                />

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
                                    <Card bordered={false}>
                                        {payers &&
                                            payers.map((i, key) => {
                                                return (
                                                    <Row
                                                        gutter={[16, 24]}
                                                        className={
                                                            key % 2 == 0
                                                                ? 'gutter-row flex'
                                                                : 'gutter-row flex bg_color'
                                                        }
                                                        key={key}
                                                    >
                                                        <div>
                                                            <p className="payment_name">
                                                                {i.payer_name}
                                                            </p>
                                                            {i.payment_type ==
                                                            'atm' ? (
                                                                <p>
                                                                    <Text mark>
                                                                        {i.bank}
                                                                    </Text>{' '}
                                                                    -{' '}
                                                                    <FormattedMessage id="order.atm_number" />
                                                                    : {i.atm_id}
                                                                </p>
                                                            ) : (
                                                                <p>
                                                                    <Text mark>
                                                                        <FormattedMessage id="order.momo" />
                                                                    </Text>{' '}
                                                                    - {i.phone}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {/* <div className="payment_arrow">
                                                            <RightOutlined />
                                                        </div> */}
                                                    </Row>
                                                );
                                            })}

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="align_right"
                                            style={{ fontSize: '12px' }}
                                            onClick={() => {
                                                this.showModal();
                                            }}
                                        >
                                            <FormattedMessage id="order.add_new" />{' '}
                                            <br />{' '}
                                            <FormattedMessage id="order.payment" />
                                        </Button>
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
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);

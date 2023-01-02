import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { FormattedMessage } from 'react-intl';

import { Table } from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    PlusOutlined,
    MinusOutlined,
} from '@ant-design/icons';
const { Column } = Table;

const data = [
    {
        icon: '',
        content: <FormattedMessage id="order.paid_by_deadline" />,
        type: 1,
        amount: '15.000.000',
        modified: '10/8/2022',
        score: '150',
    },
];

for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) {
        data.push({
            icon: '',
            content: <FormattedMessage id="order.paid_by_deadline" />,
            type: 1,
            amount: '15.000.000',
            modified: '10/8/2022',
            score: '150',
        });
    }
    data.push({
        icon: '',
        content: <FormattedMessage id="order.paid_over_deadline" />,
        type: 0,
        amount: '15.000.000',
        modified: '10/8/2022',
        score: '150',
    });
}

class ScoreTable extends Component {
    render() {
        return (
            <>
                <Table
                    // rowSelection={{
                    //     type: 'checkbox',
                    //     ...rowSelection,
                    // }}
                    dataSource={data}
                    scroll={{
                        x: 'calc(350px + 50%)',
                        y: 200,
                    }}
                    size="middle"
                    style={{ height: '540px' }}
                    // style={{ whiteSpace: "pre" }}
                >
                    <Column
                        key="type"
                        dataIndex="type"
                        width="30px"
                        render={(data) => (
                            <div>
                                <center>
                                    {data ? (
                                        <ArrowUpOutlined className="arrow_up" />
                                    ) : (
                                        <ArrowDownOutlined className="arrow_down" />
                                    )}
                                </center>
                            </div>
                        )}
                    />
                    <Column
                        title={<FormattedMessage id="order.content" />}
                        key="content"
                        dataIndex="content"
                        width="80px"
                        // align="center"
                    />
                    <Column
                        title={<FormattedMessage id="order.price" />}
                        key="amount"
                        dataIndex="amount"
                        width="40px"
                        // rowSpan="3"
                        align="center"
                        // className="moreInfo-listOrder"
                    />
                    <Column
                        title={<FormattedMessage id="order.updated_date" />}
                        key="modified"
                        dataIndex="modified"
                        width="40px"
                        align="center"
                        // className="moreInfo-listOrder"
                    />
                    <Column
                        title={<FormattedMessage id="order.score" />}
                        key="score"
                        // dataIndex="score"
                        width="30px"
                        align="center"
                        render={(data) => {
                            if (data.type === 1) {
                                return (
                                    <div>
                                        <PlusOutlined className="score_plus" />
                                        <span>{data.score}</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div>
                                        <MinusOutlined className="score_minus" />
                                        <span>{data.score}</span>
                                    </div>
                                );
                            }
                        }}
                    />
                </Table>
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

export default connect(mapStateToProps, mapDispatchToProps)(ScoreTable);

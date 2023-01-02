import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { List, Button, Modal } from 'antd';

class ConsigneeModal extends Component {
    // phải có constructor props này thì tk con mới băt được data và function tk cha
    //truyền vào.
    // Mặc định để tránh lỗi mình cứ cho constructor này vào
    constructor(props) {
        super(props);
        this.state = {};
    }

    async handleClickChoose(_id) {
        await this.props.handleCancel();
        await this.props.showAddressConsigneeForm(_id);
    }

    render() {
        let addressBooks = this.props.addressBooks;

        return (
            <div className="text-center">
                <Modal
                    // syntax calls props from parent.
                    // Note: this function is defined by the parent,
                    // runs in the parent, the child only calls it
                    visible={this.props.isOpenListModal}
                    onOk={this.handleOk}
                    onCancel={this.props.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.props.handleCancel}>
                            Cancel
                        </Button>,
                    ]}
                    width={711}
                    bodyStyle={{ height: '60vh', overflowY: 'auto' }}
                >
                    {/* modal content */}
                    <h2>Danh sách địa chỉ</h2>

                    <List
                        bordered
                        dataSource={addressBooks}
                        renderItem={(item, key) => (
                            <List.Item
                                style={
                                    key % 2 == 0
                                        ? {
                                              backgroundColor: '#E7E7E7',
                                              cursor: 'pointer',
                                          }
                                        : {
                                              cursor: 'pointer',
                                          }
                                }
                                onClick={() => {
                                    this.handleClickChoose(item._id);
                                }}
                                key={key}
                            >
                                {item.name}
                            </List.Item>
                        )}
                    />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { userInfo: state.user.userInfo };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConsigneeModal);

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Button, Modal } from 'antd';

class ViewMapModal extends Component {
    // phải có constructor props này thì tk con mới băt được data và function tk cha
    //truyền vào.
    // Mặc định để tránh lỗi mình cứ cho constructor này vào
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="text-center">
                <Modal
                    visible={this.props.isOpenAddModal}
                    onCancel={this.props.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.props.handleCancel}>
                            Cancel
                        </Button>,
                    ]}
                    width={1011}
                >
                    {/* modal content */}
                    <h2>Vị trí của sổ địa chỉ</h2>
                    {this.props.lat && this.props.long && (
                        <>
                            <iframe
                                width="100%"
                                height="550px"
                                frameborder="0"
                                scrolling="no"
                                marginheight="0"
                                marginwidth="0"
                                src={`https://maps.google.com/maps?q=${this.props.lat},${this.props.long}&hl=es&z=14&amp&output=embed`}
                            ></iframe>
                        </>
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewMapModal);

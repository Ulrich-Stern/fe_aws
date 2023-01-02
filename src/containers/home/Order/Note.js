import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Typography, Button, Card, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Comment, Form, Input } from 'antd';

import {
    getAllNoteByOrderIdService,
    addNoteService,
} from '../../../services/noteService';
import { dateFormat, CommonUtils } from '../../../utils';

const { Title } = Typography;
const { TextArea } = Input;

class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: this.props.orderId,
            note: '',
            author: this.props.userInfo.name,
            listNotes: [],
        };
    }

    async componentDidMount() {
        await this.refreshFrom();
    }

    validateInput = () => {
        let arrInput = ['note'];
        for (let i = 0; i < arrInput.length; i++) {
            // return state element if it empty
            if (!this.state[arrInput[i]]) {
                alert('Missing parameter: ' + arrInput[i]);
                return false;
            }
        }

        return true;
    };

    refreshFrom = async () => {
        try {
            let notes = await getAllNoteByOrderIdService(this.state.orderId);
            notes = notes.note;

            let copyState = { ...this.state };
            copyState.note = '';
            copyState.listNotes = notes;
            this.setState({
                ...copyState,
            });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleOnChangeNote = (e) => {
        this.setState({ note: e.target.value }, () => {});
    };

    handleOnAddNote = async () => {
        try {
            if (this.validateInput()) {
                let result = await addNoteService(this.state);
                // error case
                if (result.errCode !== 0) {
                    alert(result.errMessage);
                }
                // successful case
                else {
                    alert('save Note successful');
                    this.refreshFrom();
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        let listNotes = this.state.listNotes;
        return (
            <>
                <Card style={{ height: '550px', overflowY: 'auto' }}>
                    <Title level={4}>Thêm ghi chú:</Title>
                    <Comment
                        avatar={
                            <Avatar
                                src="https://joeschmoe.io/api/v1/random"
                                alt={this.state.author}
                            />
                        }
                        content={
                            <>
                                <Form.Item>
                                    <TextArea
                                        rows={4}
                                        onChange={(e) => {
                                            this.handleOnChangeNote(e);
                                        }}
                                        value={this.state.note}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        htmlType="submit"
                                        onClick={() => {
                                            this.handleOnAddNote();
                                        }}
                                        type="primary"
                                    >
                                        <PlusOutlined /> Add Note
                                    </Button>
                                </Form.Item>
                            </>
                        }
                    />
                    <Divider />
                    {/* list note*/}
                    {listNotes &&
                        listNotes.map((i) => {
                            return (
                                <Comment
                                    key={i._id}
                                    author={
                                        <a>
                                            {i.author} -{' '}
                                            {i.created.time != ''
                                                ? moment(i.created.time).format(
                                                      dateFormat.DATE_FORMAT
                                                  )
                                                : '...'}
                                        </a>
                                    }
                                    avatar={
                                        <Avatar
                                            src="https://joeschmoe.io/api/v1/random"
                                            alt={i.author}
                                        />
                                    }
                                    content={<p>{i.note}</p>}
                                />
                            );
                        })}
                </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(Note);

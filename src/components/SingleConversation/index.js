import React, { PureComponent, createRef } from 'react';
import { connect } from 'react-redux';

import Message from '../Message';
import { sendMessage } from '../../modules/message/actions';
import './style.css';

class SingleConversation extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { messageInput: '' };
        this.endRef = createRef();
    }

    componentDidUpdate(prevProps) {
        let error = this.props.error;
        let prevError = prevProps.error;
        this.endRef.current.scrollIntoView({ behavior: 'smooth' });
        if (error && error.name === 'InternalServerError' && !prevError) {
            this.setState({
                messageInput: error.failedMessage.body,
            });
        } else {
            this.setState({ messageInput: this.state.messageInput });
        }
    }

    onChangeInput = (e) => {
        this.setState({
            messageInput: e.target.value,
        });
    };

    submit = async () => {
        await this.props.dispatcher.sendMessage(
            this.state.messageInput,
            this.props.conversationId
        );
        this.setState({
            messageInput: '',
        });
    };

    maybeSubmit = (e) => {
        if (e.keyCode === 13 && this.state.messageInput) {
            e.preventDefault();
            this.submit();
        }
    };

    render() {
        const { messages, error } = this.props;

        const { messageInput } = this.state;

        return (
            <>
                {error && error.name ? (
                    <div className='drift-sidebar-single-conversation-error'>
                        {error.name === 'InternalServerError' ? (
                            <div>
                                {'Oops there seems to be a problem...'}
                                <button
                                    className='retry-btn'
                                    onClick={this.submit}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            'Please submit a valid message'
                        )}
                    </div>
                ) : null}
                <div className='drift-sidebar-single-conversation--container'>
                    <div className='drift-sidebar-single-conversation-body'>
                        {messages.map((message) => (
                            <Message
                                key={message.id}
                                message={message}
                                messages={messages}
                            />
                        ))}
                        <div ref={this.endRef} />
                    </div>
                    {/* Should be moved to own component to prevent unnecessary re-renders */}
                    <div className='drift-sidebar-single-conversation-input'>
                        <input
                            className={error && error.name ? 'error' : ''}
                            placeholder='Type and press enter to send'
                            value={messageInput}
                            onChange={this.onChangeInput}
                            onKeyDown={this.maybeSubmit}
                        />
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    const conversationId = state.conversation.selectedConversation;
    return {
        messages: state.message.byConversationId[conversationId] || [],
        conversationId,
        error: state.message.error,
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatcher: {
        sendMessage: (messageBody, conversationId) =>
            dispatch(sendMessage({ body: messageBody, conversationId })),
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleConversation);

import React, { PureComponent, createRef } from 'react';
import { connect } from 'react-redux';

import Message from '../Message';
import { sendMessage } from '../../modules/message/actions';
import './style.css';

class SingleConversation extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            messageInput: '',
        };
        this.endRef = createRef();
    }

    componentDidUpdate() {
        this.endRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    onChangeInput = (e) => {
        this.setState({
            messageInput: e.target.value,
        });
    };

    maybeSubmit = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.props.dispatcher.sendMessage(
                this.state.messageInput,
                this.props.conversationId
            );
            this.setState({
                messageInput: '',
            });
        }
    };

    render() {
        const { messages } = this.props;

        const { messageInput } = this.state;

        return (
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
                        placeholder='Type and press enter to send'
                        value={messageInput}
                        onChange={this.onChangeInput}
                        onKeyDown={this.maybeSubmit}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const conversationId = state.conversation.selectedConversation;
    return {
        messages: state.message.byConversationId[conversationId] || [],
        conversationId,
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatcher: {
        sendMessage: (messageBody, conversationId) =>
            dispatch(sendMessage({ body: messageBody, conversationId })),
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleConversation);

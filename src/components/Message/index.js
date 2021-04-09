import React from 'react';
import './style.css';

const Message = ({ message: { body, createdAt } }) => {
    return (
        <div className='drift-sidebar-single-conversation-message'>
            <div className='drift-sidebar-single-conversation-message-text'>
                <p>{body}</p>
            </div>
            <span>{new Date(createdAt).toLocaleTimeString()}</span>
        </div>
    );
};

export default Message;

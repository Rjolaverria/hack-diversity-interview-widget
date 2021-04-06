import React from 'react';
import './style.css';

const Message = ({ message: { body, createdAt } }) => {
    const minutes = Math.floor((Date.now() - createdAt) / 60000);
    return (
        <div className='drift-sidebar-single-conversation-message'>
            {/* To Fix: Could appear multiple times and would not show if no message passes condition. */}
            {minutes > 0 && minutes % 5 === 0 && (
                <span className='drift-sidebar-single-conversation-message-timestamp'>
                    {minutes} minutes ago
                </span>
            )}
            <div className='drift-sidebar-single-conversation-message-text'>
                <p>{body}</p>
                <span>{new Date(createdAt).toLocaleString()}</span>
            </div>
        </div>
    );
};

export default Message;

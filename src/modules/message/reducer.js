import { clone } from 'ramda';

import MessageActionTypes from './actionTypes';

const defaultState = {
    /* map of conversationId -> list of messages */
    byConversationId: {},
    error: null,
};

const handleSendMessageSuccess = (state, action) => {
    const message = action.payload.messageFromServer;
    const conversationMessages = state.byConversationId[message.conversationId];

    // check if the list of message for the conversation
    // exists before trying to append to it
    if (!conversationMessages) {
        state.byConversationId[message.conversationId] = [message];
    } else {
        state.byConversationId[message.conversationId] = [
            ...conversationMessages,
            message,
        ];
    }
    state.error = null;
    return state;
};

const handleSendMessageFailed = (state, action) => {
    const message = action.payload.messageFromServer;

    state.error = { ...action.payload.error, failedMessage: message };
    console.error(action.payload.error);
    return state;
};

const messageReducer = (state = defaultState, action) => {
  const newState = clone(state);
  switch(action.type) {
    case MessageActionTypes.SendMessageFailed:
      return handleSendMessageFailed(newState, action);
    case MessageActionTypes.SendMessageSuccess:
      return handleSendMessageSuccess(newState, action);
    default:
      return state;
  }
};

export default messageReducer;

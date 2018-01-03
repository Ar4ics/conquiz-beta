import { combineReducers } from 'redux';
import socket from './socket';
import game from './game';
import user from './user';

const rootReducer = combineReducers({
    socket, game, user
});

export default rootReducer;

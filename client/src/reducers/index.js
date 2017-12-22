import { combineReducers } from 'redux';
import socket from './socket';
import game from './game';

const rootReducer = combineReducers({
    socket, game
});

export default rootReducer;

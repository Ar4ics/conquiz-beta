import { AsyncStorage } from 'react-native';
import { sendMessage } from './socket'

export const GET_PLAYER = 'GET_PLAYER';
export const CREATE_GAME = 'CREATE_GAME';
export const GAME_CREATED = 'GAME_CREATED';
export const JOIN_GAME = 'JOIN_GAME';
export const LEAVE_GAME = 'LEAVE_GAME';
export const CURRENT_GAMES = 'CURRENT_GAMES';
export const CONNECTED_CLIENTS = 'CONNECTED_CLIENTS';

export function getPlayer() {
  return async (dispatch) => {
    try {
      let player = await AsyncStorage.getItem('player');
      if (player) {
        console.log('local.player', player);
        player = JSON.parse(player);
        dispatch({
          type: GET_PLAYER,
          player
        });
      } else {
        console.log('local.player not found');
      }
    } catch (error) {
      console.log('error retrieving data', error);
    }
  }
}

export function getClients() {
  return (dispatch) => {
    dispatch(sendMessage({ type: CONNECTED_CLIENTS }));
  }
}

export function connectedClients(data) {
  return {
    type: CONNECTED_CLIENTS,
    data
  }
}

export function savePlayer(player) {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem('player', JSON.stringify(player));
      dispatch({
        type: GET_PLAYER,
        player
      });
    } catch (error) {
      console.log('error saving data', error);
    }
  }
}

export function getGames() {
  return (dispatch) => {
    dispatch(sendMessage({ type: CURRENT_GAMES }));
  }
}


export function createGame(user) {
  return (dispatch) => {
    user.type = CREATE_GAME;
    dispatch(sendMessage(user));
  }
}

export function gameCreated(data) {
  return {
    type: GAME_CREATED,
    data
  }
}

export function joinGame(game) {
  return (dispatch) => {
    game.type = JOIN_GAME;
    dispatch(sendMessage(game));
    dispatch({
      type: JOIN_GAME, data: game.uid
    })
  }
}

export function leaveGame() {
  return (dispatch) => {
    dispatch(sendMessage({ type: LEAVE_GAME }));
    dispatch({
      type: LEAVE_GAME
    })
  }
}

export function currentGames(data) {
  return {
    type: CURRENT_GAMES,
    data
  }
}

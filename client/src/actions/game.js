import { AsyncStorage } from 'react-native';
import { sendMessage } from './socket'

export const BOX_CLICKED = 'BOX_CLICKED';
export const GET_GAME = 'GET_GAME';
export const NEW_GAME = 'NEW_GAME';
export const EXISTING_GAME = 'EXISTING_GAME';
export const GAME_FOUND = 'GAME_FOUND';
export const GAME_NOT_FOUND = 'GAME_NOT_FOUND';
export const SEARCH_GAME = 'SEARCH_GAME';
export const NEW_QUESTION = 'NEW_QUESTION';
export const USER_ANSWERED = 'USER_ANSWERED';
export const ANSWER_RESULTS = 'ANSWER_RESULTS';
export const CLEAR_RESULTS = 'CLEAR_RESULTS';
export const COMMON_BOX_CLICKED = 'COMMON_BOX_CLICKED';
export const GAME_OVER = 'GAME_OVER';

export function boxClickSend(box) {
  return (dispatch) => {
    box.type = BOX_CLICKED;
    dispatch(sendMessage(box));
  }
}


export function boxClickReceived(data) {
  return {
    type: BOX_CLICKED,
    data
  }
}

export function commonBoxClickReceived(data) {
  return {
    type: COMMON_BOX_CLICKED,
    data
  }
}

export function newQuestionReceived(data) {
  return {
    type: NEW_QUESTION,
    data
  }
}


export function answersResultsReceived(data) {
  return {
    type: ANSWER_RESULTS,
    data
  }
}

export function clearResults() {
  return {
    type: CLEAR_RESULTS,
  }
}

export function gameFinished(data) {
  return {
    type: GAME_OVER,
    data
  }
}


export function exitGame() {
  return async (dispatch) => {
    try {
      await AsyncStorage.removeItem('game');
      dispatch({
        type: GAME_NOT_FOUND
      });
    } catch (error) {
      console.log('error removing data', error);
    }
  }
}

export function searchGame(user) {
  return (dispatch) => {
    user.type = SEARCH_GAME;
    dispatch(sendMessage(user));
  }
}

export function answerToQuestion(q) {
  return (dispatch) => {
    q.type = USER_ANSWERED;
    dispatch(sendMessage(q));
  }
}


export function getGame(game) {
  return (dispatch) => {
    game.type = GET_GAME;
    dispatch(sendMessage(game));
    dispatch({
      type: GET_GAME
    });
  }
}

export function tryGetGame() {
  return async (dispatch) => {
    try {
      const game = await AsyncStorage.getItem('game');
      if (game) {
        console.log('local.game', game);
        dispatch(getGame(JSON.parse(game)));
      } else {
        console.log('game not found');
        dispatch({
          type: GAME_NOT_FOUND
        });
      }
    } catch (error) {
      console.log('error retrieving data', error);
    }
  }
}

export function existingGameFound(data) {
  return {
    type: GAME_FOUND,
    data
  }
}

export function newGameFound(data) {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem('game',
        JSON.stringify({
          game: data.game._id, player: data.player._id
        }));
      dispatch(existingGameFound(data));

    } catch (error) {
      console.log('error saving data', error);
    }
  }

}


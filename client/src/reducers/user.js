import * as actions from "../actions/user";

const initialState = {
  player: null,
  games: {},
  game: null,
  clients: 0
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case actions.GET_PLAYER:
      console.log(action);
      return Object.assign({}, state,
        {
          player: action.player
        });

    case actions.JOIN_GAME:
      console.log(action);
      return Object.assign({}, state,
        {
          game: { uid: action.data }
        });

    case actions.LEAVE_GAME:
      console.log(action);
      return Object.assign({}, state,
        {
          game: null
        });
    case actions.CURRENT_GAMES:
      console.log(action);
      return Object.assign({}, state,
        {
          games: action.data.games
        });
    case actions.CONNECTED_CLIENTS:
      console.log(action);
      return Object.assign({}, state,
        {
          clients: action.data.count
        });
    case actions.GAME_CREATED:
      console.log(action);
      return Object.assign({}, state,
        {
          game: { uid: action.data.game_uid }
        });
    default:
      return state;
  }
}
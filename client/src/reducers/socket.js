import * as actions from "../actions/socket";

const initialState = {
  live: false,
  status: 'нет соединения',
  failure: null,
};

export default function socket(state = initialState, action) {
  switch (action.type) {
    case actions.CONNECTING:
      console.log(action);
      return Object.assign({}, state,
        {
          live: false,
          status: 'соединяемся'
        });

    case actions.CONNECTED:
      console.log(action);
      return Object.assign({}, state,
        {
          live: true,
          status: 'соединено'
        });

    case actions.DISCONNECTED:
      console.log(action);
      return Object.assign({}, state,
        {
          live: false,
          status: 'разъединено'
        });

    case actions.ERROR:
      console.log(action);
      return Object.assign({}, state,
        {
          live: false,
          status: 'ошибка соединения',
          failure: action.data.type
        });

    case actions.GAME_ERROR:
      console.log(action);
      return Object.assign({}, state,
        {
          failure: action.data.error
        });


    default:
      return state;
  }
}
import * as actions from "../actions/game";

const initialState = {
  boxes: [],
  users: [],
  mover: null,
  question: null,
  results: null,
  loading: false,
  loaded: false,
  winner: null,
};

export default function game(state = initialState, action) {
  switch (action.type) {
    case actions.NEW_QUESTION:
      console.log(action);
      return Object.assign({}, state,
        { question: action.data.question });

    case actions.ANSWER_RESULTS:
      console.log(action);

      var users = state.users.slice();
      var boxes = state.boxes.slice();
      var box = action.data.results.box;
      var results = {
        users: []
      };
      users.forEach(user => {
        var nu = action.data.results.users.find(u => u.user.name === user.name);
        if (nu) {
          user.score = nu.user.score;
          results.users.push(
            { name: nu.user.name, variant: nu.variant, correct: nu.correct, time: nu.time });
        }
      });
      results.answer = action.data.results.answer;
      if (action.data.results.boxes) {
        action.data.results.boxes.forEach(box => {
          boxes[box.y][box.x] = { user: { color: 'white' }, base: false };
        });
      } else if (box) {
        var localUser = boxes[box.y][box.x].user;
        if (localUser.color === 'white') {
          boxes[box.y][box.x] =
            { user: box.user, base: box.base, shields: box.shields, common: false };
        } else {
          if (box.user.color === localUser.color) {
            boxes[box.y][box.x].common = false;
            boxes[box.y][box.x].shields = box.shields;
          } else {
            boxes[box.y][box.x] =
              { user: box.user, base: false, common: false };
          }
        }

      }
      return Object.assign({}, state,
        {
          users, results, boxes
        });

    case actions.CLEAR_RESULTS:
      console.log(action);
      return Object.assign({}, state,
        {
          question: null, results: null
        });

    case actions.BOX_CLICKED:
      console.log(action);
      var boxes = state.boxes.slice();
      boxes[action.data.box.y][action.data.box.x] = {
        user: {
          color: action.data.box.color
        }, base: action.data.box.base, shields: action.data.box.shields
      };
      return Object.assign({}, state,
        {
          boxes, mover: action.data.mover
        });

    case actions.COMMON_BOX_CLICKED:
      console.log(action);
      var boxes = state.boxes.slice();
      boxes[action.data.box.y][action.data.box.x].common = true;
      return Object.assign({}, state,
        {
          boxes, mover: action.data.mover
        });


    case actions.GET_GAME:

      return Object.assign({}, state,
        {
          loading: true
        });

    case actions.GAME_NOT_FOUND:
      return Object.assign({}, state,
        {
          loading: false, loaded: false,
        });


    case actions.GAME:
      console.log(action);
      return Object.assign({}, state,
        {
          boxes: action.data.game.boxes,
          users: action.data.game.users,
          mover: action.data.game.mover,
          question: action.data.game.question,
          winner: action.data.game.winner,
          loading: false,
          loaded: true
        });
    case actions.GAME_OVER:
      console.log(action);
      return Object.assign({}, state,
        {
          winner: action.data.winner
        });

    default:
      return state;
  }
}
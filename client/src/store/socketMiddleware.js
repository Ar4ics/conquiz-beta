import * as actions from '../actions/socket';
import * as game from '../actions/game';
const socketMiddleware = (function () {
  var socket = null;

  const onOpen = (ws, store, token) => evt => {
    //Send a handshake, or authenticate with remote end

    //Tell the store we're connected
    store.dispatch(actions.connected());
  }

  const onClose = (ws, store) => evt => {
    //Tell the store we've disconnected
    store.dispatch(actions.disconnected());

  }

  const onError = (ws, store) => evt => {
    //Tell the store that error occured
    store.dispatch(actions.error(evt));
  }

  const onMessage = (ws, store) => evt => {
    //Parse the JSON message received on the websocket
    var msg = JSON.parse(evt.data);
    switch (msg.type) {
      case game.BOX_CLICKED:
        //Dispatch an action that adds the received message to our state
        store.dispatch(game.boxClickReceived(msg));
        break;
      case game.COMMON_BOX_CLICKED:
        //Dispatch an action that adds the received message to our state
        store.dispatch(game.commonBoxClickReceived(msg));
        break;
      case game.NEW_QUESTION:
        //Dispatch an action that adds the received message to our state
        store.dispatch(game.newQuestionReceived(msg));
        break;
      case game.GAME_OVER:
        //Dispatch an action that adds the received message to our state
        store.dispatch(game.gameFinished(msg));
        break;
      case game.ANSWER_RESULTS:
        store.dispatch(game.answersResultsReceived(msg));
        break;
      case game.NEW_GAME:
        //Dispatch an action that adds the received message to our state
        store.dispatch(game.newGameFound(msg));
        break;
      case game.EXISTING_GAME:
        //Dispatch an action that adds the received message to our state
        store.dispatch(game.existingGameFound(msg));
        break;
      case actions.GAME_ERROR:
        //Dispatch an action that adds the received message to our state
        store.dispatch(actions.gameError(msg));
        break;
      default:
        console.log("received unknown message type: '" + msg.type + "'");
        break;
    }
  }

  return store => next => action => {
    switch (action.type) {

      //The user wants us to connect
      case actions.CONNECT:
        //Start a new connection to the server
        if (socket != null) {
          socket.close();
        }
        //Send an action that shows a "connecting..." status for now
        store.dispatch(actions.connecting());

        //Attempt to connect (we could send a 'failed' action on error)
        socket = new WebSocket(action.url);
        socket.onmessage = onMessage(socket, store);
        socket.onclose = onClose(socket, store);
        socket.onerror = onError(socket, store);
        socket.onopen = onOpen(socket, store, action.token);

        break;

      //The user wants us to disconnect
      case actions.DISCONNECT:
        if (socket != null) {
          socket.close();
        }
        socket = null;

        //Set our state to disconnected
        store.dispatch(actions.disconnected());
        break;

      //Send the 'SEND_MESSAGE' action down the websocket to the server
      case actions.SEND_MESSAGE:
        socket.send(JSON.stringify(action.message));
        break;

      //This action is irrelevant to us, pass it on to the next middleware
      default:
        return next(action);
    }
  }

})();

export default socketMiddleware
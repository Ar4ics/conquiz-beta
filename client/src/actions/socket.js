export const CONNECT = 'CONNECT';
export const CONNECTING = 'CONNECTING';
export const CONNECTED = 'CONNECTED';
export const DISCONNECT = 'DISCONNECT';
export const DISCONNECTED = 'DISCONNECTED';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const ERROR = 'ERROR';
export const GAME_ERROR = 'GAME_ERROR';

export function connect(url) {
  return {
    type: CONNECT,
    url
  }
}

export function connecting() {
  return {
    type: CONNECTING,
  }
}

export function connected() {
  return {
    type: CONNECTED,
  }
}

export function error(data) {
  return {
    type: ERROR,
    data
  }
}

export function gameError(data) {
  return {
    type: GAME_ERROR,
    data
  }
}

export function disconnect() {
  return {
    type: DISCONNECT,
  }
}


export function disconnected() {
  return {
    type: DISCONNECTED,
  }
}

export function sendMessage(message) {
  return {
    type: SEND_MESSAGE,
    message,
  }
}



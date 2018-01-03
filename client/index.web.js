import React from 'react';
import { AppRegistry } from 'react-native';

import { AppContainer } from 'react-hot-loader';

import App from './src';

const renderApp = () => (
  <AppContainer>
    <App />
  </AppContainer>
);

AppRegistry.registerComponent('App', () => renderApp);

if (module.hot) {
  module.hot.accept();
  AppRegistry.registerComponent('App', () => App);
}

AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
});
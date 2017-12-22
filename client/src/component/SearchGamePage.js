import React, { Component } from 'react';
import { TextInput, View, Button, Text } from 'react-native';
import Game from '../containers/Game';
import GameForm from './GameForm';
export default class SearchGamePage extends Component {
  constructor(props) {
    super(props);
    this.props.tryGetGame();
  }

  render() {
    return (
      <View>
        {!this.props.loading &&
          (this.props.loaded ? <Game /> :
            <GameForm searchGame={this.props.searchGame} />)
        }
      </View>

    );
  }
}
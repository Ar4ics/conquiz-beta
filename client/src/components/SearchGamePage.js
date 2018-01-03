import React, { Component } from 'react';
import { TextInput, View, Button, Text } from 'react-native';
import Game from '../containers/Game';
import GameForm from '../containers/GameForm';
import Games from '../containers/Games';
export default class SearchGamePage extends Component {
  constructor(props) {
    super(props);
    this.props.tryGetGame();
  }

  render() {
    const {
      loading,
      loaded,
    } = this.props;
    return (
      <View>
        {!loading &&
          (loaded ? <Game /> :
            <View>
              <GameForm />
              <Games />
            </View>
          )
        }

      </View>

    );
  }
}
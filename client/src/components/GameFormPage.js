import React, { Component } from 'react';
import { TextInput, View, StyleSheet, Button, Text, ActivityIndicator } from 'react-native';
import { AsyncStorage } from 'react-native';

export default class GameForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', x: '', y: '', count: '' };
    this._onCreateGame = this._onCreateGame.bind(this);
    this._onSavePlayer = this._onSavePlayer.bind(this);
    if (!this.props.player) {
      this.props.getPlayer();
    }
  }

  _onSavePlayer() {
    let name = this.state.name.trim();
    this.props.savePlayer({ name });
  }

  _onCreateGame() {
    let x = parseInt(this.state.x);
    let y = parseInt(this.state.y);
    let count = parseInt(this.state.count);

    if (x < 2 || y < 2 || x > 10 || y > 10 || count < 2 || count > 3 || !this.props.player) {
      return;
    }
    this.props.createGame({
      name: this.props.player.name,
      x,
      y,
      count,
    });
    this.setState({ x: '', y: '', count: '' });
  }

  render() {
    const {
      player,
      game,
    } = this.props;
    return (
      <View>
        <View style={styles.row}>
          {player ? <Text>{player.name}</Text> :
            <View>
              <TextInput
                placeholder='Ваше имя'
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={(text) => this.setState({ name: text })}
                value={this.state.name}
              />
              <Button
                onPress={this._onSavePlayer}
                title="Сохранить"
              />
            </View>
          }

        </View>
        {!game &&
          <View style={styles.container}>
            <TextInput
              placeholder='Длина по x'
              keyboardType='numeric'
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(text) => this.setState({ x: text })}
              value={this.state.x}
            />
            <TextInput
              placeholder='Длина по y'
              keyboardType='numeric'
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(text) => this.setState({ y: text })}
              value={this.state.y} />
            <TextInput
              placeholder='Кол-во игроков'
              keyboardType='numeric'
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(text) => this.setState({ count: text })}
              value={this.state.count} />
            <Button
              onPress={this._onCreateGame}
              title="Создать игру"
            />
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'stretch',

  },
  row: {
    margin: 5,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',

  },

});
import React, { Component } from 'react';
import { TextInput, View, StyleSheet, Button, Text, ActivityIndicator } from 'react-native';

export default class GameForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', x: '', y: '', count: '', search: false };
    this._onPressButton = this._onPressButton.bind(this);
  }

  _generateColor() {
    return "#" + Math.random().toString(16).slice(2, 8);
  }

  _onPressButton() {
    let x = parseInt(this.state.x);
    let y = parseInt(this.state.y);
    let count = parseInt(this.state.count);
    let name = this.state.name.trim();
    if (x < 2 || y < 2 || x > 5 || y > 5 || count < 2 || count > 3 || name === '') {
      return;
    }
    this.setState({ search: true });
    this.props.searchGame({
      user: {
        name,
        color: this._generateColor()
      },
      x,
      y,
      count,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder='Имя'
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => this.setState({ name: text })}
          value={this.state.name}
        />
        <TextInput
          placeholder='Размер по x'
          keyboardType='numeric'
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => this.setState({ x: text })}
          value={this.state.x}
        />
        <TextInput
          placeholder='Размер по y'
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
          onPress={this._onPressButton}
          title="Найти игру"
        />
        {this.state.search &&
          <View style={styles.row}>
            <Text>Ищем вас на игре...</Text>
            <ActivityIndicator size="small" color="#00ff00" />
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
    alignItems: 'stretch',
  },

});
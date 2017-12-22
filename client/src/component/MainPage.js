import React, { Component } from 'react';
import { Alert, Button, Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import SearchGame from '../containers/SearchGame';
class MainPage extends Component {
  constructor(props) {
    super(props);
    let host = location.origin.replace(/^http/, 'ws')
    this.props.connect(host);
  }

  render() {
    const {
      live,
      status,
      failure,
    } = this.props;
    return (
      <View>
        <Text>Статус связи с сервером: {status}</Text>
        {failure && <Text>Возникла ошибка: {failure}</Text>}
        {live && <SearchGame />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
});

export default MainPage
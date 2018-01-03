import React, { Component } from 'react';
import { Alert, Button, Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import SearchGame from '../containers/SearchGame';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    let host = location.origin.replace(/^http/, 'ws');
    //let host = 'ws://localhost:3000';
    this.props.connect(host);
  }
  render() {
    const {
      live,
      failure,
    } = this.props;
    return (
      <View>
        {failure && <Text>{failure}</Text>}
        {live && <SearchGame />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
});

import React, { Component } from 'react';
import { TextInput, View, Button, StyleSheet, Text, ActivityIndicator } from 'react-native';

export default class UsersList extends Component {
  constructor(props) {
    super(props);
  }

  _getStyle = user => {
    return {
      borderColor: user.color,
      borderWidth: 1
    }
  }


  render() {
    const {
      users
    } = this.props;
    return (
      <View style={styles.container}>
        {users.map((user, i) =>
          <View style={[styles.row, this._getStyle(user)]} key={i}>
            <Text>
              {user.name}
            </Text>
            <Text>
              {user.score.correct}-{user.score.incorrect}={user.score.correct - user.score.incorrect} очков
            </Text>
          </View>

        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',

  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});

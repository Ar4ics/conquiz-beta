import React, { Component } from 'react';
import { TextInput, View, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default class GamesList extends Component {
  constructor(props) {
    super(props);
    if (Object.keys(this.props.games).length === 0) {
      this.props.getGames();
    }
    this.props.getClients();
  }

  render() {
    const {
      games,
      game,
      player,
      clients
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text>Игры: {Object.keys(games).length}</Text>
          <Text>Подключено: {clients}</Text>
        </View>
        {Object.keys(games).map((uid, i) =>
          <View style={styles.game} key={uid}>
            <Text style={styles.onecol}>
              {games[uid].users.length}/{games[uid].count} {games[uid].x}x{games[uid].y} {games[uid].id && 'идет'}
            </Text>
            <View style={styles.row}>
              {games[uid].users.map((user, k) =>
                <Text key={k}>
                  {user.name}
                </Text>
              )}
            </View>

            {player &&
              <View style={styles.onecol}>
                {!game && !games[uid].id &&
                  <TouchableOpacity onPress={() => this.props.joinGame({ uid, name: player.name })}>
                    <Text>Войти</Text>
                  </TouchableOpacity>
                }
                {game && game.uid === uid &&
                  <TouchableOpacity onPress={() => this.props.leaveGame()}>
                    <Text>Выйти</Text>
                  </TouchableOpacity>
                }
              </View>
            }
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
    alignSelf: 'center',
    alignItems: 'stretch',
    marginTop: 5,
    minWidth: 200,

  },

  game: {
    borderWidth: 1,
    padding: 5,
    marginTop: 5,
  },

  onecol: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});

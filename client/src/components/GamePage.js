import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import QuestionForm from './QuestionForm';
import UsersList from './UsersList';

class GamePage extends Component {
  constructor(props) {
    super(props);

    this._onPressBox = this._onPressBox.bind(this);
  }


  _onPressBox(x, y) {
    let box = { x, y };
    this.props.boxClickSend(box);
  }

  render() {
    const {
      boxes,
      player,
      mover,
      question,
      users,
      results,
      winner,
    } = this.props;
    return (
      <View style={styles.container}>

        <View style={styles.onerow}>
          <Text>{player.name}</Text>
          <TouchableOpacity onPress={() => this.props.exitGame()}>
            <View>
              <Text>Выйти из игры</Text>
            </View>
          </TouchableOpacity>
        </View>

        <UsersList users={users} />

        <View style={{ marginTop: 5 }}>
          {question ?
            <QuestionForm
              question={question}
              results={results}
              answerToQuestion={this.props.answerToQuestion}
              clearResults={this.props.clearResults}
            /> :
            (winner ? <Text>Победитель игры: {winner.name}</Text> :
              (mover && <Text>Сейчас ходит: {mover.name}</Text>))
          }
        </View>

        {!results &&
          <View style={styles.field}>
            {boxes.map((y, j) =>
              <View style={styles.row} key={j}>
                {boxes[j].map((x, i) =>
                  <Box key={i} onBoxClick={this._onPressBox} x={i} y={j} box={x} />
                )}
              </View>
            )}
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
  field: {
    marginTop: 5,
  },
  row: {
    flex: 1,
    minHeight: 100,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'stretch',

  },
  onerow: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box: {
    flex: 1,
    minWidth: 100,
    borderWidth: 0.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

const Box = props => {
  const _onClick = () => {
    props.onBoxClick(props.x, props.y);
  }


  const _getStyle = box => {
    return {
      backgroundColor: box.user.color
    }
  }
  return (
    <TouchableOpacity onPress={_onClick}>
      <View style={[styles.box, _getStyle(props.box)]}>
        {props.box.base && <Text>База ({props.box.shields})</Text>}
        {props.box.common && <Text>Атака</Text>}
      </View>
    </TouchableOpacity>
  );

};

export default GamePage
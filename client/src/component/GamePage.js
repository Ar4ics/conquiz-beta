import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
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
          <Text>Вы: {player.name}</Text>
          <TouchableWithoutFeedback onPress={() => this.props.exitGame()}>
            <View>
              <Text>Выйти</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <UsersList users={users} />

        <View style={{ paddingTop: 5 }}>
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

        <View style={styles.field}>
          {boxes.map((y, j) =>
            <View style={styles.row} key={j}>
              {boxes[j].map((x, i) =>
                <Box key={i} onBoxClick={this._onPressBox} x={i} y={j} box={x} />
              )}
            </View>
          )}
        </View>
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
    paddingTop: 10,
  },
  row: {
    flex: 1,
    minHeight: 100,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'stretch',

  },
  onerow: {
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
    <TouchableWithoutFeedback onPress={_onClick}>
      <View style={[styles.box, _getStyle(props.box)]}>
        {props.box.base && <Text>База ({props.box.shields})</Text>}
        {props.box.common && <Text>Атака</Text>}
      </View>
    </TouchableWithoutFeedback>
  );

};

export default GamePage
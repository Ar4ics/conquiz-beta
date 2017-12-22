import React, { Component } from 'react';
import { TextInput, View, Button, StyleSheet, Text, ActivityIndicator } from 'react-native';

export default class QuestionForm extends Component {
  constructor(props) {
    super(props);
  }

  _onPressButton(i) {
    this.props.answerToQuestion({ answer: i });
  }

  _getButtonColor(i) {
    if (this.props.results) {
      if (this.props.results.answer === i) {
        return 'green';
      }
    }
    return 'deepskyblue';
  }

  render() {
    const {
      question,
      results,
    } = this.props;
    if (results) {
      setTimeout(() => {
        this.props.clearResults();
      }, 5000);
    }
    return (
      <View style={styles.container}>
        <Text>
          {question.title}
        </Text>
        <View style={styles.row}>
          {question.answers.map((answer, i) =>
            <Button key={i}
              color={this._getButtonColor(i)}
              onPress={this._onPressButton.bind(this, i)}
              title={answer} />
          )}
        </View>

        {results &&
          <View>
            {results.users.map((user, i) =>
              <View key={i}>
                <Text>
                  Игрок {user.name} выбрал {user.variant + 1} вариант: {user.correct ? 'верно' : 'неверно'}
                </Text>
                <Text>Время ответа: {user.time / 1000.0} с.</Text>
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
  row: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'stretch',
  },

});

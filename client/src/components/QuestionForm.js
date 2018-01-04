import React, { Component } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';

export default class QuestionForm extends Component {
  constructor(props) {
    super(props);
  }

  _onPressButton(i) {
    this.props.answerToQuestion({ answer: i });
  }

  _getColor(i) {
    if (this.props.results) {
      if (this.props.results.answer === i) {
        return {
          backgroundColor: 'green'
        }
      }
    }
    return {
      backgroundColor: 'white'
    };
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
        <Text style={{ textAlign: 'justify', width: 200 }}>
          {question.title}
        </Text>
        <View>
          {question.answers.map((answer, i) =>
            <View key={i} style={[{ margin: 5, borderWidth: 1, padding: 5 }, this._getColor(i)]}>
              <TouchableOpacity
                onPress={this._onPressButton.bind(this, i)}>
                <Text style={{ textAlign: 'center' }}>{answer}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {results &&
          <View>
            {results.users.map((user, i) =>
              <View key={i}>
                <Text style={{ textAlign: 'justify' }}>
                  Игрок {user.name} - {user.variant + 1} вариант: {user.correct ? 'верно' : 'неверно'}
                </Text>
                <Text style={{ textAlign: 'justify' }}>Время ответа: {user.time / 1000.0} с.</Text>
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
    alignItems: 'center',
    width: 200,
  },

  row: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'stretch',
  },

});

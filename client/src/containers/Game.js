import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import GamePage from "../components/GamePage"
import * as game from '../actions/game'

function mapDispatchToProps(dispatch) {
  return bindActionCreators(game, dispatch);
}

function mapStateToProps(state) {
  return {
    boxes: state.game.boxes,
    player: state.user.player,
    mover: state.game.mover,
    question: state.game.question,
    results: state.game.results,
    users: state.game.users,
    winner: state.game.winner,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);
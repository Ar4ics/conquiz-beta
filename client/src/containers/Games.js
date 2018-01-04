import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import GamesList from "../components/GamesList"
import * as user from '../actions/user'

function mapDispatchToProps(dispatch) {
  return bindActionCreators(user, dispatch);
}

function mapStateToProps(state) {
  return {
    games: state.user.games,
    game: state.user.game,
    player: state.user.player,
    clients: state.user.clients

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesList);
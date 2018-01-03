import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import GameFormPage from "../components/GameFormPage"
import * as user from '../actions/user'

function mapDispatchToProps(dispatch) {
  return bindActionCreators(user, dispatch);
}

function mapStateToProps(state) {
  return {
    player: state.user.player,
    game: state.user.game,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameFormPage);
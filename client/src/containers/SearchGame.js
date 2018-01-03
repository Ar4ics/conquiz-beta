import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import SearchGamePage from "../components/SearchGamePage"
import * as game from '../actions/game'

function mapDispatchToProps(dispatch) {
  return bindActionCreators(game, dispatch);
}

function mapStateToProps(state) {
  return {
    loading: state.game.loading,
    loaded: state.game.loaded,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchGamePage);
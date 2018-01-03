import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import MainPage from "../components/MainPage"
import * as socket from '../actions/socket'

function mapDispatchToProps(dispatch) {
  return bindActionCreators(socket, dispatch);
}

function mapStateToProps(state) {
  return {
    live: state.socket.live,
    status: state.socket.status,
    failure: state.socket.failure,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
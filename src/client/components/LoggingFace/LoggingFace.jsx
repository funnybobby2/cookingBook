import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './LoggingFace.scss';

class LoggingFace extends React.Component {
  constructor(props) {
    super(props);
    this.tapePassword = this.tapePassword.bind(this);
    this.connect = this.connect.bind(this);
    this.createUserRequest = this.createUserRequest.bind(this);
  }

  tapePassword(e) {
    if (e.key === 'Enter') {
      this.password.focus();
    }
  }
  createUserRequest() {
    this.props.maestro.dataRefresh('createUserRequest');
  }

  connect(e) {
    if (e.key === 'Enter') {
      this.props.maestro.dataRefresh('connect', this.login.value, this.password.value);
    }
  }

  render() { // exemple de render en ternaire
    return (
      <div className="loggingFace">
        <div className="loginBox">
          <i className="material-icons">account_circle</i>
          <input
            id="loginInput"
            type="text"
            placeholder="login"
            autoComplete="off"
            ref={input => this.login = input}
            onKeyPress={this.tapePassword}
          />
        </div>
        <div className="passwordBox">
          <i className="material-icons">lock</i>
          <input
            id="passwordInput"
            type="password"
            placeholder="Mot de passe"
            autoComplete="off"
            ref={input => this.password = input}
            onKeyPress={this.connect}
          />
        </div>
        <div className="notMember">
          <span>Pas membres ?</span>
          <span className="link" onClick={this.createUserRequest}> Créer un compte </span>
        </div>
      </div>);
  }
}

LoggingFace.propTypes = {
  maestro: PropTypes.object
};

LoggingFace.defaultProps = { // define the default props
  maestro: { dataRefresh: () => {} }
};

export default LoggingFace;

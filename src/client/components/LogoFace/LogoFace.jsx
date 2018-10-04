import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './LogoFace.scss';
// Import images
import logo from '../../assets/img/Cooking_logo.svg';

class LogoFace extends React.Component {
  constructor(props) {
    super(props);
    this.showHelper = this.showHelper.bind(this);
    this.showUserParameter = this.showUserParameter.bind(this);
    this.unconnect = this.unconnect.bind(this);
  }

  showHelper() {
    this.props.maestro.dataRefresh('helper');
  }

  showUserParameter() {
    this.props.maestro.dataRefresh('userParameter');
  }

  unconnect() {
    this.props.maestro.dataRefresh('unconnect');
  }

  render() {
    const userLogo = require(`../../assets/img/user/user_${this.props.user.logo}.svg`)
    return (
      <div className="logoFace">
        <img src={logo} height="250" alt="MENU food &amp; drinks" />
        <div className="userInfo">
          <img src={userLogo} height="70" alt="egg" />
          <div className="userDetails">
            <span>{this.props.user.login}</span>
            <div className="actions">
              <span onClick={this.showHelper}>Aide</span>
              <span onClick={this.showUserParameter}>Paramétrage</span>
              <span onClick={this.unconnect}>Déconnexion</span>
            </div>
          </div>
        </div>
      </div>);
  }
}

LogoFace.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    login: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user']),
    email: PropTypes.string,
    logo: PropTypes.string
  }),
  maestro: PropTypes.object
};

LogoFace.defaultProps = { // define the default props
  user: {
    _id: '', login: '', password: '', role: 'user', email: '', logo: 'egg'
  },
  maestro: { dataRefresh: () => {} }
};

export default LogoFace;

import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './LogoFace.scss';
// Import images
import logo from '../../assets/img/menu.png';

class LogoFace extends React.Component {
  constructor(props) {
    super(props);
    this.unconnect = this.unconnect.bind(this);
  }

  unconnect() {
    this.props.maestro.dataRefresh('unconnect');
  }

  render() { // exemple de render en ternaire
    return (
      <div className="logoFace">
        <img src={logo} alt="MENU food &amp; drinks" />
        <div className="websiteTitle">Menu</div>
        <div className="neon">
          <span className="text-neon">By </span>
          <span className="text-neon">{this.props.user.login}</span>
          <span className="text-neon">
            <i className="material-icons" onClick={this.unconnect}>highlight_off</i>
          </span>
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
    email: PropTypes.string
  }),
  maestro: PropTypes.object
};

LogoFace.defaultProps = { // define the default props
  user: {
    _id: '', login: '', password: '', role: 'user', email: ''
  },
  maestro: { dataRefresh: () => {} }
};

export default LogoFace;

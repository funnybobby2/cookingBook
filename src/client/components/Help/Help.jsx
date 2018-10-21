import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './Help.scss';

class Help extends React.Component {
  constructor(props) {
    super(props);
    this.closeHelp = this.closeHelp.bind(this);
  }

  closeHelp() {
    this.props.maestro.dataRefresh('closeHelp');
  }

  render() {
    const helpImg = require('../../assets/img/help.png');
    const containerClass = this.props.open ? 'helpContainer show' : 'helpContainer';

    return (
      <div className={containerClass}>
        <i className="material-icons" onClick={this.closeHelp}>highlight_off</i>
        <div className="imgContainer">
          <img width="100%" src={helpImg} alt="helper" />
        </div>
      </div>);
  }
}

Help.propTypes = {
  maestro: PropTypes.object,
  open: PropTypes.bool
};

Help.defaultProps = { // define the default props
  maestro: { dataRefresh: () => {} },
  open: false
};
export default Help;

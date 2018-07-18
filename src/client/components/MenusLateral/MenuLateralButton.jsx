import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './MenuLateralButton.scss';

class MenuLateralButton extends React.Component {
  constructor(props) {
    super(props);
    this.doAction = this.doAction.bind(this);
  }

  doAction() {
    this.props.maestro.dataRefresh('randomRecipeOrCart', this.props.action);
  }

  render() {
    return <div className="menuLateralItem" onClick={this.doAction}>{this.props.name}</div>;
  }
}

MenuLateralButton.propTypes = {
  name: PropTypes.string,
  action: PropTypes.string,
  maestro: PropTypes.object
};

MenuLateralButton.defaultProps = { // define the default props
  name: '',
  action: '',
  maestro: { dataRefresh: () => {} }
};

export default MenuLateralButton;

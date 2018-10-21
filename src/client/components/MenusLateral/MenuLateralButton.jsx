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
    const stateClass = `${((this.props.action === 'courseListe') && this.props.showCart) ? 'menuLateralItem inShopping' : 'menuLateralItem'} ${((this.props.user === undefined) && this.props.restriction === 'connected') ? 'disabled' : ''}`;
    return <div className={stateClass} onClick={this.doAction}>{this.props.name}</div>;
  }
}

MenuLateralButton.propTypes = {
  name: PropTypes.string,
  action: PropTypes.string,
  maestro: PropTypes.object,
  showCart: PropTypes.bool,
  user: PropTypes.object,
  restriction: PropTypes.string
};

MenuLateralButton.defaultProps = { // define the default props
  name: '',
  action: '',
  maestro: { dataRefresh: () => {} },
  showCart: false,
  user: undefined,
  restriction: 'all'
};

export default MenuLateralButton;

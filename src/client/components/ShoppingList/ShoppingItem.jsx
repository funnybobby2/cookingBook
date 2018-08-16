import React from 'react';
import PropTypes from 'prop-types';

class ShoppingItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked
    };
    this.toggleState = this.toggleState.bind(this);
  }

  toggleState(name, quantity, unit) {
    const checkState = !this.state.checked;
    this.setState({ checked: checkState });
    this.props.maestro.dataRefresh('ingredientBought', checkState ? 1 : -1, name, quantity, unit);
  }

  render() {
    const stateClass = this.state.checked ? 'cartItem checked' : 'cartItem';
    const stateCheckbox = this.state.checked ?
      <i className="material-icons checked" onClick={() => { this.toggleState(this.props.name, this.props.quantity, this.props.unit); }}>check_box</i> :
      <i className="material-icons" onClick={() => { this.toggleState(this.props.name, this.props.quantity, this.props.unit); }}>check_box_outline_blank</i>;
    const quantity = ((this.props.unit === '') && (this.props.quantity === '')) ? '' : `: ${this.props.quantity} ${this.props.unit}`;

    return (
      <div className={stateClass}>
        <span className="article">
          {stateCheckbox}
          <span className="articleText">{this.props.name} {quantity}</span>
        </span>
      </div>);
  }
}

ShoppingItem.propTypes = {
  quantity: PropTypes.string,
  unit: PropTypes.string,
  name: PropTypes.string,
  checked: PropTypes.bool,
  maestro: PropTypes.object
};

ShoppingItem.defaultProps = { // define the default props
  quantity: '',
  unit: '',
  name: '',
  checked: false,
  maestro: { dataRefresh: () => {} }
};

export default ShoppingItem;

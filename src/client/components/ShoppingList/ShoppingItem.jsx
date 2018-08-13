import React from 'react';
import PropTypes from 'prop-types';

class ShoppingItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
    this.toggleState = this.toggleState.bind(this);
  }

  toggleState() {
    const checkState = !this.state.checked;
    this.setState({ checked: checkState });
    this.props.maestro.dataRefresh('ingredientBought', checkState ? 1 : -1);
  }

  render() {
    const stateClass = this.state.checked ? 'cartItem checked' : 'cartItem';
    const stateCheckbox = this.state.checked ? <i className="material-icons checked" onClick={this.toggleState}>check_box</i> : <i className="material-icons" onClick={this.toggleState}>check_box_outline_blank</i>;
    return (
      <div className={stateClass}>
        <span className="article">
          {stateCheckbox}
          <span className="articleText">{this.props.quantity} {this.props.unit} {this.props.name}</span>
        </span>
      </div>);
  }
}

ShoppingItem.propTypes = {
  quantity: PropTypes.string,
  unit: PropTypes.string,
  name: PropTypes.string,
  maestro: PropTypes.object
};

ShoppingItem.defaultProps = { // define the default props
  quantity: '',
  unit: '',
  name: '',
  maestro: { dataRefresh: () => {} }
};

export default ShoppingItem;

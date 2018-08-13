import React from 'react';
import PropTypes from 'prop-types';
// import react component
import ShoppingItem from './ShoppingItem';
// import styles
import './ShoppingList.scss';

class ShoppingList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let ingredients = window.sessionStorage.getItem('menu-ingredients');
    if (_.isNil(ingredients)) ingredients = {};
    else ingredients = JSON.parse(ingredients);
    const shoppingItems = [];
    Object.keys(ingredients).forEach((ingredientKey) => {
      if (Array.isArray(ingredients[ingredientKey])) {
        for (const ingr of ingredients[ingredientKey]) {
          shoppingItems.push(<ShoppingItem quantity={ingr.quantity} unit={ingr.unit} name={ingredientKey} maestro={this.props.maestro} />);
        }
      } else shoppingItems.push(<ShoppingItem key={ingredientKey} quantity={ingredients[ingredientKey].quantity} unit={ingredients[ingredientKey].unit} name={ingredientKey} maestro={this.props.maestro} />);
    });

    const percent = (this.props.nbItemsInCart === 0) ? '0' : Math.round((this.props.nbItemsInCartChecked * 100) / this.props.nbItemsInCart).toString();

    return (
      <div className="shoppingList">
        <div className="cart-list">
          <h2>Shopping list</h2>
          <progress id="progressbar" value={percent} max="100" />
          <div className="cartElements">
            {shoppingItems}
            <img src={require('../../assets/img/barCode.png')} />
          </div>
        </div>
      </div>);
  }
}

ShoppingList.propTypes = {
  maestro: PropTypes.object,
  nbItemsInCart: PropTypes.number,
  nbItemsInCartChecked: PropTypes.number
};

ShoppingList.defaultProps = { // define the default props
  maestro: { dataRefresh: () => {} },
  nbItemsInCart: 0,
  nbItemsInCartChecked: 0
};

export default ShoppingList;

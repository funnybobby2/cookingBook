import React from 'react';
import PropTypes from 'prop-types';

class IngredientAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.editIngredientByEnter = this.editIngredientByEnter.bind(this);
    this.editQuantityByEnter = this.editQuantityByEnter.bind(this);
    this.editByEnter = this.editByEnter.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
  }

  editIngredientByEnter(e) {
    if (e.key !== 'Enter') return;
    this.quantityAdd.focus();
    this.quantityAdd.select();
  }

  editQuantityByEnter(e) {
    if (e.key !== 'Enter') return;
    this.unitAdd.focus();
    this.unitAdd.select();
  }

  editByEnter(e) {
    if (e.key !== 'Enter') return;
    const newIngredient = {
      ingredient: this.ingredientAdd.value,
      quantity: this.quantityAdd.value,
      unit: this.unitAdd.value,
      index: (Number(this.props.nextIndex) + 1)
    };

    this.props.maestro.dataRefresh('addArrayField', this.props.recipeID, 'ingredients', newIngredient, true);

    this.setState({ open: !this.state.open });
    this.ingredientAdd.value = '';
    this.quantityAdd.value = '';
    this.unitAdd.value = '';
  }

  toggleAdd() {
    this.setState({ open: !this.state.open });
    setTimeout(() => {
      this.ingredientAdd.focus();
      this.ingredientAdd.select();
    }, 50);
  }

  render() {
    const editionClass = this.props.edition ?
      (this.state.open ? 'ingredientAdd edition show' : 'ingredientAdd edition') :
      (this.state.open ? 'ingredientAdd show' : 'ingredientAdd');

    return (
      <div className={editionClass}>
        <div className="inputs">
          <input
            className="ingredientInput"
            name="ingredient"
            type="text"
            placeholder="Ingrédient"
            ref={input => this.ingredientAdd = input}
            onKeyPress={this.editIngredientByEnter}
          />
          <input
            className="quantityInput"
            name="quantity"
            type="text"
            placeholder="quantité"
            ref={input => this.quantityAdd = input}
            onKeyPress={this.editQuantityByEnter}
          />
          <input
            className="unitInput"
            name="unit"
            type="text"
            placeholder="unité (gr, litre...)"
            ref={input => this.unitAdd = input}
            onKeyPress={this.editByEnter}
          />
        </div>
        <i className="material-icons" onClick={this.toggleAdd}>add_box</i>
      </div>);
  }
}

IngredientAdd.propTypes = {
  nextIndex: PropTypes.number,
  edition: PropTypes.bool,
  recipeID: PropTypes.number,
  maestro: PropTypes.object
};

IngredientAdd.defaultProps = { // define the default props
  nextIndex: 1,
  edition: false,
  recipeID: 1,
  maestro: { dataRefresh: () => {} }
};

export default IngredientAdd;

import React from 'react';
import PropTypes from 'prop-types';
// import react component
import IngredientAdd from './IngredientAdd';
// Import style
import './Ingredients.scss';

class Ingredients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputIngredientsValue: this.props.ingredientList
    };

    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.editField = this.editField.bind(this);
    this.editFieldByEnter = this.editFieldByEnter.bind(this);
  }

  componentWillReceiveProps(newProps) { // props/ctx changent => synchro avec state
    this.setState({ inputIngredientsValue: newProps.ingredientList });
  }

  deleteIngredient(index, indexIngr) {
    this.props.maestro.dataRefresh('deleteArrayField', this.props.recipeID, 'ingredients', index, 'index', indexIngr);
  }

  editField(field, index, e) {
    const ingredients = this.state.inputIngredientsValue;
    ingredients[index][field] = e.target.value;
    this.setState({ inputIngredientsValue: ingredients });
  }

  editFieldByEnter(field, index, e) {
    if (e.key !== 'Enter') return;
    if ((e.target.value.trim() === '') && (e.target.dataset.notEmpty !== undefined)) return; // TODO lever une erreur

    this.props.maestro.dataRefresh('updateArrayField', this.props.recipeID, 'ingredients', index, field, e.target.value);
    e.target.blur();
  }

  updateIngredients() {
    this.setState({ inputIngredientsValue: this.props.ingredientList });
  }

  render() {
    const ingredientList = [];
    const ingredients = this.state.inputIngredientsValue;

    ingredients.forEach((ingr, index) => {
      const ingredientAfterSearch = (this.props.query.length > 2) ? ingr.ingredient.replace(new RegExp(`(${this.props.query})`, 'gi'), '<mark>$1</mark>') : ingr.ingredient;
      const ingrTextAfterSearch = ((ingr.quantity !== '') || (ingr.unit !== '')) ? `- ${ingredientAfterSearch} : ${ingr.quantity} ${ingr.unit}` : `- ${ingredientAfterSearch}`;
      if (!this.props.edition) {
        ingredientList.push(<li key={index} dangerouslySetInnerHTML={{ __html: ingrTextAfterSearch }} />);
      } else {
        ingredientList.push(<li key={index} className="edition">- <input
          className="ingredientInput name"
          value={ingr.ingredient}
          type="text"
          data-not-empty
          onChange={this.editField.bind(this, 'ingredient', index)}
          onKeyPress={this.editFieldByEnter.bind(this, 'ingredient', index)}
        /> :
          <input
            className="ingredientInput qte"
            value={ingr.quantity}
            type="text"
            onChange={this.editField.bind(this, 'quantity', index)}
            onKeyPress={this.editFieldByEnter.bind(this, 'quantity', index)}
          />
          <input
            className="ingredientInput unit"
            value={ingr.unit}
            type="text"
            onChange={this.editField.bind(this, 'unit', index)}
            onKeyPress={this.editFieldByEnter.bind(this, 'unit', index)}
          />
          <i className="deleteIngredient material-icons" onClick={() => { this.deleteIngredient(index, ingr.index); }}>delete_forever</i>
        </li>);
      }
    });

    return (
      <div className={this.props.edition ? 'ingredients edition' : 'ingredients'}>
        <div className="ingredientsTitle">Ingrédients</div>
        <ul className="ingredientList">
          {ingredientList}
        </ul>
        <IngredientAdd edition={this.props.edition} recipeID={this.props.recipeID} nextIndex={ingredientList.length} maestro={this.props.maestro} />
        <div className="union" />
      </div>);
  }
}

Ingredients.propTypes = {
  ingredientList: PropTypes.array,
  recipeID: PropTypes.number,
  edition: PropTypes.bool,
  query: PropTypes.string,
  maestro: PropTypes.object
};

Ingredients.defaultProps = { // define the default props
  ingredientList: [],
  recipeID: 1,
  edition: false,
  query: '',
  maestro: { dataRefresh: () => {} }
};

export default Ingredients;

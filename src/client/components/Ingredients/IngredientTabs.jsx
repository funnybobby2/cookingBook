import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './Ingredients.scss';

const hasGroup = (ingredients) => {
  let has = false;
  for (let i = 0, cpt = ingredients.length; i < cpt; i += 1) {
    if ((ingredients[i].group !== undefined) && (ingredients[i].group !== '')) {
      has = true;
      break;
    }
  }
  return has;
};

const getAllGroups = (ingredients) => {
  const groups = [];
  for (let i = 0, cpt = ingredients.length; i < cpt; i += 1) {
    if (ingredients[i].group === undefined) {
      if (!groups.includes('???')) groups.push('???');
    } else if (ingredients[i].group === '') {
      if (!groups.includes('???')) groups.push('???');
    } else if (!groups.includes(ingredients[i].group)) groups.push(ingredients[i].group);
  }
  return groups.sort();
};

class IngredientTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openLegend: false,
      movable: false
    };

    this.openLegend = this.openLegend.bind(this);
    this.toggleMovable = this.toggleMovable.bind(this);
  }

  openLegend() {
    if (hasGroup(this.props.ingredientList) && !this.props.edition) { this.setState({ openLegend: !this.state.openLegend }); }
  }

  toggleMovable() {
    this.props.maestro.dataRefresh('reorderIngredientsAvailable', !this.state.movable);
    this.setState({ movable: !this.state.movable });
  }

  render() {
    const ingredients = this.props.ingredientList;
    const hasAGroup = hasGroup(ingredients);
    const groups = getAllGroups(ingredients);
    const classLegend = this.state.openLegend ? `ingredientsLegend open ${(hasAGroup && !this.props.edition) ? '' : 'disable'}` : `ingredientsLegend ${(hasAGroup && !this.props.edition) ? '' : 'disable'}`;
    const classMovable = this.state.movable ? `ingredientsMove open ${this.props.edition ? '' : 'disable'}` : `ingredientsMove ${this.props.edition ? '' : 'disable'}`;
    const moveIcon = (this.props.user.role === 'admin') ? (
      <div className={classMovable}>
        <i className="material-icons ingredientIcon" title="Déplacer les ingrédients" onClick={this.toggleMovable}>open_with</i>
      </div>) : '';

    return (
      <div className="ingredientTabs">
        <div className={classLegend}>
          <i className="material-icons ingredientIcon" title="Catégories d'ingrédient" onClick={this.openLegend}>ballot</i>
          <div className="legend">
            {groups.map((group, index) => (<div className="legendItem" key={group[index]} > <i className={`material-icons item${index}`} title={group[index]}>label</i> {group} </div>))}
          </div>
        </div>
        {moveIcon}
      </div>);
  }
}

IngredientTabs.propTypes = {
  ingredientList: PropTypes.array,
  edition: PropTypes.bool,
  maestro: PropTypes.object,
  user: PropTypes.object
};

IngredientTabs.defaultProps = { // define the default props
  ingredientList: [],
  edition: false,
  maestro: { dataRefresh: () => {} },
  user: {}
};

export default IngredientTabs;

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
      openLegend: false
    };

    this.openLegend = this.openLegend.bind(this);
  }

  openLegend() {
    if (hasGroup(this.props.ingredientList) && !this.props.edition) { this.setState({ openLegend: !this.state.openLegend }); }
  }

  render() {
    const ingredients = this.props.ingredientList;
    const hasAGroup = hasGroup(ingredients);
    const groups = getAllGroups(ingredients);
    const classLegend = this.state.openLegend ? `ingredientsLegend open ${(hasAGroup && !this.props.edition) ? '' : 'disable'}` : `ingredientsLegend ${(hasAGroup && !this.props.edition) ? '' : 'disable'}`;

    return (
      <div className="ingredientTabs">
        <div className={classLegend}>
          <i className="material-icons ingredientLegendIcon" onClick={this.openLegend}>ballot</i>
          <div className="legend">
            {groups.map((group, index) => (<div className="legendItem"> <i className={`material-icons item${index}`} title={group[index]}>label</i> {group} </div>))}
          </div>
        </div>
      </div>);
  }
}

IngredientTabs.propTypes = {
  ingredientList: PropTypes.array,
  edition: PropTypes.bool
};

IngredientTabs.defaultProps = { // define the default props
  ingredientList: [],
  edition: false
};

export default IngredientTabs;

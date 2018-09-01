import React from 'react';
import PropTypes from 'prop-types';
// Import react components
import RecipeItem from '../RecipeItem/RecipeItem';
// Import style
import './Recipes.scss';

const Recipes = ({
  recipes, user, currentPage, nbItemPerPage, maestro, noSleep
}) => {
  // select the good slice of the recipes
  const start = (currentPage - 1) * nbItemPerPage;
  const end = currentPage * nbItemPerPage;
  recipes = recipes.slice(start, end);

  const recipeItems = [];
  recipes.forEach((recipe) => {
    let isValid = false;
    if (user !== undefined) {
      for (let i = 0, len = recipe.validatedBy.length; i < len; i += 1) {
        if (recipe.validatedBy[i].login === user.login) {
          isValid = true;
          break;
        }
      }
    }

    const recipeItem = { title: recipe.title, id: recipe.recipeID, valid: isValid };
    recipeItems.push(<RecipeItem recipe={recipeItem} key={recipeItem.id} maestro={maestro} noSleep={noSleep} />);
  });

  return (
    <div className="recipes">
      {recipeItems}
    </div>);
};


Recipes.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.shape({
    _id: PropTypes.string,
    login: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user']),
    email: PropTypes.string,
    votedFor: PropTypes.arrayOf(PropTypes.number)
  }),
  currentPage: PropTypes.number,
  nbItemPerPage: PropTypes.number,
  maestro: PropTypes.object,
  noSleep: PropTypes.object
};

Recipes.defaultProps = { // define the default props
  recipes: [],
  user: {
    _id: '', login: '', password: '', role: 'user', email: '', votedFor: []
  },
  currentPage: 1,
  nbItemPerPage: 1,
  maestro: { dataRefresh: () => {} },
  noSleep: {}
};

export default Recipes;

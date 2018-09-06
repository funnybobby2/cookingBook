import React from 'react';
import PropTypes from 'prop-types';
// Import react components
import MenuLateralButton from './MenuLateralButton';
import AddRecipe from '../AddRecipe/AddRecipe';
import Filter from '../Filter/Filter';
// Import styles
import './MenusLateral.scss';
// Import configuration
import configCookingBook from '../../assets/json/menuLateral.json';

const MenusLateral = ({
  aRecipeIsSelected, filters, maestro, user, showCart
}) => {
  const filterTab = [];
  configCookingBook.filters.forEach((filter) => {
    if ((aRecipeIsSelected && (filter.restricted !== 'recipesList')) || (!aRecipeIsSelected && (filter.restricted !== 'oneRecipe'))) { filterTab.push(<Filter classe={filter.classe} title={filter.title} type={filter.type} key={filter.title} over={filter.overview} filters={filters} maestro={maestro} />); }
  });

  const addRecipeButton = ((user !== undefined) && (user.role === 'admin'))
    ? <AddRecipe maestro={maestro} />
    : '';

  const filtersClass = (user !== undefined) ? 'filters' : 'filters disable';

  return (
    <div className="menus" >
      <div className="menuLateralItems">
        {/* boutons de menu gauche pour les recettes au hasard et la liste de course */}
        {configCookingBook.menus.map(button => <MenuLateralButton name={button.title} action={button.actionKey} key={button.title} maestro={maestro} showCart={showCart} />)}
        { addRecipeButton }
      </div>
      <div className={filtersClass}>
        {filterTab}
      </div>
    </div>);
};

MenusLateral.propTypes = {
  aRecipeIsSelected: PropTypes.bool,
  filters: PropTypes.object,
  user: PropTypes.shape({
    _id: PropTypes.string,
    login: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user']),
    email: PropTypes.string
  }),
  maestro: PropTypes.object,
  showCart: PropTypes.bool
};

MenusLateral.defaultProps = { // define the default props
  aRecipeIsSelected: false,
  filters: {
    validate: false,
    new: false,
    dislike: false
  },
  user: undefined,
  maestro: { dataRefresh: () => {} },
  showCart: false
};

export default MenusLateral;

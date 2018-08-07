import React from 'react';
import PropTypes from 'prop-types';
// import react component
import MeatSelector from '../MeatSelector/MeatSelector';
import Spice from '../Spice/Spice';
import Category from '../Category/Category';
import PhotoWithDuration from '../PhotoWithDuration/PhotoWithDuration';
// import styles
import './HeaderRecipe.scss';

const HeaderRecipe = ({
  meatClass, edition, recipeID, maestro, recipeTitle, preparationTime, cuissonTime, restPeriod, nbPerson, nbPersonUnit, category, spicy
}) => (
  <div className="headerRecipe">
    <div className="meatAndSpice">
      <MeatSelector meat={meatClass} edition={edition} recipeID={recipeID} maestro={maestro} />
      <Spice spicy={spicy} />
    </div>
    <PhotoWithDuration
      maestro={maestro}
      recipeID={recipeID}
      recipeTitle={recipeTitle}
      preparationTime={preparationTime}
      cuissonTime={cuissonTime}
      restPeriod={restPeriod}
      nbPerson={nbPerson}
      nbPersonUnit={nbPersonUnit}
      edition={edition}
    />
    <Category edition={edition} recipeID={recipeID} category={category} maestro={maestro} />
  </div>
);

HeaderRecipe.propTypes = {
  meatClass: PropTypes.string,
  recipeTitle: PropTypes.string,
  preparationTime: PropTypes.string,
  restPeriod: PropTypes.string,
  cuissonTime: PropTypes.string,
  nbPerson: PropTypes.string,
  nbPersonUnit: PropTypes.oneOf(['Pers.', 'Pièces']),
  edition: PropTypes.bool,
  recipeID: PropTypes.number,
  spicy: PropTypes.number,
  maestro: PropTypes.object,
  category: PropTypes.string
};

HeaderRecipe.defaultProps = { // define the default props
  meatClass: '',
  recipeTitle: 'Titre',
  preparationTime: '0 min',
  cuissonTime: '0 min',
  restPeriod: '0 min',
  nbPerson: '1',
  nbPersonUnit: 'Pers.',
  edition: false,
  recipeID: 1,
  spicy: 0,
  maestro: { dataRefresh: () => {} },
  category: 'plat'
};

export default HeaderRecipe;

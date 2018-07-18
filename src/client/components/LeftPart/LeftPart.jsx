import React from 'react';
import PropTypes from 'prop-types';
// Import react components
import LogoConnect from '../LogoConnect/LogoConnect';
import MenusLateral from '../MenusLateral/MenusLateral';
// Import style
import './LeftPart.scss';


const LeftPart = ({
  aRecipeIsSelected, filters, user, maestro
}) => (
  <div className="leftPart">
    <LogoConnect user={user} maestro={maestro} />
    <MenusLateral maestro={maestro} user={user} aRecipeIsSelected={aRecipeIsSelected} filters={filters} />
  </div>
);

LeftPart.propTypes = {
  aRecipeIsSelected: PropTypes.bool,
  filters: PropTypes.object,
  user: PropTypes.shape({
    _id: PropTypes.string,
    login: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user']),
    email: PropTypes.string
  }),
  maestro: PropTypes.object
};

LeftPart.defaultProps = { // define the default props
  aRecipeIsSelected: false,
  filters: {
    validate: false,
    new: false,
    dislike: false
  },
  user: undefined,
  maestro: { dataRefresh: () => {} }
};

export default LeftPart;

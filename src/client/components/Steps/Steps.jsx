import React from 'react';
import PropTypes from 'prop-types';
// Import react component
import Step from './Step';
import StepAdd from './StepAdd';
// Import style
import './Steps.scss';

const Steps = ({
  stepList, edition, recipeID, query, maestro
}) => (
  <div className="steps">
    <div className="stepsTitle">Étapes</div>
    <div className="stepList">
      {stepList.map(step => <Step text={step.text} index={step.index} key={step.index} edition={edition} recipeID={recipeID} query={query} maestro={maestro} />)}
    </div>
    <StepAdd edition={edition} recipeID={recipeID} nextIndex={stepList.length} maestro={maestro} />
  </div>
);

Steps.propTypes = {
  stepList: PropTypes.arrayOf(PropTypes.object),
  edition: PropTypes.bool,
  recipeID: PropTypes.number,
  query: PropTypes.string,
  maestro: PropTypes.object
};

Steps.defaultProps = { // define the default props
  stepList: [],
  edition: false,
  recipeID: 1,
  query: '',
  maestro: { dataRefresh: () => {} }
};

export default Steps;

import React from 'react';
import PropTypes from 'prop-types';
// Import styles
import './AddRecipe.scss';

class AddRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.openCreateRecipe = this.openCreateRecipe.bind(this);
  }

  openCreateRecipe() {
    this.props.maestro.dataRefresh('openCreateRecipe');
  }

  render() {
    return (<div className="add" onClick={this.openCreateRecipe} />);
  }
}

AddRecipe.propTypes = {
  maestro: PropTypes.object
};

AddRecipe.defaultProps = { // define the default props
  maestro: { dataRefresh: () => {} }
};

export default AddRecipe;

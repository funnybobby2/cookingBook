import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './TopBarItem.scss';

class TopBarItem extends React.Component {
  constructor(props) {
    super(props);
    this.selectCategory = this.selectCategory.bind(this);
  }

  selectCategory() {
    this.props.maestro.dataRefresh('selectCategory', this.props.action);
  }

  render() {
    return <span className={(this.props.category === this.props.action) ? 'topBarItem selected' : 'topBarItem'} onClick={this.selectCategory}> {this.props.name} </span>;
  }
}

TopBarItem.propTypes = {
  name: PropTypes.string,
  action: PropTypes.string,
  category: PropTypes.string,
  maestro: PropTypes.object
};

TopBarItem.defaultProps = { // define the default props
  name: 'Plats',
  action: 'plat',
  category: 'all',
  maestro: { dataRefresh: () => {} }
};


export default TopBarItem;

import React from 'react';
import PropTypes from 'prop-types';
// Import react components
import TopBarItem from './TopBarItem';
import SearchTopBar from './SearchTopBar';
// Import style
import './TopBar.scss';
// Import configuration
import topBarConf from '../../assets/json/topBar.json';

const TopBar = ({ query, category, maestro }) => (
  <div className="topBar">
    <span className="topBarItems">
      {topBarConf.topBarItems.map(button => <TopBarItem name={button.title} category={category} action={button.actionKey} key={button.title} maestro={maestro} />)}
    </span>
    <SearchTopBar query={query} maestro={maestro} />
  </div>
);

TopBar.propTypes = {
  query: PropTypes.string,
  category: PropTypes.string,
  maestro: PropTypes.object
};

TopBar.defaultProps = { // define the default props
  query: '',
  category: 'all',
  maestro: { dataRefresh: () => {} }
};

export default TopBar;

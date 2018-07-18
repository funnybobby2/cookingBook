import React from 'react';
import PropTypes from 'prop-types';
// Import react components
// Import style
import './SearchTopBar.scss';

class SearchTopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: this.props.query,
      stateClass: 'search-input'
    };
    this.searchRecipes = this.searchRecipes.bind(this);
    this.searchRecipesByEnter = this.searchRecipesByEnter.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
  }

  searchRecipes(e) {
    this.setState({ inputValue: e.target.value });
    this.props.maestro.dataRefresh('searchRecipes', this.search.value);
  }

  searchRecipesByEnter(e) {
    if (e.key === 'Enter') {
      this.props.maestro.dataRefresh('searchRecipes', this.page.value);
    }
  }

  toggleSearch() {
    this.setState({ stateClass: (this.search.className === 'search-input') ? 'search-input open' : 'search-input' });
    setTimeout(() => {
      this.search.focus();
      this.search.select();
    }, 50);
  }

  render() { // exemple de render en ternaire
    return (
      <span id="searchBox">
        <input
          className={this.state.stateClass}
          placeholder=" Chercher..."
          type="text"
          value={this.state.inputValue}
          name="search"
          id="search"
          ref={input => this.search = input}
          onChange={this.searchRecipes}
          onKeyPress={this.searchRecipesByEnter}
          autoComplete="off"
        />
        <span className="icon-search" onClick={this.toggleSearch}>
          <i className="material-icons">search</i>
        </span>
      </span>);
  }
}

SearchTopBar.propTypes = {
  query: PropTypes.string,
  maestro: PropTypes.object
};

SearchTopBar.defaultProps = { // define the default props
  query: '',
  maestro: { dataRefresh: () => {} }
};

export default SearchTopBar;

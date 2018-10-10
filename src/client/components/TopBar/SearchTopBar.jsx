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
      open: false
    };

    this.advancedSearch = this.advancedSearch.bind(this);
    this.searchRecipes = this.searchRecipes.bind(this);
    this.searchRecipesByEnter = this.searchRecipesByEnter.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  advancedSearch() {
    this.props.maestro.dataRefresh('advancedSearch', this.ingredientsIn.value, this.ingredientsOut.value, this.dureeMax.value, this.calories.value);
    this.setState({ open: false });
    this.ingredientsIn.value = '';
    this.ingredientsOut.value = '';
    this.dureeMax.value = '';
    this.calories.value = '';
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

  toggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const openClass = this.state.open ? 'search-form open' : 'search-form';
    const iconOpen = this.state.open ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    return (
      <div id="searchBox">
        <input
          className="search-input"
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
        <span className="icon-toggle" onClick={this.toggle.bind(this)} >
          <i className="material-icons">{iconOpen}</i>
        </span>
        <span className="icon-search">
          <i className="material-icons">search</i>
        </span>

        <div className={openClass} >
          <div className="search-ingredients-in">
            <span>Avec les ingrédients ... </span>
            <input type="text" name="ingredientsIn" autoComplete="off" ref={input => this.ingredientsIn = input} />
          </div>
          <div className="search-ingredients-out">
            <span>Sans les ingrédients ...</span>
            <input type="text" name="ingredientsOut" autoComplete="off" ref={input => this.ingredientsOut = input} />
          </div>
          <div className="search-calories">
            <span>Calories max ...</span>
            <input type="text" name="calories" autoComplete="off" ref={input => this.calories = input} />
          </div>
          <div className="search-max-time">
            <span>Durée max ... </span>
            <input type="text" name="dureeMax" autoComplete="off" ref={input => this.dureeMax = input} />
          </div>
          <div className="search-validation">
            <button className="validSearch" onClick={this.advancedSearch.bind(this)}>Rechercher</button>
          </div>
        </div>
      </div>);
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

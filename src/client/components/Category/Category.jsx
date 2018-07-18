import React from 'react';
import PropTypes from 'prop-types';
// import styles
import './Category.scss';

const categories = ['aperitif', 'entree', 'plat', 'dessert', 'boisson', 'autre'];

class Category extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCat: this.props.category
    };

    this.before = this.before.bind(this);
    this.after = this.after.bind(this);
  }

  componentWillReceiveProps(newProps) { // props/ctx changent => synchro avec state
    this.setState({ currentCat: newProps.category });
  }

  before() {
    const index = (categories.indexOf(this.state.currentCat) === 0 ? 5 : categories.indexOf(this.state.currentCat) - 1);
    this.setState({ currentCat: categories[index] });
    // update in bd
    this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeID, 'category', categories[index]);
  }

  after() {
    const index = (categories.indexOf(this.state.currentCat) === 5 ? 0 : categories.indexOf(this.state.currentCat) + 1);
    this.setState({ currentCat: categories[index] });
    // update in bd
    this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeID, 'category', categories[index]);
  }

  render() {
    const editClass = (this.props.edition ? 'edition' : '');
    const category = this.state.currentCat;
    const categoryImg = require(`../../assets/img/${category}.png`);

    return (
      <div className="editionCategory">
        <img alt="category" src={categoryImg} />
        <span className={editClass}>
          <i className="material-icons before" onClick={this.before}>play_arrow</i>
          <div>{category}</div>
          <i className="material-icons after" onClick={this.after}>play_arrow</i>
        </span>
      </div>);
  }
}

Category.propTypes = {
  category: PropTypes.string,
  edition: PropTypes.bool,
  recipeID: PropTypes.number,
  maestro: PropTypes.object
};

Category.defaultProps = { // define the default props
  category: 'plat',
  edition: false,
  recipeID: 1,
  maestro: { dataRefresh: () => {} }
};

export default Category;

import React from 'react';
import PropTypes from 'prop-types';
// Import react components
import TopBar from '../TopBar/TopBar';
import Foot from '../Foot/Foot';
import Recipes from '../Recipes/Recipes';
import Pagination from '../Pagination/Pagination';
import TopRecipe from '../TopRecipe/TopRecipe';
import HeaderRecipe from '../HeaderRecipe/HeaderRecipe';
import Ingredients from '../Ingredients/Ingredients';
import Steps from '../Steps/Steps';
import ChiefTip from '../ChiefTip/ChiefTip';
import Tags from '../Tags/Tags';
import Comments from '../Comments/Comments';
import ShoppingList from '../ShoppingList/ShoppingList';
// Import style
import './Content.scss';

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false
    };

    this.changeVideoState = this.changeVideoState.bind(this);
  }

  componentWillMount() {
    this.props.maestro.addListener('toggleEdit', 'content', this.toggleEditMode.bind(this));
  }

  changeVideoState() {
    this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeSelected.recipeID, 'video', this.recipeVideo.checked);
  }

  toggleEditMode() {
    this.setState({
      editMode: !this.state.editMode
    });
  }

  render() {
    const recipesList = this.props.recipeList;
    const currentRecipe = this.props.recipeSelected;
    const q = this.props.query;
    const currentPage = this.props.curPage;
    const nbTotalPages = this.props.totalPages;
    const edit = this.state.editMode;
    const video = edit ? (
      currentRecipe.video ? (
        <label className="container"> Vidéo ?
          <input type="checkbox" checked="checked" onChange={this.changeVideoState} ref={input => this.recipeVideo = input} />
          <span className="checkmark" />
        </label>
      ) : (
        <label className="container"> Vidéo ?
          <input type="checkbox" onChange={this.changeVideoState} ref={input => this.recipeVideo = input} />
          <span className="checkmark" />
        </label>
      )
    ) : '';

    return this.props.showCart
      ? (
        <div className="content">
          <TopBar query={q} category={this.props.category} maestro={this.props.maestro} />
          <div className="cartZone">
            <ShoppingList maestro={this.props.maestro} nbItemsInCart={this.props.nbItemsInCart} nbItemsInCartChecked={this.props.nbItemsInCartChecked} />
          </div>
          <Foot />
        </div>
      ) : (
        (currentRecipe === undefined)
          ? (
            <div className="content">
              <TopBar query={q} category={this.props.category} maestro={this.props.maestro} />
              <div className="recipesZone">
                <Recipes recipes={recipesList} currentPage={currentPage} nbItemPerPage={this.props.nbItemPerPage} user={this.props.user} maestro={this.props.maestro} noSleep={this.props.noSleep} />
                <Pagination currentPage={currentPage} nbTotalPages={nbTotalPages} maestro={this.props.maestro} />
              </div>
              <Foot />
            </div>
          ) : (
            <div className="content">
              <TopBar maestro={this.props.maestro} />
              <div className="recipe">
                <TopRecipe
                  recipeTitle={currentRecipe.title}
                  validatedBy={currentRecipe.validatedBy}
                  mark={currentRecipe.mark}
                  nbMark={currentRecipe.nbMark}
                  user={this.props.user}
                  recipeID={currentRecipe.recipeID}
                  edition={edit}
                  query={q}
                  maestro={this.props.maestro}
                />
                <HeaderRecipe
                  category={currentRecipe.category}
                  meatClass={currentRecipe.meatClass}
                  maestro={this.props.maestro}
                  recipeID={currentRecipe.recipeID}
                  recipeTitle={currentRecipe.title}
                  spicy={currentRecipe.spicy}
                  preparationTime={currentRecipe.prepPeriod}
                  cuissonTime={currentRecipe.cookPeriod}
                  reposTime={currentRecipe.restPeriod}
                  nbPerson={currentRecipe.nbPeople}
                  nbPersonUnit={currentRecipe.nbPeopleUnit}
                  edition={edit}
                />
                <div className="ingredientsAndSteps">
                  { video }
                  <Ingredients ingredientList={currentRecipe.ingredients} edition={edit} recipeID={currentRecipe.recipeID} query={q} maestro={this.props.maestro} />
                  <Steps stepList={currentRecipe.steps} edition={edit} recipeID={currentRecipe.recipeID} query={q} video={currentRecipe.video} maestro={this.props.maestro} />
                </div>
                <ChiefTip tip={currentRecipe.chiefTrick} edition={edit} recipeID={currentRecipe.recipeID} query={q} maestro={this.props.maestro} />
                <Tags tags={currentRecipe.tags} edition={edit} recipeID={currentRecipe.recipeID} query={q} maestro={this.props.maestro} />
                <Comments comments={currentRecipe.comments} edition={edit} recipeID={currentRecipe.recipeID} user={this.props.user} maestro={this.props.maestro} />
              </div>
              <Foot />
            </div>));
  }
}

Content.propTypes = {
  recipeList: PropTypes.arrayOf(PropTypes.object),
  recipeSelected: PropTypes.shape({
    title: PropTypes.string,
    validatedBy: PropTypes.arrayOf(PropTypes.object),
    recipeID: PropTypes.number,
    category: PropTypes.string,
    meatClass: PropTypes.string,
    prepPeriod: PropTypes.string,
    cookPeriod: PropTypes.string,
    restPeriod: PropTypes.string,
    nbPeople: PropTypes.string,
    nbPersonUnit: PropTypes.string
  }),
  query: PropTypes.string,
  curPage: PropTypes.number,
  totalPages: PropTypes.number,
  maestro: PropTypes.object,
  category: PropTypes.string,
  nbItemPerPage: PropTypes.number,
  user: PropTypes.shape({
    _id: PropTypes.string,
    login: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user']),
    email: PropTypes.string,
    votedFor: PropTypes.arrayOf(PropTypes.number)
  }),
  showCart: PropTypes.bool,
  nbItemsInCart: PropTypes.number,
  nbItemsInCartChecked: PropTypes.number,
  noSleep: PropTypes.object
};

Content.defaultProps = { // define the default props
  recipeList: [],
  recipeSelected: undefined,
  query: '',
  curPage: 1,
  totalPages: 1,
  maestro: { dataRefresh: () => {} },
  category: '',
  nbItemPerPage: 1,
  user: undefined,
  showCart: false,
  nbItemsInCart: 0,
  nbItemsInCartChecked: 0,
  noSleep: {}
};

// Mixins aren’t supported in ES6 classes.

export default Content;

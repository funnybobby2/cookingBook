import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios'; // to manage REST API
// Import react components
import LeftPart from './components/LeftPart/LeftPart';
import Content from './components/Content/Content';
import Notification from './components/Notification/Notification';
// import services
import { maestro } from './js/services/maestro';
// Import style
import './app.css';

async function getFilteredRecipes(category, onlyDeleted, onlyValidated, onlyNew, query, user) {
  const recipes = await axios.get('/api/recipes', {
    params: {
      cat: category,
      del: onlyDeleted,
      val: onlyValidated,
      new: onlyNew,
      q: query,
      u: (user === undefined) ? user : user._id
    }
  });

  return recipes.data;
}

function getNbTotalPages(nbRecipes) {
  const wH = window.innerHeight;
  const wW = window.innerWidth;
  const nbRecipesPerPage = Math.floor((wH - 138) / 206) * Math.floor((wW - 324) / 173);
  return { nbPages: Math.ceil(nbRecipes / nbRecipesPerPage), nbItems: nbRecipesPerPage };
}

function transformUsersToIDs(arr) {
  const userIDs = [];
  arr.forEach((user) => {
    userIDs.push(user._id);
  });
  return userIDs;
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      currentRecipe: undefined,
      recipes: [],
      searchQuery: '',
      category: 'all',
      filters: {
        validate: false,
        new: false,
        dislike: false
      },
      nbTotalPages: 1,
      currentPage: 1,
      notif: { text: '', state: 'info' }
    };
  }

  componentWillMount() {
    // users
    maestro.addListener('createUserRequest', 'app', this.createUserRequest.bind(this));
    maestro.addListener('connect', 'app', this.connect.bind(this));
    maestro.addListener('unconnect', 'app', this.unconnect.bind(this));
    // recipes
    maestro.addListener('deleteRecipe', 'app', this.deleteRecipe.bind(this));
    maestro.addListener('randomRecipeOrCart', 'app', this.randomRecipeOrCart.bind(this));
    maestro.addListener('selectCategory', 'app', this.selectCategory.bind(this));
    maestro.addListener('searchRecipes', 'app', this.searchRecipes.bind(this));
    maestro.addListener('showRecipe', 'app', this.showRecipe.bind(this));
    maestro.addListener('toggleFilter', 'app', this.toggleFilter.bind(this));
    maestro.addListener('updateSimpleField', 'app', this.updateSimpleField.bind(this));
    maestro.addListener('updateArrayField', 'app', this.updateArrayField.bind(this));
    maestro.addListener('deleteArrayField', 'app', this.deleteArrayField.bind(this));
    maestro.addListener('addArrayField', 'app', this.addArrayField.bind(this));
    // navigations
    maestro.addListener('goTo', 'app', this.goTo.bind(this));
    // notifications
    maestro.addListener('addNotif', 'app', this.addNotif.bind(this));
    // comments
    maestro.addListener('addComment', 'app', this.addComment.bind(this));
    maestro.addListener('deleteComment', 'app', this.deleteComment.bind(this));

    axios.get('/api/recipes')
      .then((res) => {
        this.setState({
          recipes: res.data,
          nbTotalPages: getNbTotalPages(res.data.length).nbPages,
          currentPage: 1
        });
      });

    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  // -------------------------- Comments --------------------------------

  addComment(recipeID, comment, user) {
    axios.put(`/api/recipes/addComment/${recipeID}`, { comment, user }, { upsert: true })
      .then((res) => {
        this.setState({ currentRecipe: res.data });
      });
  }

  deleteComment(recipeID, postedAt) {
    axios.put(`/api/recipes/deleteComment/${recipeID}`, { postedAt }, { upsert: true })
      .then((res) => {
        this.setState({ currentRecipe: res.data });
      });
  }

  // -------------------------- Notifications --------------------------------

  clearNotif() {
    this.setState({
      notif: { text: '', state: 'info' }
    });
  }

  addNotif(text, state) {
    this.setState({
      notif: { text, state }
    });
    setTimeout(this.clearNotif.bind(this), 5000);
  }

  closeNotif() {
    this.setState({ notif: { text: '', state: 'info' } });
  }

  closeNotifByEsc(e) {
    if (e.key !== 'Esc') return;
    this.setState({ notif: { text: '', state: 'info' } });
  }

  // -------------------------- Users --------------------------------

  createUserRequest() {
    this.addNotif('En cours de développement !', 'info');
  }

  connect(login, password) {
    axios.get(`/api/users/${login}/${password}`)
      .then(async (res) => {
        if (res.data !== null) {
          const recipes = await getFilteredRecipes(
            this.state.category,
            this.state.filters.dislike,
            this.state.filters.validate,
            this.state.filters.new,
            this.state.query,
            res.data
          );

          this.setState({
            recipes,
            user: res.data,
            nbTotalPages: getNbTotalPages(recipes.length).nbPages,
            currentPage: 1
          });
        } else {
          this.addNotif(`Utilisateur ${login} je suis désolé mais vous n'existez pas, du moins avec ce login/mot de passe !`, 'error');
        }
      })
      .catch(() => { this.addNotif(`Utilisateur ${login} je suis désolé mais vous n'existez pas, du moins avec ce login/mot de passe !`, 'error'); });
  }

  // UNCONNECT the user
  async unconnect() {
    this.setState({
      user: undefined,
      filters: {
        validated: false,
        new: false,
        dislike: false
      },
      recipes: await getFilteredRecipes(
        this.state.category,
        false,
        false,
        false,
        this.state.query,
        undefined
      )
    });
  }

  async updateDimensions() {
    if ((this.state === undefined) || (this.state.currentRecipe !== undefined)) return;

    const recipes = await getFilteredRecipes(
      this.state.category,
      this.state.filters.dislike,
      this.state.filters.validate,
      this.state.filters.new,
      this.state.query,
      this.state.user
    );

    this.setState({
      recipes,
      nbTotalPages: getNbTotalPages(recipes.length).nbPages,
      currentPage: 1
    });
  }

  // DELETE a recipe
  deleteRecipe(recipeId) {
    axios.put(`/api/recipes/delete/add/${recipeId}`, { user: this.state.user._id }, { upsert: true })
      .then(async (res) => {
        if (res.status === 200) { // delete ok
          const filteredRecipes = await getFilteredRecipes(
            this.state.category,
            this.state.filters.dislike,
            this.state.filters.validate,
            this.state.filters.new,
            this.state.query,
            this.state.user
          );
          // cas numero 1 on delete la recipe depuis la liste
          let curPage;
          const totPages = getNbTotalPages(filteredRecipes.length).nbPages;
          if (this.state.currentRecipe === undefined) {
            curPage = this.state.currentPage;
            if (curPage > totPages) curPage = totPages;
          } else { // cas numero on delete la recipe ouverte
            curPage = 1;
          }

          this.setState({
            recipes: filteredRecipes,
            currentPage: curPage,
            nbTotalPages: totPages
          });
        }
      });
  }

  // NAVIGATION
  goTo(where) {
    switch (where) {
      case 'first': {
        this.setState({
          currentPage: 1
        });
        break;
      }
      case 'previous': {
        this.setState({
          currentPage: ((this.state.currentPage - 1) < 1) ? 1 : (this.state.currentPage - 1)
        });
        break;
      }
      case 'next': {
        const pages = this.state.nbTotalPages;
        this.setState({
          currentPage: ((this.state.currentPage + 1) > pages) ? pages : (this.state.currentPage + 1)
        });
        break;
      }
      case 'last': {
        this.setState({
          currentPage: this.state.nbTotalPages
        });
        break;
      }
      default: {
        let page = 1;
        if (Number(where) > Number(this.state.nbTotalPages)) page = this.state.nbTotalPages;
        else if (Number(where) > 1) page = Number(where);
        this.setState({
          currentPage: page
        });
      }
    }
  }

  // SELECT a random recipe by category
  async randomRecipeOrCart(category) {
    if (category === 'courseListe') this.addNotif('La partie \'liste de course\' est a développer', 'info');
    else {
      // filter by this category
      const recipesFiltered = await getFilteredRecipes(
        category,
        this.state.filters.dislike,
        this.state.filters.validate,
        this.state.filters.new,
        this.state.query,
        this.state.user
      );
      // get a random number between 1 and recipesFiltered.length
      const randomRecipe = recipesFiltered[Math.floor(Math.random() * recipesFiltered.length)];
      // dispatch
      this.setState({
        currentRecipe: randomRecipe
      });
    }
  }

  // SELECT the recipes with title or ingredient or step or tag or chief trick match with query
  async searchRecipes(query) {
    if ((this.state.searchQuery.length > 3) && (query.length < 3)) query = '';
    else if (query.length < 3) return;

    const recipes = await getFilteredRecipes(
      this.state.category,
      this.state.filters.dislike,
      this.state.filters.validate,
      this.state.filters.new,
      query,
      this.state.user
    );

    this.setState({
      searchQuery: query,
      recipes,
      currentRecipe: undefined,
      nbTotalPages: getNbTotalPages(recipes.length).nbPages,
      currentPage: 1
    });
  }

  // SELECT the recipes of this category
  async selectCategory(categoryName) { // TODO à finir pour la partie astuce
    if (categoryName === 'astuce') this.addNotif('La partie \'astuce\' est a développer', 'info');
    else {
      const recipes = await getFilteredRecipes(
        categoryName,
        this.state.filters.dislike,
        this.state.filters.validate,
        this.state.filters.new,
        this.state.query,
        this.state.user
      );

      this.setState({
        recipes,
        category: categoryName,
        currentRecipe: undefined,
        nbTotalPages: getNbTotalPages(recipes.length).nbPages,
        currentPage: 1
      });
    }
  }

  // SHOW a recipe by its ID
  showRecipe(recipeId) {
    axios.get(`/api/recipes/${recipeId}`)
      .then((res) => {
        this.setState({ currentRecipe: res.data });
      });
  }

  // TOGGLE filters new/deleted/validated
  async toggleFilter(filter) {
    const newFilters = this.state.filters;
    newFilters[filter] = !newFilters[filter];

    switch (filter) {
      case 'validate': { // show only validated recipes
        newFilters.new = false;
        newFilters.dislike = false;
        break;
      }
      case 'new': { // show only not validated recipes
        newFilters.validate = false;
        newFilters.dislike = false;
        break;
      }
      case 'dislike': { // show only deleted recipes
        newFilters.validate = false;
        newFilters.new = false;
        break;
      }
      case 'print': { // print the current recipe
        window.print();
        break;
      }
      case 'validator': { // TODO valid or unvalid the current recipe
        const curRecipe = this.state.currentRecipe;
        // on retransforme en array d'id de user !
        const valArr = transformUsersToIDs(curRecipe.validatedBy);
        const i = valArr.indexOf(this.state.user._id);
        if (i > -1) { // you validated
          axios.put(`/api/recipes/validate/del/${curRecipe.recipeID}`, { user: this.state.user._id }, { upsert: true })
            .then((res) => {
              this.setState({ currentRecipe: res.data });
            });
        } else { // you unvalidated
          axios.put(`/api/recipes/validate/add/${curRecipe.recipeID}`, { user: this.state.user._id }, { upsert: true })
            .then((res) => {
              this.setState({ currentRecipe: res.data });
            });
        }
        break;
      }
      case 'cart': { // TODO add to the cart the ingredients
        break;
      }
      default:
        this.addNotif(`Erreur le filtre ${filter} n'est pas connu ici bas.`, 'error');
    }

    const recipes = await getFilteredRecipes(
      this.state.category,
      newFilters.dislike,
      newFilters.validate,
      newFilters.new,
      this.state.query,
      this.state.user
    );

    this.setState({
      filters: newFilters,
      recipes,
      nbTotalPages: getNbTotalPages(recipes.length).nbPages,
      currentPage: 1
    });
  }

  updateSimpleField(recipeID, fieldName, fieldValue, authorizeEmpty = false) {
    if (!authorizeEmpty) {
      if ((fieldValue === undefined) || (fieldValue.length === 0)) return;
    } else if (fieldValue === undefined) return;

    axios.put(`/api/recipes/update/${fieldName}/${recipeID}`, { field: fieldValue }, { upsert: true })
      .then((res) => {
        this.setState({ currentRecipe: res.data });
      });
  }

  deleteArrayField(recipeID, fieldName, index, subField = 'none', fieldValue) {
    axios.put(`/api/recipes/deleteArray/${fieldName}/${index}/${subField}/${recipeID}`, { field: fieldValue })
      .then((res) => {
        this.setState({ currentRecipe: res.data });
      });
  }

  updateArrayField(recipeID, fieldName, index, subField = 'none', fieldValue) {
    axios.put(`/api/recipes/updateArray/${fieldName}/${index}/${subField}/${recipeID}`, { field: fieldValue }, { upsert: true })
      .then((res) => {
        this.setState({ currentRecipe: res.data });
      });
  }

  addArrayField(recipeID, fieldName, fieldValue, isObject = false) {
    axios.put(`/api/recipes/addArray/${fieldName}/${recipeID}/${isObject}`, { field: isObject ? JSON.stringify(fieldValue) : fieldValue }, { upsert: true })
      .then((res) => {
        this.setState({ currentRecipe: res.data });
      });
  }

  render() {
    const currentUser = this.state.user;
    const recips = this.state.recipes;
    const recipe = this.state.currentRecipe;
    const curQuery = this.state.searchQuery;
    const curCategory = this.state.category;
    const curPage = this.state.currentPage;
    const totPages = this.state.nbTotalPages;
    const numberOfItems = getNbTotalPages(recips.length).nbItems;

    return (
      <div className="cookingBook">
        <LeftPart
          user={currentUser}
          maestro={maestro}
          aRecipeIsSelected={!_.isEmpty(recipe)}
          filters={this.state.filters}
        />
        <Content
          recipeList={recips}
          recipeSelected={recipe}
          category={curCategory}
          user={currentUser}
          query={curQuery}
          totalPages={totPages}
          curPage={curPage}
          nbItemPerPage={numberOfItems}
          maestro={maestro}
        />
        <Notification text={this.state.notif.text} state={this.state.notif.state} />
      </div>
    );
  }
}

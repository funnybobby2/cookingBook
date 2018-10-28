import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios'; // to manage REST API
import NoSleep from 'nosleep.js'; // to prevent display sleep and enable wake lock in all Android and iOS web browsers.
import createHistory from 'history/createBrowserHistory'; // to manage history
// Import react components
import LeftPart from './components/LeftPart/LeftPart';
import Content from './components/Content/Content';
import Notification from './components/Notification/Notification';
import UserForm from './components/Form/UserForm/UserForm';
import RecipeForm from './components/Form/RecipeForm/RecipeForm';
import Help from './components/Help/Help';
// import services
import { maestro } from './js/services/maestro';
// Import style
import './app.css';

function getFullTime(recipe) {
  const prepArr = /^(?:([0-9]*)\s*j)?(?:([0-9]*)\s*h)?(?:([0-9]*)\s*[min]?)?/.exec(recipe.prepPeriod);
  const cookArr = /^(?:([0-9]*)\s*j)?(?:([0-9]*)\s*h)?(?:([0-9]*)\s*[min]?)?/.exec(recipe.cookPeriod);
  const sleepArr = /^(?:([0-9]*)\s*j)?(?:([0-9]*)\s*h)?(?:([0-9]*)\s*[min]?)?/.exec(recipe.restPeriod);

  return ((prepArr[1] === undefined) ? 0 : Number(prepArr[1].trim()) * 24 * 60) + ((prepArr[2] === undefined) ? 0 : Number(prepArr[2].trim()) * 60) + ((prepArr[3] === undefined) ? 0 : Number(prepArr[3].trim()))
  + ((cookArr[1] === undefined) ? 0 : Number(cookArr[1].trim()) * 24 * 60) + ((cookArr[2] === undefined) ? 0 : Number(cookArr[2].trim()) * 60) + ((cookArr[3] === undefined) ? 0 : Number(cookArr[3].trim()))
  + ((sleepArr[1] === undefined) ? 0 : Number(sleepArr[1].trim()) * 24 * 60) + ((sleepArr[2] === undefined) ? 0 : Number(sleepArr[2].trim()) * 60) + ((sleepArr[3] === undefined) ? 0 : Number(sleepArr[3].trim()));
}

async function getFilteredRecipes(category, onlyDeleted, onlyValidated, onlyNew, spiceMin, spiceMax, spice, rateMin, rateMax, rate, query, user, ingrIn, ingrOut, calMax, timeMax) {
  if ((ingrIn.length === 1) && (ingrIn[0] === '')) ingrIn = [];
  if ((ingrOut.length === 1) && (ingrOut[0] === '')) ingrOut = [];

  const recipes = await axios.get('/api/recipes', {
    params: {
      cat: category,
      del: onlyDeleted,
      val: onlyValidated,
      new: onlyNew,
      spiceMin,
      spiceMax,
      spice,
      rateMin,
      rateMax,
      rate,
      q: query,
      u: (user === undefined) ? user : user._id
    }
  });

  // filter the result by advance search properties
  const recipesFiltered = recipes.data.filter((recipe) => {
    let matchIngrIn = true;
    let matchIngrOut = true;
    let matchCal = true;
    let matchTime = true;

    const ingredientsName = recipe.ingredients.map(i => i.ingredient.toLowerCase());
    // filter ingredients in
    ingrIn.forEach((iIn) => {
      let isIn = false;
      ingredientsName.forEach((name) => {
        if (name.indexOf(iIn) > -1) isIn = true;
      });

      if (!isIn) matchIngrIn = false;
    });
    // filter ingredients out
    ingrOut.forEach((iOut) => {
      let isIn = false;
      ingredientsName.forEach((name) => {
        if (name.indexOf(iOut) > -1) isIn = true;
      });

      if (isIn) matchIngrOut = false;
    });
    // filter calories max
    if ((calMax === undefined) || (calMax === '') || (recipe.calories === undefined) || (recipe.calories === 0)) matchCal = true;
    else matchCal = recipe.calories <= calMax;
    // filter time max
    if ((timeMax === undefined) || (timeMax === '')) matchTime = true;
    else matchTime = getFullTime(recipe) <= timeMax;

    return matchIngrIn && matchIngrOut && matchCal && matchTime;
  });

  return recipesFiltered;
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
      usersLogin: [],
      openUserForm: false,
      openRecipeForm: false,
      openHelp: false,
      currentRecipe: undefined,
      recipes: [],
      searchQuery: '',
      category: 'all',
      filters: {
        validate: false,
        new: false,
        dislike: false,
        spiceMin: 0,
        spiceMax: 3,
        spice: false,
        rateMin: 0,
        rateMax: 5,
        rate: false,
        ingrIn: [],
        ingrOut: [],
        calMax: undefined,
        timeMax: undefined
      },
      nbTotalPages: 1,
      currentPage: 1,
      notif: { text: '', state: 'info' },
      showCart: false,
      nbItemsInCart: 0,
      nbItemsInCartChecked: 0,
      deltaNbPeople: 0,
      avatars: []
    };
    this.history = createHistory();
    this.noSleep = new NoSleep();
  }

  componentWillMount() {
    // users
    maestro.addListener('createUserRequest', 'app', this.createUserRequest.bind(this));
    maestro.addListener('createUser', 'app', this.createUser.bind(this));
    maestro.addListener('closeUserCreation', 'app', this.closeUserCreation.bind(this));
    maestro.addListener('connect', 'app', this.connect.bind(this));
    maestro.addListener('unconnect', 'app', this.unconnect.bind(this));
    maestro.addListener('updateUser', 'app', this.updateUser.bind(this));
    maestro.addListener('userParameter', 'app', this.userParameter.bind(this));
    // help
    maestro.addListener('closeHelp', 'app', this.closeHelp.bind(this));
    // recipes
    maestro.addListener('deleteRecipe', 'app', this.deleteRecipe.bind(this));
    maestro.addListener('randomRecipeOrCart', 'app', this.randomRecipeOrCart.bind(this));
    maestro.addListener('selectCategory', 'app', this.selectCategory.bind(this));
    maestro.addListener('advancedSearch', 'app', this.advancedSearch.bind(this));
    maestro.addListener('searchRecipes', 'app', this.searchRecipes.bind(this));
    maestro.addListener('showRecipe', 'app', this.showRecipe.bind(this));
    maestro.addListener('toggleFilter', 'app', this.toggleFilter.bind(this));
    maestro.addListener('toggleFilterMinMax', 'app', this.toggleFilterMinMax.bind(this));
    maestro.addListener('updateSimpleField', 'app', this.updateSimpleField.bind(this));
    maestro.addListener('updateArrayField', 'app', this.updateArrayField.bind(this));
    maestro.addListener('deleteArrayField', 'app', this.deleteArrayField.bind(this));
    maestro.addListener('addArrayField', 'app', this.addArrayField.bind(this));
    maestro.addListener('updateMark', 'app', this.updateMark.bind(this));
    maestro.addListener('openCreateRecipe', 'app', this.openCreateRecipe.bind(this));
    maestro.addListener('closeRecipeCreation', 'app', this.closeRecipeCreation.bind(this));
    maestro.addListener('createRecipe', 'app', this.createRecipe.bind(this));
    maestro.addListener('reorderIngredients', 'app', this.reorderIngredients.bind(this));
    maestro.addListener('changeNbPeopleForMe', 'app', this.changeNbPeopleForMe.bind(this));
    // navigations
    maestro.addListener('goTo', 'app', this.goTo.bind(this));
    // notifications
    maestro.addListener('addNotif', 'app', this.addNotif.bind(this));
    // comments
    maestro.addListener('addComment', 'app', this.addComment.bind(this));
    maestro.addListener('deleteComment', 'app', this.deleteComment.bind(this));
    // cart
    maestro.addListener('ingredientBought', 'app', this.updateNbItemsCheckedInCart.bind(this));
    maestro.addListener('cleanCart', 'app', this.cleanCart.bind(this));
    maestro.addListener('clearCart', 'app', this.clearCart.bind(this));
    // help
    maestro.addListener('helper', 'app', this.showHelper.bind(this));


    if (_.isNil(localStorage.getItem('cookingbook_login')) || _.isNil(localStorage.getItem('cookingbook_password'))) {
      axios.get('/api/recipes')
        .then((resRecipes) => {
          axios.get('/api/users')
            .then((resUsers) => {
              axios.get('/api/files/avatars')
                .then((avatars) => {
                  this.setState({
                    recipes: resRecipes.data,
                    nbTotalPages: getNbTotalPages(resRecipes.data.length).nbPages,
                    currentPage: 1,
                    usersLogin: resUsers.data.map(u => u.login),
                    avatars: avatars.data
                  });
                });
            });
        });
    } else {
      axios.get(`/api/users/${localStorage.getItem('cookingbook_login')}/${localStorage.getItem('cookingbook_password')}`)
        .then(async (res) => {
          const recipes = await getFilteredRecipes(
            this.state.category,
            this.state.filters.dislike,
            this.state.filters.validate,
            this.state.filters.new,
            this.state.filters.spiceMin,
            this.state.filters.spiceMax,
            this.state.filters.spice,
            this.state.filters.rateMin,
            this.state.filters.rateMax,
            this.state.filters.rate,
            this.state.searchQuery,
            res.data,
            this.state.filters.ingrIn,
            this.state.filters.ingrOut,
            this.state.filters.calMax,
            this.state.filters.timeMax
          );

          const allUsers = await axios.get('/api/users');
          const avatars = await axios.get('/api/files/avatars');

          this.setState({
            recipes,
            user: res.data,
            nbTotalPages: getNbTotalPages(recipes.length).nbPages,
            currentPage: 1,
            usersLogin: allUsers.data.map(u => u.login),
            avatars: avatars.data
          });
        });
    }


    window.addEventListener('resize', this.updateDimensions.bind(this));

    // Listen for changes to the current location.
    this.history.listen((location, action) => {
      if (action === 'POP') {
        if (location.hash === '') this.selectCategory('all');
        if (location.hash.startsWith('#recipes/page/')) {
          this.setState({
            currentPage: Number(location.hash.slice(14)),
            category: location.state.category,
            filters: location.state.filters,
            nbTotalPages: location.state.nbTotalPages,
            recipes: location.state.recipes,
            searchQuery: location.state.searchQuery,
            user: location.state.user
          });
        }
        if (location.hash.startsWith('#recipes/id/')) this.showRecipe(location.hash.slice(12), false);
      }
    });

    // activate the noSleep mode
    this.noSleep.enable();

    // restore the cart
    let ingredientsStored = window.sessionStorage.getItem('menu-ingredients');
    if (_.isNil(ingredientsStored)) ingredientsStored = {};
    else ingredientsStored = JSON.parse(ingredientsStored);
    let counterIngr = 0;
    let counterIngreChecked = 0;

    Object.keys(ingredientsStored).forEach((ingredientKey) => {
      if (Array.isArray(ingredientsStored[ingredientKey])) {
        ingredientsStored[ingredientKey].forEach((ingr) => {
          counterIngr += 1;
          if (ingr.checked) counterIngreChecked += 1;
        });
      } else {
        counterIngr += 1;
        if (ingredientsStored[ingredientKey].checked) counterIngreChecked += 1;
      }
    });

    this.setState({
      nbItemsInCart: counterIngr,
      nbItemsInCartChecked: counterIngreChecked
    });
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

  // ------------------------------- Cart ------------------------------------

  cleanCart() {
    if (_.isNil(window.sessionStorage.getItem('menu-ingredients'))) return;
    const ingredientsStored = JSON.parse(window.sessionStorage.getItem('menu-ingredients'));

    let counterIngr = 0;

    Object.keys(ingredientsStored).forEach((ingredientKey) => {
      if (Array.isArray(ingredientsStored[ingredientKey])) {
        const cleanedArray = [];
        ingredientsStored[ingredientKey].forEach((ingr) => {
          if (!ingr.checked) {
            counterIngr += 1;
            cleanedArray.push(ingr);
          }
        });
        if (cleanedArray.length === 0) delete ingredientsStored[ingredientKey];
        if (cleanedArray.length === 1) {
          const uniqItem = cleanedArray[0];
          ingredientsStored[ingredientKey] = uniqItem;
        }
        if (cleanedArray.length > 1) ingredientsStored[ingredientKey] = cleanedArray;
      } else if (ingredientsStored[ingredientKey].checked) delete ingredientsStored[ingredientKey];
      else counterIngr += 1;
    });

    window.sessionStorage.removeItem('menu-ingredients');
    window.sessionStorage.setItem('menu-ingredients', JSON.stringify(ingredientsStored));

    this.setState({
      nbItemsInCart: counterIngr,
      nbItemsInCartChecked: 0
    });
  }

  clearCart() {
    if (_.isNil(window.sessionStorage.getItem('menu-ingredients'))) return;
    window.sessionStorage.removeItem('menu-ingredients');
    this.setState({
      nbItemsInCart: 0,
      nbItemsInCartChecked: 0
    });
  }

  updateNbItemsCheckedInCart(checkValue, name, quantity, unit) {
    this.setState({ nbItemsInCartChecked: this.state.nbItemsInCartChecked + checkValue });

    const ingredientsStored = JSON.parse(window.sessionStorage.getItem('menu-ingredients'));
    if (Array.isArray(ingredientsStored[name])) {
      ingredientsStored[name].forEach((ingr) => {
        if ((ingr.unit === unit) && (ingr.quantity === quantity)) ingr.checked = (checkValue === 1);
      });
    } else {
      ingredientsStored[name].checked = (checkValue === 1);
    }
    window.sessionStorage.removeItem('menu-ingredients');
    window.sessionStorage.setItem('menu-ingredients', JSON.stringify(ingredientsStored));
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
    this.setState({ openUserForm: true });
  }

  createUser(login, password, email, logo) {
    axios.post('/api/users/', {
      login, password, email, logo
    })
      .then(async (res) => {
        if (res.status === 200) { // insert ok
          this.connect(login, password);
        }
      });
  }

  closeUserCreation() {
    this.setState({ openUserForm: false });
  }

  connect(login, password) {
    axios.get(`/api/users/${login}/${password}`)
      .then(async (res) => {
        if (res.data !== null) {
          localStorage.setItem('cookingbook_login', login);
          localStorage.setItem('cookingbook_password', password);

          const recipes = await getFilteredRecipes(
            this.state.category,
            this.state.filters.dislike,
            this.state.filters.validate,
            this.state.filters.new,
            this.state.filters.spiceMin,
            this.state.filters.spiceMax,
            this.state.filters.spice,
            this.state.filters.rateMin,
            this.state.filters.rateMax,
            this.state.filters.rate,
            this.state.searchQuery,
            res.data,
            this.state.filters.ingrIn,
            this.state.filters.ingrOut,
            this.state.filters.calMax,
            this.state.filters.timeMax
          );

          this.setState({
            recipes,
            user: res.data,
            nbTotalPages: getNbTotalPages(recipes.length).nbPages,
            currentPage: 1,
            openUserForm: false,
            openRecipeForm: false,
            deltaNbPeople: 0
          });

          this.addNotif(`Connexion réussie ${login} !`, 'success');
        } else {
          this.addNotif(`Utilisateur ${login} je suis désolé mais vous n'existez pas, du moins avec ce login/mot de passe !`, 'error');
        }
      })
      .catch(() => { this.addNotif(`Utilisateur ${login} je suis désolé mais vous n'existez pas, du moins avec ce login/mot de passe !`, 'error'); });
  }

  // UNCONNECT the user
  async unconnect() {
    localStorage.removeItem('cookingbook_login');
    localStorage.removeItem('cookingbook_password');

    this.setState({
      user: undefined,
      deltaNbPeople: 0,
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
        0,
        3,
        false,
        0,
        5,
        false,
        this.state.searchQuery,
        undefined,
        this.state.filters.ingrIn,
        this.state.filters.ingrOut,
        this.state.filters.calMax,
        this.state.filters.timeMax
      )
    });
  }

  updateUser(id, login, password, email, logo) {
    axios.put('/api/users/update', {
      id, login, password, email, logo
    }, { upsert: true })
      .then((res) => {
        this.setState({ user: res.data, openUserForm: false });
      });
  }

  userParameter() {
    this.setState({ openUserForm: true });
  }

  async updateDimensions() {
    if ((this.state === undefined) || (this.state.currentRecipe !== undefined)) return;

    const recipes = await getFilteredRecipes(
      this.state.category,
      this.state.filters.dislike,
      this.state.filters.validate,
      this.state.filters.new,
      this.state.filters.spiceMin,
      this.state.filters.spiceMax,
      this.state.filters.spice,
      this.state.filters.rateMin,
      this.state.filters.rateMax,
      this.state.filters.rate,
      this.state.searchQuery,
      this.state.user,
      this.state.filters.ingrIn,
      this.state.filters.ingrOut,
      this.state.filters.calMax,
      this.state.filters.timeMax
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
            this.state.filters.spiceMin,
            this.state.filters.spiceMax,
            this.state.filters.spice,
            this.state.filters.rateMin,
            this.state.filters.rateMax,
            this.state.filters.rate,
            this.state.searchQuery,
            this.state.user,
            this.state.filters.ingrIn,
            this.state.filters.ingrOut,
            this.state.filters.calMax,
            this.state.filters.timeMax
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
            nbTotalPages: totPages,
            deltaNbPeople: 0
          });
        }
      });
  }

  goTo(where, recordInHistory = true) {
    switch (where) {
      case 'first': {
        this.setState({
          currentPage: 1,
          currentRecipe: undefined,
          deltaNbPeople: 0
        });
        this.history.push('#recipes/page/1', {
          category: this.state.category,
          filters: this.state.filters,
          nbTotalPages: this.state.nbTotalPages,
          recipes: this.state.recipes,
          searchQuery: this.state.searchQuery,
          user: this.state.user
        });
        break;
      }
      case 'previous': {
        this.setState({
          currentPage: ((this.state.currentPage - 1) < 1) ? 1 : (this.state.currentPage - 1),
          currentRecipe: undefined,
          deltaNbPeople: 0
        });
        this.history.push(`#recipes/page/${((this.state.currentPage - 1) < 1) ? 1 : (this.state.currentPage - 1)}`, {
          category: this.state.category,
          filters: this.state.filters,
          nbTotalPages: this.state.nbTotalPages,
          recipes: this.state.recipes,
          searchQuery: this.state.searchQuery,
          user: this.state.user
        });
        break;
      }
      case 'next': {
        const pages = this.state.nbTotalPages;
        this.setState({
          currentPage: ((this.state.currentPage + 1) > pages) ? pages : (this.state.currentPage + 1),
          currentRecipe: undefined,
          deltaNbPeople: 0
        });
        this.history.push(`#recipes/page/${((this.state.currentPage + 1) > pages) ? pages : (this.state.currentPage + 1)}`, {
          category: this.state.category,
          filters: this.state.filters,
          nbTotalPages: this.state.nbTotalPages,
          recipes: this.state.recipes,
          searchQuery: this.state.searchQuery,
          user: this.state.user
        });
        break;
      }
      case 'last': {
        this.setState({
          currentPage: this.state.nbTotalPages,
          currentRecipe: undefined,
          deltaNbPeople: 0
        });
        this.history.push(`#recipes/page/${this.state.nbTotalPages}`, {
          category: this.state.category,
          filters: this.state.filters,
          nbTotalPages: this.state.nbTotalPages,
          recipes: this.state.recipes,
          searchQuery: this.state.searchQuery,
          user: this.state.user
        });
        break;
      }
      default: {
        let page = 1;
        if (Number(where) > Number(this.state.nbTotalPages)) page = this.state.nbTotalPages;
        else if (Number(where) > 1) page = Number(where);
        this.setState({
          currentPage: page,
          currentRecipe: undefined,
          deltaNbPeople: 0
        });
        if (recordInHistory) {
          this.history.push(`#recipes/page/${page}`, {
            category: this.state.category,
            filters: this.state.filters,
            nbTotalPages: this.state.nbTotalPages,
            recipes: this.state.recipes,
            searchQuery: this.state.searchQuery,
            user: this.state.user
          });
        }
      }
    }
  }

  // SELECT a random recipe by category
  async randomRecipeOrCart(category) {
    if (category === 'courseListe') {
      this.setState({
        showCart: !this.state.showCart
      });
    } else {
      // filter by this category
      const recipesFiltered = await getFilteredRecipes(
        category,
        this.state.filters.dislike,
        this.state.filters.validate,
        this.state.filters.new,
        this.state.filters.spiceMin,
        this.state.filters.spiceMax,
        this.state.filters.spice,
        this.state.filters.rateMin,
        this.state.filters.rateMax,
        this.state.filters.rate,
        this.state.searchQuery,
        this.state.user,
        this.state.filters.ingrIn,
        this.state.filters.ingrOut,
        this.state.filters.calMax,
        this.state.filters.timeMax
      );
      // get a random number between 1 and recipesFiltered.length
      const randomRecipe = recipesFiltered[Math.floor(Math.random() * recipesFiltered.length)];
      // dispatch
      this.setState({
        currentRecipe: randomRecipe,
        deltaNbPeople: 0
      });
    }
  }

  async advancedSearch(ingredientsIn, ingredientsOut, calories, time) {
    const recipes = await getFilteredRecipes(
      this.state.category,
      this.state.filters.dislike,
      this.state.filters.validate,
      this.state.filters.new,
      this.state.filters.spiceMin,
      this.state.filters.spiceMax,
      this.state.filters.spice,
      this.state.filters.rateMin,
      this.state.filters.rateMax,
      this.state.filters.rate,
      this.state.searchQuery,
      this.state.user,
      ingredientsIn.trim().split(' '),
      ingredientsOut.trim().split(' '),
      (calories === '') ? undefined : Number(calories),
      (time === '') ? undefined : Number(time)
    );

    this.setState({
      recipes,
      currentRecipe: undefined,
      deltaNbPeople: 0,
      nbTotalPages: getNbTotalPages(recipes.length).nbPages,
      currentPage: 1
    });
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
      this.state.filters.spiceMin,
      this.state.filters.spiceMax,
      this.state.filters.spice,
      this.state.filters.rateMin,
      this.state.filters.rateMax,
      this.state.filters.rate,
      query,
      this.state.user,
      this.state.filters.ingrIn,
      this.state.filters.ingrOut,
      this.state.filters.calMax,
      this.state.filters.timeMax
    );

    this.setState({
      searchQuery: query,
      recipes,
      currentRecipe: undefined,
      deltaNbPeople: 0,
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
        this.state.filters.spiceMin,
        this.state.filters.spiceMax,
        this.state.filters.spice,
        this.state.filters.rateMin,
        this.state.filters.rateMax,
        this.state.filters.rate,
        this.state.searchQuery,
        this.state.user,
        this.state.filters.ingrIn,
        this.state.filters.ingrOut,
        this.state.filters.calMax,
        this.state.filters.timeMax
      );

      this.setState({
        recipes,
        category: categoryName,
        currentRecipe: undefined,
        deltaNbPeople: 0,
        nbTotalPages: getNbTotalPages(recipes.length).nbPages,
        currentPage: 1
      });

      this.history.push('#recipes/page/1', {
        category: categoryName,
        filters: this.state.filters,
        nbTotalPages: this.state.nbTotalPages,
        recipes,
        searchQuery: this.state.searchQuery,
        user: this.state.user
      });
    }
  }

  // SHOW a recipe by its ID
  showRecipe(recipeId, recordInHistory = true) {
    axios.get(`/api/recipes/${recipeId}`)
      .then((res) => {
        this.setState({ currentRecipe: res.data, deltaNbPeople: 0 });
      });
    if (recordInHistory) this.history.push(`#recipes/id/${recipeId}`);
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
      case 'hot': {
        newFilters.spice = !newFilters.spice;
        break;
      }
      case 'starFilter': { // filter the recipes by spicy rank or rate
        newFilters.rate = !newFilters.rate;
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
      case 'cart': {
        let needRemove = false;
        let count = 0;
        const delta = (Number(this.state.currentRecipe.nbPeople) + Number(this.state.deltaNbPeople)) / Number(this.state.currentRecipe.nbPeople);
        const ingr = _.isNil(sessionStorage.getItem('menu-ingredients')) ? {} : JSON.parse(sessionStorage.getItem('menu-ingredients'));
        this.state.currentRecipe.ingredients.forEach((ingredient) => {
          if (_.isEmpty(ingr)) {
            ingr[ingredient.ingredient] = { quantity: ((ingredient.quantity === '') ? '' : Number(ingredient.quantity) * Number(delta)), unit: ingredient.unit, checked: false };
            count += 1;
          } else {
            needRemove = true;
            if (!_.isNil(ingr[ingredient.ingredient])) { // the key exist, need to update the quantity
              // if unit is the same, sum the quantity
              if (Array.isArray(ingr[ingredient.ingredient])) {
                let findit = false;
                ingr[ingredient.ingredient].forEach((subIngr) => {
                  if (subIngr.unit === ingredient.unit) {
                    if (subIngr.quantity !== '') {
                      findit = true;
                      subIngr = { quantity: Number(subIngr.quantity) + (((ingredient.quantity === '') ? '' : Number(ingredient.quantity) * Number(delta))), unit: ingredient.unit, checked: false };
                    }
                  }
                });
                if (!findit) {
                  ingr[ingredient.ingredient].push({ quantity: ((ingredient.quantity === '') ? '' : Number(ingredient.quantity) * Number(delta)), unit: ingredient.unit, checked: false });
                  count += 1;
                }
              } else if (ingredient.unit === ingr[ingredient.ingredient].unit) {
                if (ingredient.quantity !== '') ingr[ingredient.ingredient] = { quantity: (((ingredient.quantity === '') ? '' : Number(ingredient.quantity) * Number(delta))) + Number(ingr[ingredient.ingredient].quantity), unit: ingredient.unit, checked: false };
              } else {
                ingr[ingredient.ingredient] = [ingr[ingredient.ingredient], { quantity: ((ingredient.quantity === '') ? '' : Number(ingredient.quantity) * Number(delta)), unit: ingredient.unit, checked: false }];
                count += 1;
              }
            } else {
              ingr[ingredient.ingredient] = { quantity: ((ingredient.quantity === '') ? '' : Number(ingredient.quantity) * Number(delta)), unit: ingredient.unit, checked: false };
              count += 1;
            }
            if (needRemove) sessionStorage.removeItem('menu-ingredients');
            sessionStorage.setItem('menu-ingredients', JSON.stringify(ingr));
          }
        });
        this.setState({ nbItemsInCart: this.state.nbItemsInCart + count });
        this.addNotif('Les ingrédients de la recette ont été ajouté à votre liste de course', 'success');
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
      newFilters.spiceMin,
      newFilters.spiceMax,
      newFilters.spice,
      newFilters.rateMin,
      newFilters.rateMax,
      newFilters.rate,
      this.state.searchQuery,
      this.state.user,
      this.state.filters.ingrIn,
      this.state.filters.ingrOut,
      this.state.filters.calMax,
      this.state.filters.timeMax
    );

    this.setState({
      filters: newFilters,
      recipes,
      nbTotalPages: getNbTotalPages(recipes.length).nbPages,
      currentPage: 1
    });
  }

  async toggleFilterMinMax(min, max, filter) {
    const newFilters = this.state.filters;
    newFilters[filter] = true;
    if (filter === 'hot') {
      newFilters.spice = true;
      newFilters.spiceMin = min;
      newFilters.spiceMax = max;
    } else {
      newFilters.rate = true;
      newFilters.rateMin = min;
      newFilters.rateMax = max;
    }

    const recipes = await getFilteredRecipes(
      this.state.category,
      newFilters.dislike,
      newFilters.validate,
      newFilters.new,
      newFilters.spiceMin,
      newFilters.spiceMax,
      newFilters.spice,
      newFilters.rateMin,
      newFilters.rateMax,
      newFilters.rate,
      this.state.searchQuery,
      this.state.user,
      this.state.filters.ingrIn,
      this.state.filters.ingrOut,
      this.state.filters.calMax,
      this.state.filters.timeMax
    );

    this.setState({
      filters: newFilters,
      recipes,
      nbTotalPages: getNbTotalPages(recipes.length).nbPages,
      currentPage: 1
    });
  }

  changeNbPeopleForMe(value) {
    this.setState({ deltaNbPeople: this.state.deltaNbPeople + value });
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

  reorderIngredients(recipeID, ingrToBeMoved, ingrTarget) {
    const ingrs = this.state.currentRecipe.ingredients;

    const ingrsReordered = [];
    // on remet le tableau d'ingredients dans l'ordre que l'on souhaite
    ingrs.forEach((i) => {
      if (i.index !== ingrToBeMoved.index) {
        if (i.index === ingrTarget.index) ingrsReordered.push(ingrToBeMoved);
        ingrsReordered.push(i);
      }
    });

    axios.put(`/api/recipes/reorderIngredients/${recipeID}`, { ingredients: JSON.stringify(ingrsReordered) })
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

  updateMark(recipeID, mark, userID) {
    axios.put(`/api/recipes/mark/${recipeID}`, { mark }, { upsert: true })
      .then((resRecipe) => {
        axios.put(`/api/users/mark/${recipeID}`, { user: userID }, { upsert: true })
          .then((resUser) => {
            this.setState({ currentRecipe: resRecipe.data, user: resUser.data });
          });
      });
  }

  openCreateRecipe() {
    this.setState({ openRecipeForm: true });
  }

  closeRecipeCreation() {
    this.setState({ openRecipeForm: false });
  }

  createRecipe(recipe) {
    axios.post('/api/recipes/create', { recipe: JSON.stringify(recipe) }, { upsert: true })
      .then((resRecipe) => {
        this.setState({ currentRecipe: undefined, openRecipeForm: false });
        this.addNotif(`La recette n° ${resRecipe.data.recipeID} "${resRecipe.data.title}" a bien été créée`, 'success');
      });
  }

  // HELPER
  showHelper() {
    this.setState({ openHelp: true });
  }

  closeHelp() {
    this.setState({ openHelp: false });
  }

  render() {
    const numberOfItems = getNbTotalPages(this.state.recipes.length).nbItems;

    return (
      <div className="cookingBook">
        <LeftPart
          user={this.state.user}
          maestro={maestro}
          aRecipeIsSelected={!_.isEmpty(this.state.currentRecipe)}
          filters={this.state.filters}
          showCart={this.state.showCart}
        />
        <Content
          recipeList={this.state.recipes}
          recipeSelected={this.state.currentRecipe}
          category={this.state.category}
          user={this.state.user}
          query={this.state.searchQuery}
          totalPages={this.state.nbTotalPages}
          curPage={this.state.currentPage}
          nbItemPerPage={numberOfItems}
          showCart={this.state.showCart}
          maestro={maestro}
          nbItemsInCart={this.state.nbItemsInCart}
          nbItemsInCartChecked={this.state.nbItemsInCartChecked}
          noSleep={this.noSleep}
          delta={this.state.deltaNbPeople}
        />
        <Notification text={this.state.notif.text} state={this.state.notif.state} />
        <UserForm usersLogin={this.state.usersLogin} open={this.state.openUserForm} maestro={maestro} user={this.state.user} avatars={this.state.avatars} />
        <RecipeForm open={this.state.openRecipeForm} maestro={maestro} />
        <Help open={this.state.openHelp} maestro={maestro} />
      </div>
    );
  }
}


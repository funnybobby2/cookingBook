import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';
// Import style
import './RecipeForm.scss';

const categories = [
  { value: 'aperitif', label: 'Apéritif' },
  { value: 'autre', label: 'Autre (pains, sauces, pâtes...)' },
  { value: 'boisson', label: 'Boisson' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'entree', label: 'Entrée' },
  { value: 'plat', label: 'Plat' }
];

const meats = [
  { value: '', label: 'Aucune' },
  { value: 'boeuf', label: 'Boeuf' },
  { value: 'boeufporc', label: 'Boeuf & porc' },
  { value: 'canard', label: 'Canard' },
  { value: 'crustace', label: 'Crustacés' },
  { value: 'mouton', label: 'Mouton' },
  { value: 'moutonpoulet', label: 'Mouton & poulet' },
  { value: 'poisson', label: 'Poisson' },
  { value: 'porc', label: 'Porc' },
  { value: 'porccrustace', label: 'Porc & crustacés' },
  { value: 'porcpoisson', label: 'Porc & poisson' },
  { value: 'poulet', label: 'Poulet' },
  { value: 'pouletcrustace', label: 'Poulet & crustacés' },
  { value: 'pouletporc', label: 'Poulet & porc' },
  { value: 'vegetable', label: 'Végétarien' }
];

const times = [
  { value: 'min', label: 'Minutes' },
  { value: 'h', label: 'Heures' },
  { value: 'j', label: 'Jours' }
];

const parts = [
  { value: 'Pers.', label: 'Personnes' },
  { value: 'Pièces', label: 'Pièces' }
];

class RecipeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categorySelectedOption: null,
      meatSelectedOption: null,
      preparationSelectedOption: null,
      cuissonSelectedOption: null,
      sleepSelectedOption: null,
      partSelectedOption: null,
      ingredientsInput: [],
      stepsInput: [],
      tagsInput: []
    };

    this.valideRecipe = this.valideRecipe.bind(this);
    this.closeForm = this.closeForm.bind(this);

    this.categoryHandleChange = this.categoryHandleChange.bind(this);
    this.meatHandleChange = this.meatHandleChange.bind(this);
    this.preparationHandleChange = this.preparationHandleChange.bind(this);
    this.cuissonHandleChange = this.cuissonHandleChange.bind(this);
    this.sleepHandleChange = this.sleepHandleChange.bind(this);
    this.partHandleChange = this.partHandleChange.bind(this);

    this.addIngredientInputs = this.addIngredientInputs.bind(this);
    this.addStepInputs = this.addStepInputs.bind(this);
    this.addTagInputs = this.addTagInputs.bind(this);
  }

  categoryHandleChange(categorySelectedOption) {
    this.setState({ categorySelectedOption });
  }

  meatHandleChange(meatSelectedOption) {
    this.setState({ meatSelectedOption });
  }

  preparationHandleChange(preparationSelectedOption) {
    this.setState({ preparationSelectedOption });
  }

  cuissonHandleChange(cuissonSelectedOption) {
    this.setState({ cuissonSelectedOption });
  }

  sleepHandleChange(sleepSelectedOption) {
    this.setState({ sleepSelectedOption });
  }

  partHandleChange(partSelectedOption) {
    this.setState({ partSelectedOption });
  }

  valideRecipe() {
    // construct object for save recipe in datbase
    const ingredients = [];
    for (let i = 0, cpt = this.state.ingredientsInput.length; i < cpt; i++) {
      ingredients.push({
        ingredient: this[`ingrNameInput${i}`].value, quantity: this[`ingrQuantityInput${i}`].value, unit: this[`ingrUnitInput${i}`].value, index: i + 1
      });
    }

    const steps = [];
    for (let j = 0, cpt2 = this.state.stepsInput.length; j < cpt2; j++) {
      steps.push({ text: this[`stepInput${j}`].value, index: j + 1 });
    }

    const tags = [];
    for (let k = 0, cpt3 = this.state.tagsInput.length; k < cpt3; k++) {
      tags.push(this[`tagInput${k}`].value);
    }


    const newRecipe = {
      category: this.state.categorySelectedOption.value,
      title: this.recipeTitle.value,
      prepPeriod: `${this.recipePrep.value} ${this.state.preparationSelectedOption.value}`,
      cookPeriod: `${this.recipeCook.value} ${this.state.cuissonSelectedOption.value}`,
      restPeriod: `${this.recipeSleep.value} ${this.state.sleepSelectedOption.value}`,
      nbPeople: this.recipeNbPerson.value,
      nbPeopleUnit: this.state.partSelectedOption.value,
      spicy: 0,
      meatClass: this.state.meatSelectedOption.value,
      ingredients,
      steps,
      tags
    };
    if (!_.isEmpty(this.recipeTips.value)) newRecipe.chiefTrick = this.recipeTips.value;

    // If you arrived here, congratulations, you are worthy to create this recipe
    this.props.maestro.dataRefresh('createRecipe', newRecipe);

    this.setState({
      categorySelectedOption: null,
      meatSelectedOption: null,
      preparationSelectedOption: null,
      cuissonSelectedOption: null,
      sleepSelectedOption: null,
      partSelectedOption: null,
      ingredientsInput: [],
      stepsInput: [],
      tagsInput: []
    });
  }

  closeForm() {
    this.props.maestro.dataRefresh('closeRecipeCreation');
  }

  addIngredientInputs() {
    const ingrArray = this.state.ingredientsInput;
    ingrArray.push({ ingredient: '', quantity: '', unit: '' });

    this.setState({ ingredientsInput: ingrArray });
  }

  addStepInputs() {
    const stepArray = this.state.stepsInput;
    stepArray.push({ text: '' });

    this.setState({ stepsInput: stepArray });
  }

  addTagInputs() {
    const tagArray = this.state.tagsInput;
    tagArray.push({ text: '' });

    this.setState({ tagsInput: tagArray });
  }

  render() {
    const {
      categorySelectedOption, meatSelectedOption, preparationSelectedOption, cuissonSelectedOption, sleepSelectedOption, partSelectedOption
    } = this.state;
    const containerClass = this.props.open ? 'formContainer show' : 'formContainer';

    return (
      <div className={containerClass}>
        <div className="recipeForm">
          <div className="formTitle">Création de votre recette</div>
          <div className="inputs">
            <input type="text" name="title" className="recipeInput" placeholder="Titre" ref={input => this.recipeTitle = input} />
            <Select value={categorySelectedOption} onChange={this.categoryHandleChange} name="category" placeholder="Catégorie" className="recipeSelect" options={categories} />
            <Select value={meatSelectedOption} onChange={this.meatHandleChange} name="meat" placeholder="Viandes" className="recipeSelect" options={meats} />
            <div className="photoAndDuration">
              <div className="photoRecipe" />
              <div className="photoInputs">
                <div className="inputAndTime">
                  <input type="text" name="preparation" className="recipeInput" placeholder="Durée préparation" ref={input => this.recipePrep = input} />
                  <Select value={preparationSelectedOption} onChange={this.preparationHandleChange} name="preparation" placeholder="Unité de temps" className="timeSelect" options={times} />
                </div>

                <div className="inputAndTime">
                  <input type="text" name="cuisson" className="recipeInput" placeholder="Durée cuisson" ref={input => this.recipeCook = input} />
                  <Select value={cuissonSelectedOption} onChange={this.cuissonHandleChange} name="cuisson" placeholder="Unité de temps" className="timeSelect" options={times} />
                </div>
                <div className="inputAndTime">
                  <input type="text" name="sleep" className="recipeInput" placeholder="Durée de repos" ref={input => this.recipeSleep = input} />
                  <Select value={sleepSelectedOption} onChange={this.sleepHandleChange} name="sleep" placeholder="Unité de temps" className="timeSelect" options={times} />
                </div>
                <div className="inputAndTime">
                  <input type="text" name="part" className="recipeInput" placeholder="Nombre de part" ref={input => this.recipeNbPerson = input} />
                  <Select value={partSelectedOption} onChange={this.partHandleChange} name="part" placeholder="Unité de parts" className="timeSelect" options={parts} />
                </div>
              </div>
            </div>

            <input type="text" name="astuce" className="recipeInput" placeholder="Astuce" ref={input => this.recipeTips = input} />

            <div className="separator" />

            <div className="ingredientsCreator">
              <div className="ingredientsCreatorTitle">Ingredients <i className="material-icons" onClick={this.addIngredientInputs}>control_point</i></div>
              {this.state.ingredientsInput.map((ingr, index) => <div className="ingrInputs"> <input type="text" ref={input => this[`ingrNameInput${index}`] = input} name="ingredient" placeholder="Nom" /> <input type="text" ref={input => this[`ingrQuantityInput${index}`] = input} name="quantity" placeholder="Quantité" /> <input type="text" name="unit" ref={input => this[`ingrUnitInput${index}`] = input} placeholder="Unité" /> </div>)}
            </div>

            <div className="separator" />

            <div className="stepsCreator">
              <div className="stepsCreatorTitle">Etapes <i className="material-icons" onClick={this.addStepInputs}>control_point</i></div>
              {this.state.stepsInput.map((step, index) => <div className="stepsInputs"> <input type="text" ref={input => this[`stepInput${index}`] = input} name="step" placeholder="Etape" /> </div>)}
            </div>

            <div className="separator" />

            <div className="tagsCreator">
              <div className="tagsCreatorTitle">Tags <i className="material-icons" onClick={this.addTagInputs}>control_point</i></div>
              {this.state.tagsInput.map((tag, index) => <div className="tagsInputs"> <input type="text" ref={input => this[`tagInput${index}`] = input} name="tag" placeholder="Tag" /> </div>)}
            </div>

          </div>
          <div className="buttons">
            <button className="validRecipe" onClick={this.valideRecipe}>Valider</button>
            <button className="closeRecipe" onClick={this.closeForm}>Annuler</button>
          </div>
        </div>
      </div>);
  }
}

RecipeForm.propTypes = {
  open: PropTypes.bool,
  maestro: PropTypes.object
};

RecipeForm.defaultProps = { // define the default props
  open: false,
  maestro: { dataRefresh: () => {} }
};
export default RecipeForm;

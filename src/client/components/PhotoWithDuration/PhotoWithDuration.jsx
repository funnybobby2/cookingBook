import React from 'react';
import PropTypes from 'prop-types';
// import react component
import Fire from '../Fire/Fire';
import Moon from '../Moon/Moon';
// import styles
import './PhotoWithDuration.scss';

class PhotoWithDuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputPrepValue: this.props.preparationTime,
      inputCookValue: this.props.cuissonTime,
      inputRestValue: this.props.restPeriod,
      inputNbPersonValue: this.props.nbPerson,
      inputNbPersonUnitValue: this.props.nbPersonUnit,
    };

    this.changeUnit = this.changeUnit.bind(this);
    this.editField = this.editField.bind(this);
    this.editFieldByEnter = this.editFieldByEnter.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  changeUnit() {
    if (this.state.inputNbPersonUnitValue === 'Pers.') {
      this.setState({ inputNbPersonUnitValue: 'Pièces' });
      this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeID, 'nbPeopleUnit', 'Pièces');
    } else {
      this.setState({ inputNbPersonUnitValue: 'Pers.' });
      this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeID, 'nbPeopleUnit', 'Pers.');
    }
  }

  editField(e) {
    switch (e.target.id) {
      case 'prepPeriod': {
        this.setState({ inputPrepValue: e.target.value }); break;
      }
      case 'cookPeriod': {
        this.setState({ inputCookValue: e.target.value }); break;
      }
      case 'restPeriod': {
        this.setState({ inputRestValue: e.target.value }); break;
      }
      case 'nbPerson': {
        this.setState({ inputNbPersonValue: e.target.value }); break;
      }
      default: {
        this.props.maestro.dataRefresh(`Qu'est-ce que c'est que ce champ ${e.target.id} ?!!!`, 'error');
      }
    }
  }

  editFieldByEnter(e) {
    if (e.key !== 'Enter') return;

    switch (e.target.id) {
      case 'prepPeriod': {
        this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeID, 'prepPeriod', this.prepPeriod.value);
        this.prepPeriod.blur(); break;
      }
      case 'cookPeriod': {
        this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeID, 'cookPeriod', this.cookPeriod.value);
        this.cookPeriod.blur(); break;
      }
      case 'restPeriod': {
        this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeID, 'restPeriod', this.restPeriod.value);
        this.restPeriod.blur(); break;
      }
      case 'nbPerson': {
        this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeID, 'nbPeople', this.nbPerson.value);
        this.nbPerson.blur(); break;
      }
      default: {
        this.props.maestro.dataRefresh(`Qu'est-ce que c'est que ce champ ${e.target.id}où vous voulez faire Enter ?!!!`, 'error');
      }
    }
  }

  deleteRecipe() {
    this.props.maestro.dataRefresh('deleteRecipe', this.props.recipeID);
  }

  render() {
    let currentRecipeImg;
    try {
      currentRecipeImg = require(`../../assets/img/plats/${this.props.recipeID}.jpg`);
    } catch (e) {
      console.log(e.code);
      currentRecipeImg = require('../../assets/img/plats/default.jpg');
    }
    const foodImgClass = this.props.edition ? 'foodImage edition' : 'foodImage';

    return (
      <div className={foodImgClass}>
        <img width="150" height="150" src={currentRecipeImg} alt={this.props.recipeTitle} />

        <div className="deleter-recipe" title="Delete" onClick={this.deleteRecipe}>
          <i className="material-icons">delete_forever</i>
          <div className="corner" />
        </div>

        <div className="times">
          <div className="preparation" title="Temps de préparation">
            <i className="material-icons">restore</i>
            <img alt="timer" src={require('../../assets/img/timer.png')} height="22" />
            <span>{this.props.preparationTime}</span>
            <input
              name="prepPeriod"
              className="dureeInput"
              id="prepPeriod"
              ref={input => this.prepPeriod = input}
              autoComplete="off"
              type="text"
              value={this.state.inputPrepValue}
              onChange={this.editField}
              onKeyPress={this.editFieldByEnter}
            />
          </div>

          <div className="cuisson" title="Temps de cuisson">
            <i className="material-icons">whatshot</i>
            <Fire />
            <span>{this.props.cuissonTime}</span>
            <input
              name="cookPeriod"
              className="dureeInput"
              id="cookPeriod"
              ref={input => this.cookPeriod = input}
              autoComplete="off"
              type="text"
              value={this.state.inputCookValue}
              onChange={this.editField}
              onKeyPress={this.editFieldByEnter}
            />
          </div>

          <div className="repos" title="Temps de repos">
            <i className="material-icons">brightness_3</i>
            <Moon />
            <span>{this.props.restPeriod}</span>
            <input
              name="restPeriod"
              className="dureeInput"
              id="restPeriod"
              ref={input => this.restPeriod = input}
              autoComplete="off"
              type="text"
              value={this.state.inputRestValue}
              onChange={this.editField}
              onKeyPress={this.editFieldByEnter}
            />
          </div>

          <div className="nbPersonne" title="Nombre de personnes / pièces">
            <i className="material-icons">restaurant</i>
            <span>{this.props.nbPerson}</span>
            <input
              name="nbPerson"
              className="dureeInput"
              id="nbPerson"
              ref={input => this.nbPerson = input}
              autoComplete="off"
              type="text"
              value={this.state.inputNbPersonValue}
              onChange={this.editField}
              onKeyPress={this.editFieldByEnter}
            />
            <i className="nbPersonUnit material-icons" onClick={this.changeUnit}>
              {this.state.inputNbPersonUnitValue === 'Pers.' ? 'person' : 'local_pizza'}
            </i>
          </div>
        </div>
      </div>);
  }
}

PhotoWithDuration.propTypes = {
  preparationTime: PropTypes.string,
  cuissonTime: PropTypes.string,
  restPeriod: PropTypes.string,
  nbPerson: PropTypes.string,
  nbPersonUnit: PropTypes.string,
  recipeID: PropTypes.number,
  edition: PropTypes.bool,
  recipeTitle: PropTypes.string,
  maestro: PropTypes.object
};

PhotoWithDuration.defaultProps = { // define the default props
  preparationTime: '0 min',
  cuissonTime: '0 min',
  restPeriod: '0 min',
  nbPerson: '1',
  nbPersonUnit: '',
  recipeID: 1,
  edition: false,
  recipeTitle: '',
  maestro: { dataRefresh: () => {} }
};

// Mixins aren’t supported in ES6 classes.

export default PhotoWithDuration;

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
    this.moreGuestsTonight = this.moreGuestsTonight.bind(this);
    this.lessGuestsTonight = this.lessGuestsTonight.bind(this);
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
        this.props.maestro.dataRefresh('addNotif', `Qu'est-ce que c'est que ce champ ${e.target.id} ?!!!`, 'error');
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
        this.props.maestro.dataRefresh('addNotif', `Qu'est-ce que c'est que ce champ ${e.target.id} où vous voulez faire Enter ?!!!`, 'error');
      }
    }
  }

  deleteRecipe() {
    this.props.maestro.dataRefresh('deleteRecipe', this.props.recipeID);
  }

  lessGuestsTonight() {
    this.props.maestro.dataRefresh('changeNbPeopleForMe', -1);
  }

  moreGuestsTonight() {
    this.props.maestro.dataRefresh('changeNbPeopleForMe', 1);
  }

  render() {
    let currentRecipeImg;
    try {
      currentRecipeImg = require(`../../assets/img/plats/${this.props.recipeID}.jpg`);
    } catch (e) {
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
            <div className="value">{this.props.preparationTime}</div>
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
            <div className="value">{this.props.cuissonTime}</div>
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
            <div className="value">{this.props.restPeriod}</div>
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

          <div className="nbPersonne">
            <i className="material-icons" title="Nombre de personnes / pièces">restaurant</i>
            <div className="value">{Number(this.props.nbPerson) + Number(this.props.delta)}</div>
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
            <span className="moreOrLess">
              <i className="material-icons" onClick={this.moreGuestsTonight} title="Ajouter un couvert !">add_box</i>
              <i className="material-icons" onClick={this.lessGuestsTonight} title="On est un de moins !">indeterminate_check_box</i>
            </span>
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
  maestro: PropTypes.object,
  delta: PropTypes.number
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
  maestro: { dataRefresh: () => {} },
  delta: 0
};

// Mixins aren’t supported in ES6 classes.

export default PhotoWithDuration;

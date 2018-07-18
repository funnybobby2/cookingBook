import React from 'react';
import PropTypes from 'prop-types';
// import styles
import './MeatSelector.scss';

class MeatSelector extends React.Component {
  constructor(props) {
    super(props);
    this.changeMeat = this.changeMeat.bind(this);
    this.compatibility = this.compatibility.bind(this);
  }

  compatibility(id) {
    let result = '';
    switch (id) {
      case '2': { // boeuf : compatibility with porc
        if ((this.props.meat !== 'porc') && (this.props.meat !== '')) result = 'disable'; break;
      }
      case '3': { // canard : not compatible
        if (this.props.meat !== '') result = 'disable'; break;
      }
      case '4': { // crustace
        if ((this.props.meat !== 'porc') && (this.props.meat !== 'poulet') && (this.props.meat !== '')) result = 'disable'; break;
      }
      case '5': { // mouton
        if ((this.props.meat !== 'poulet') && (this.props.meat !== '')) result = 'disable'; break;
      }
      case '6': { // poulet
        if ((this.props.meat !== 'porc') && (this.props.meat !== 'mouton') && (this.props.meat !== 'crustace') && (this.props.meat !== '')) result = 'disable'; break;
      }
      case '7': { // porc
        if ((this.props.meat !== 'poisson') && (this.props.meat !== 'poulet') && (this.props.meat !== 'crustace') && (this.props.meat !== 'boeuf') && (this.props.meat !== '')) result = 'disable'; break;
      }
      case '8': { // poisson
        if ((this.props.meat !== 'porc') && (this.props.meat !== '')) result = 'disable'; break;
      }
      case '9': { // vegetable : not compatible
        if (this.props.meat !== '') result = 'disable'; break;
      }
      default:
        this.props.maestro.dataRefresh('Désolé je ne connais pas ce type de viande !', 'error');
    }
    return result;
  }

  changeMeat(e) {
    let result = '';
    switch (e.target.id) {
      case '1': { // clear
        break;
      }
      case '2': { // boeuf : compatibility with porc
        result = `boeuf${this.props.meat}`; break;
      }
      case '3': { // canard : not compatible
        result = 'canard'; break;
      }
      case '4': { // crustace
        result = `${this.props.meat}crustace`; break;
      }
      case '5': { // mouton
        result = `mouton${this.props.meat}`; break;
      }
      case '6': { // poulet
        if (this.props.meat === 'mouton') result = 'moutonpoulet';
        else result = `poulet${this.props.meat}`; break;
      }
      case '7': { // porc
        if ((this.props.meat === 'boeuf') || (this.props.meat === 'poulet')) result = `${this.props.meat}porc`;
        else result = `porc${this.props.meat}`; break;
      }
      case '8': { // poisson
        result = `${this.props.meat}poisson`; break;
      }
      case '9': { // vegetable : not compatible
        result = 'vegetable'; break;
      }
      default:
        result = '';
    }
    this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeID, 'meatClass', result, true);
  }

  render() {
    const currentMeat = require(`../../assets/img/stamp${this.props.meat === '' ? '' : `-${this.props.meat}`}.svg`);

    const visibility = this.props.edition ? 'visibleImg' : '';

    return (
      <div className="meats">
        <img alt="meat" width="100px" height="100px" src={currentMeat} />
        <img alt="empty" id="1" width="40px" height="40px" src={require('../../assets/img/stamp.svg')} className={`firstMeat ${visibility}`} onClick={this.changeMeat} />
        <img alt="beef" id="2" width="40px" height="40px" src={require('../../assets/img/stamp-boeuf.svg')} className={`secondMeat ${visibility} ${this.compatibility('2')}`} onClick={this.changeMeat} />
        <img alt="duck" id="3" width="40px" height="40px" src={require('../../assets/img/stamp-canard.svg')} className={`thirdMeat ${visibility} ${this.compatibility('3')}`} onClick={this.changeMeat} />
        <img alt="shellfish" id="4" width="40px" height="40px" src={require('../../assets/img/stamp-crustace.svg')} className={`fourthMeat ${visibility} ${this.compatibility('4')}`} onClick={this.changeMeat} />
        <img alt="sheep" id="5" width="40px" height="40px" src={require('../../assets/img/stamp-mouton.svg')} className={`fifthMeat ${visibility} ${this.compatibility('5')}`} onClick={this.changeMeat} />
        <img alt="chicken" id="6" width="40px" height="40px" src={require('../../assets/img/stamp-poulet.svg')} className={`sixthMeat ${visibility} ${this.compatibility('6')}`} onClick={this.changeMeat} />
        <img alt="pork" id="7" width="40px" height="40px" src={require('../../assets/img/stamp-porc.svg')} className={`seventhMeat ${visibility} ${this.compatibility('7')}`} onClick={this.changeMeat} />
        <img alt="fish" id="8" width="40px" height="40px" src={require('../../assets/img/stamp-poisson.svg')} className={`eightMeat ${visibility} ${this.compatibility('8')}`} onClick={this.changeMeat} />
        <img alt="vegetable" id="9" width="40px" height="40px" src={require('../../assets/img/stamp-vegetable.svg')} className={`nineMeat ${visibility} ${this.compatibility('9')}`} onClick={this.changeMeat} />
      </div>);
  }
}

MeatSelector.propTypes = {
  meat: PropTypes.string,
  recipeID: PropTypes.number,
  edition: PropTypes.bool,
  maestro: PropTypes.object
};

MeatSelector.defaultProps = { // define the default props
  meat: 'vegetable',
  recipeID: 1,
  edition: false,
  maestro: { dataRefresh: () => {} }
};

export default MeatSelector;

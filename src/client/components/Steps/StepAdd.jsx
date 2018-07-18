import React from 'react';
import PropTypes from 'prop-types';

class StepAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.editByEnter = this.editByEnter.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
  }

  editByEnter(e) {
    if (e.key !== 'Enter') return;

    const newStep = {
      text: this.stepAdd.value,
      index: (Number(this.props.nextIndex) + 1)
    };

    this.props.maestro.dataRefresh('addArrayField', this.props.recipeID, 'steps', newStep, true);
    this.setState({ open: !this.state.open });
    this.stepAdd.value = '';
  }

  toggleAdd() {
    this.setState({ open: !this.state.open });
    setTimeout(() => {
      this.stepAdd.focus();
      this.stepAdd.select();
    }, 50);
  }

  render() {
    const editionClass = this.props.edition ?
      (this.state.open ? 'stepAdd edition show' : 'stepAdd edition') :
      (this.state.open ? 'stepAdd show' : 'stepAdd');

    return (
      <div className={editionClass}>
        <input
          className="stepInput"
          name="step"
          type="text"
          data-not-empty
          placeholder="Tapez ici votre étape"
          ref={input => this.stepAdd = input}
          onKeyPress={this.editByEnter}
        />
        <i className="material-icons" onClick={this.toggleAdd}>add_box</i>
      </div>);
  }
}

StepAdd.propTypes = {
  nextIndex: PropTypes.number,
  edition: PropTypes.bool,
  recipeID: PropTypes.number,
  maestro: PropTypes.object
};

StepAdd.defaultProps = { // define the default props
  nextIndex: 1,
  edition: false,
  recipeID: 1,
  maestro: { dataRefresh: () => {} }
};

export default StepAdd;

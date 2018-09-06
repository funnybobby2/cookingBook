import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './Step.scss';

class Step extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      inputStepValue: this.props.text
    };
    this.deleteStep = this.deleteStep.bind(this);
    this.edit = this.edit.bind(this);
    this.editByEnter = this.editByEnter.bind(this);
    this.blurField = this.blurField.bind(this);
    this.toggleCheck = this.toggleCheck.bind(this);
  }

  componentWillReceiveProps(newProps) { // props/ctx changent => synchro avec state
    this.setState({ inputStepValue: newProps.text });
  }

  deleteStep() {
    this.props.maestro.dataRefresh('deleteArrayField', this.props.recipeID, 'steps', this.props.index - 1, 'index', this.props.index);
  }

  edit(e) {
    this.setState({ inputStepValue: e.target.value });
  }

  editByEnter(e) {
    if (e.key !== 'Enter') return;
    if ((e.target.value.trim() === '') && (e.target.dataset.notEmpty !== undefined)) {
      this.props.maestro.dataRefresh('addNotif', 'Il faut rentrer un texte pour créer une étape, c\'est la base !', 'error');
      return;
    }

    this.props.maestro.dataRefresh('updateArrayField', this.props.recipeID, 'steps', this.props.index - 1, 'text', e.target.value);
    e.target.blur();
  }

  blurField(e) {
    if ((e.target.value.trim() === '') && (e.target.dataset.notEmpty !== undefined)) {
      this.props.maestro.dataRefresh('addNotif', 'Il faut rentrer un texte pour créer une étape, c\'est la base !', 'error');
      return;
    }

    this.props.maestro.dataRefresh('updateArrayField', this.props.recipeID, 'steps', this.props.index - 1, 'text', e.target.value);
  }

  toggleCheck() {
    this.setState({
      checked: !this.state.checked
    });
  }

  render() {
    const checkClass = this.state.checked ? 'indexStep checked' : 'indexStep';
    const editionClass = this.props.edition ? 'prepaStep edition' : 'prepaStep';
    const stepAfterSearch = (this.props.query.length > 2) ? this.props.text.replace(new RegExp(`(${this.props.query})`, 'gi'), '<mark>$1</mark>') : this.props.text;

    return (
      <div className={editionClass}>
        <div className={checkClass} onClick={this.toggleCheck}>
          {this.props.index}
        </div>
        <span className="elementText" dangerouslySetInnerHTML={{ __html: stepAfterSearch }} />
        <input
          className="stepInput"
          name="step"
          type="text"
          value={this.state.inputStepValue}
          onChange={this.edit}
          onKeyPress={this.editByEnter}
          onBlur={this.blurField}
          autoComplete="off"
        />
        <i className="deleteStep material-icons" onClick={this.deleteStep}>delete_forever</i>
      </div>);
  }
}

Step.propTypes = {
  index: PropTypes.number,
  text: PropTypes.string,
  edition: PropTypes.bool,
  recipeID: PropTypes.number,
  query: PropTypes.string,
  maestro: PropTypes.object
};

Step.defaultProps = { // define the default props
  index: 1,
  text: '',
  edition: false,
  recipeID: 1,
  query: '',
  maestro: { dataRefresh: () => {} }
};

export default Step;

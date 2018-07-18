import React from 'react';
import PropTypes from 'prop-types';

class Tag extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputTagValue: this.props.text
    };

    this.deleteTag = this.deleteTag.bind(this);
  }

  componentWillReceiveProps(newProps) { // props/ctx changent => synchro avec state
    this.setState({ inputTagValue: newProps.text });
  }

  edit(e) {
    this.setState({ inputTagValue: e.target.value });
  }

  editByEnter(e) {
    if ((e === undefined) || (e.key !== 'Enter')) return;
    if ((e.target.value.trim() === '') && (e.target.dataset.notEmpty !== undefined)) {
      this.props.maestro.dataRefresh('addNotif', 'Il faut rentrer un texte pour créer un tag, c\'est la base !', 'error');
      return;
    }

    this.props.maestro.dataRefresh('updateArrayField', this.props.recipeID, 'tags', this.props.index, undefined, e.target.value);
    e.target.blur();
  }

  deleteTag() {
    this.props.maestro.dataRefresh('deleteArrayField', this.props.recipeID, 'tags', this.props.index, undefined, this.props.text);
  }

  render() {
    const editionClass = this.props.edition ? 'tag edition' : 'tag';

    return (
      <div className={editionClass}>
        <span>{this.props.text}</span>
        <input
          className="tagInput"
          name="tag"
          type="text"
          data-not-empty
          value={this.state.inputTagValue}
          onChange={this.edit.bind(this)}
          onKeyPress={this.editByEnter.bind(this)}
        />
        <i className="deleteTag material-icons" onClick={this.deleteTag}>delete_forever</i>
      </div>);
  }
}

Tag.propTypes = {
  index: PropTypes.number,
  edition: PropTypes.bool,
  recipeID: PropTypes.number,
  maestro: PropTypes.object,
  text: PropTypes.string
};

Tag.defaultProps = { // define the default props
  index: 0,
  edition: false,
  recipeID: 1,
  maestro: { dataRefresh: () => {} },
  text: ''
};

export default Tag;

import React from 'react';
import PropTypes from 'prop-types';

class TagAdd extends React.Component {
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

    this.props.maestro.dataRefresh('addArrayField', this.props.recipeID, 'tags', e.target.value);
    this.setState({ open: !this.state.open });
    this.tagAdd.value = '';
  }

  toggleAdd() {
    this.setState({ open: !this.state.open });
    setTimeout(() => {
      this.tagAdd.focus();
      this.tagAdd.select();
    }, 50);
  }

  render() {
    const editionClass = this.props.edition ? 'tagAdd edition' : 'tagAdd';
    const showInput = this.state.open ? 'tagInput show' : 'tagInput';

    return (
      <div className={editionClass}>
        <input
          className={showInput}
          name="tag"
          type="text"
          ref={input => this.tagAdd = input}
          onKeyPress={this.editByEnter}
        />
        <i className="material-icons" onClick={this.toggleAdd}>add_box</i>
      </div>);
  }
}

TagAdd.propTypes = {
  edition: PropTypes.bool,
  recipeID: PropTypes.number,
  maestro: PropTypes.object
};

TagAdd.defaultProps = { // define the default props
  edition: false,
  recipeID: 1,
  maestro: { dataRefresh: () => {} }
};

export default TagAdd;

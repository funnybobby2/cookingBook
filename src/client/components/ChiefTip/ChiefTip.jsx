import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './ChiefTip.scss';

class ChiefTip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputTipValue: this.props.tip
    };
    this.edit = this.edit.bind(this);
    this.editByEnter = this.editByEnter.bind(this);
  }

  edit(e) {
    this.setState({ inputTipValue: e.target.value });
  }

  editByEnter(e) {
    if (e.key !== 'Enter') return;

    this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeID, 'chiefTrick', e.target.value);
    e.target.blur();
  }

  render() {
    const editClass = this.props.edition ? 'chiefTipContent isEdited' : 'chiefTipContent';
    const tipAfterSearch = (this.props.query.length > 2) ? this.props.tip.replace(new RegExp(`(${this.props.query})`, 'gi'), '<mark>$1</mark>') : this.props.tip;

    return (
      <div className="chiefTip">
        <div className="chiefTipTitle">L{'\''}astuce du chef</div>
        <div className={editClass}>
          <span dangerouslySetInnerHTML={{ __html: tipAfterSearch }} />
          <input
            name="tip"
            id="tip"
            ref={input => this.tip = input}
            autoComplete="off"
            type="text"
            value={this.state.inputTipValue}
            onChange={this.edit}
            onKeyPress={this.editByEnter}
          />
        </div>
      </div>);
  }
}

ChiefTip.propTypes = {
  tip: PropTypes.string,
  edition: PropTypes.bool,
  recipeID: PropTypes.number,
  query: PropTypes.string,
  maestro: PropTypes.object
};

ChiefTip.defaultProps = { // define the default props
  tip: 'L\'astuce du chef',
  edition: false,
  recipeID: 1,
  query: '',
  maestro: { dataRefresh: () => {} }
};

export default ChiefTip;

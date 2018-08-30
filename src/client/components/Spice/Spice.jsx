import React from 'react';
import PropTypes from 'prop-types';
// import styles
import './Spice.scss';

class Spice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      spice: this.props.spicy
    };

    this.changeSpices = this.changeSpices.bind(this);
  }

  componentWillReceiveProps(newProps) { // props/ctx changent => synchro avec state
    this.setState({ spice: newProps.spicy });
  }

  changeSpices(val) {
    let newValue = this.state.spice + val;
    if (newValue < 0) newValue = 0;
    if (newValue > 3) newValue = 3;
    this.setState({ spice: newValue });
    this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeID, 'spicy', newValue);
  }

  render() {
    const spiceClass = this.props.edition ? `spices edition level${this.props.spicy}` : `spices level${this.props.spicy}`;
    return (
      <div className={spiceClass}>
        <div className="minus" onClick={() => { this.changeSpices(-1); }} ><i className="material-icons">indeterminate_check_box</i></div>
        <div className="spiceIcon" />
        <div className="plus" onClick={() => { this.changeSpices(1); }}><i className="material-icons">add_box</i></div>
      </div>);
  }
}

Spice.propTypes = {
  recipeID: PropTypes.number,
  maestro: PropTypes.object,
  spicy: PropTypes.number,
  edition: PropTypes.bool
};

Spice.defaultProps = { // define the default props
  recipeID: 1,
  maestro: { dataRefresh: () => {} },
  spicy: 0,
  edition: false
};

export default Spice;

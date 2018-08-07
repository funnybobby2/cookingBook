import React from 'react';
import PropTypes from 'prop-types';
// import styles
import './Spice.scss';

class Spice extends React.Component {
  constructor(props) {
    super(props);
    this.changeSpices = this.changeSpices.bind(this);
  }

  changeSpices(val) {
    if (this.props.user.role === 'admin') return;
    this.props.maestro.dataRefresh('updateSpice', this.props.recipeID, val);
  }

  render() {
    const spiceClass = `spices level${this.props.spicy}`;
    return (
      <div className={spiceClass}>
        <div className="spiceIcon" />
      </div>);
  }
}

Spice.propTypes = {
  recipeID: PropTypes.number,
  user: PropTypes.shape({
    _id: PropTypes.string,
    login: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user']),
    email: PropTypes.string,
    votedFor: PropTypes.arrayOf(PropTypes.number)
  }),
  maestro: PropTypes.object,
  spicy: PropTypes.number
};

Spice.defaultProps = { // define the default props
  recipeID: 1,
  user: {
    _id: '', login: '', password: '', role: 'user', email: '', votedFor: []
  },
  maestro: { dataRefresh: () => {} },
  spicy: 0
};

export default Spice;

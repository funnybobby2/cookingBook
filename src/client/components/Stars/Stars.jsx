import React from 'react';
import PropTypes from 'prop-types';
// import styles
import './Stars.scss';

class Stars extends React.Component {
  constructor(props) {
    super(props);
    this.addMark = this.addMark.bind(this);
  }

  addMark(e) {
    if (e.key === 'Enter') this.props.maestro.dataRefresh('updateMark', this.props.recipeID, this.mark.value, this.props.user._id);
  }

  render() {
    const nbStars = (this.props.nbMark > 0) ? Math.round(this.props.mark / this.props.nbMark) : 0;

    return (
      <div className="stars">
        {(nbStars >= 1) ? <img alt="star" width="16px" height="16px" src={require('../../assets/img/star.svg')} /> : <img alt="star_off" width="16px" height="16px" src={require('../../assets/img/star_off.svg')} />}
        {(nbStars >= 2) ? <img alt="star" width="16px" height="16px" src={require('../../assets/img/star.svg')} /> : <img alt="star_off" width="16px" height="16px" src={require('../../assets/img/star_off.svg')} />}
        {(nbStars >= 3) ? <img alt="star" width="16px" height="16px" src={require('../../assets/img/star.svg')} /> : <img alt="star_off" width="16px" height="16px" src={require('../../assets/img/star_off.svg')} />}
        {(nbStars >= 4) ? <img alt="star" width="16px" height="16px" src={require('../../assets/img/star.svg')} /> : <img alt="star_off" width="16px" height="16px" src={require('../../assets/img/star_off.svg')} />}
        {(nbStars === 5) ? <img alt="star" width="16px" height="16px" src={require('../../assets/img/star.svg')} /> : <img alt="star_off" width="16px" height="16px" src={require('../../assets/img/star_off.svg')} />}
        <span className="average"> ({this.props.nbMark} votes)</span>
        {((this.props.user._id === '') || (this.props.user.votedFor.includes(this.props.recipeID))) ? '' : <span className="vote"> Je note ! <input type="number" min="0" max="5" ref={input => this.mark = input} onKeyPress={this.addMark} /></span>}
      </div>);
  }
}

Stars.propTypes = {
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
  mark: PropTypes.number,
  nbMark: PropTypes.number
};

Stars.defaultProps = { // define the default props
  recipeID: 1,
  user: {
    _id: '', login: '', password: '', role: 'user', email: '', votedFor: []
  },
  maestro: { dataRefresh: () => {} },
  mark: 0,
  nbMark: 0
};

export default Stars;

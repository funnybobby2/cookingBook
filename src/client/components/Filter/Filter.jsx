import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './Filter.scss';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.toggleFilter = this.toggleFilter.bind(this);
  }

  toggleFilter() {
    this.props.maestro.dataRefresh('toggleFilter', this.props.classe);
  }

  render() {
    return (
      <div
        className={(this.props.filters[this.props.classe]) ? `${this.props.classe} green ${this.props.over ? 'overable' : ''}` : `${this.props.classe} ${this.props.over ? 'overable' : ''}`}
        title={this.props.title}
        onClick={this.toggleFilter}
      >
        <i className="material-icons">{this.props.type}</i>
      </div>);
  }
}

Filter.propTypes = {
  classe: PropTypes.string,
  type: PropTypes.string,
  filters: PropTypes.object,
  title: PropTypes.string,
  over: PropTypes.bool,
  maestro: PropTypes.object
};

Filter.defaultProps = { // define the default props
  classe: '',
  type: '',
  title: '',
  over: false,
  filters: {
    validate: false,
    new: false,
    dislike: false
  },
  maestro: { dataRefresh: () => {} }
};

export default Filter;

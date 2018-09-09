import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './Filter.scss';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMin: (this.props.classe === 'hot') ? this.props.filters.spiceMin : this.props.filters.rateMin,
      inputMax: (this.props.classe === 'hot') ? this.props.filters.spiceMax : this.props.filters.rateMax
    };
    this.changeMax = this.changeMax.bind(this);
    this.changeMin = this.changeMin.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.validFilter = this.validFilter.bind(this);
  }

  componentWillReceiveProps(newProps) { // props/ctx changent => synchro avec state
    this.state = {
      inputMin: (newProps.classe === 'hot') ? newProps.filters.spiceMin : newProps.filters.rateMin,
      inputMax: (newProps.classe === 'hot') ? newProps.filters.spiceMax : newProps.filters.rateMax
    };
  }

  changeMax(e) {
    this.setState({ inputMax: e.target.value });
  }

  changeMin(e) {
    this.setState({ inputMin: e.target.value });
  }

  toggleFilter() {
    this.props.maestro.dataRefresh('toggleFilter', this.props.classe);
  }

  validFilter() {
    if (Number(this.min.value) > Number(this.max.value)) {
      this.props.maestro.dataRefresh('addNotif', 'Le min supérieur au max là... C\'est normal ?!! Tu fiches ma gueule !', 'error');
    } else this.props.maestro.dataRefresh('toggleFilterMinMax', Number(this.min.value), Number(this.max.value), this.props.classe);
  }

  render() {
    const overpart = this.props.over ? (
      <div className="overPart">
        <div className="line">
          <span>Min : </span>
          <input type="number" placeholder="0" min="0" max={this.props.max} value={this.state.inputMin} onChange={this.changeMin} ref={input => this.min = input} />
        </div>
        <div className="line">
          <span>Max : </span>
          <input type="number" placeholder={this.props.max} min="0" max={this.props.max} value={this.state.inputMax} onChange={this.changeMax} ref={input => this.max = input} />
        </div>
        <button onClick={this.validFilter}> Valider </button>
      </div>
    ) : '';

    return (
      <div className={(this.props.filters[this.props.classe]) ? `${this.props.classe} green ${this.props.over ? 'overable' : ''}` : `${this.props.classe} ${this.props.over ? 'overable' : ''}`}>
        <i className="material-icons" onClick={this.toggleFilter} title={this.props.title}>{this.props.type}</i>
        {overpart}
      </div>);
  }
}

Filter.propTypes = {
  classe: PropTypes.string,
  type: PropTypes.string,
  filters: PropTypes.object,
  title: PropTypes.string,
  over: PropTypes.bool,
  max: PropTypes.number,
  maestro: PropTypes.object
};

Filter.defaultProps = { // define the default props
  classe: '',
  type: '',
  title: '',
  over: false,
  max: 3,
  filters: {
    validate: false,
    new: false,
    dislike: false
  },
  maestro: { dataRefresh: () => {} }
};

export default Filter;

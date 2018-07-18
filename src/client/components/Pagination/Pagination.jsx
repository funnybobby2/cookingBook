import React from 'react';
import PropTypes from 'prop-types';
// Import react components

// Import style
import './Pagination.scss';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      stateClass: 'hideInput'
    };

    this.goTo = this.goTo.bind(this);
    this.goToFirst = this.goToFirst.bind(this);
    this.goToLast = this.goToLast.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.toggleGoto = this.toggleGoto.bind(this);
  }

  goTo(e) {
    if (e.key === 'Enter') {
      this.props.maestro.dataRefresh('goTo', this.page.value);
      this.toggleGoto();
    }
  }

  goToFirst() { this.props.maestro.dataRefresh('goTo', 'first'); }
  goToLast() { this.props.maestro.dataRefresh('goTo', 'last'); }
  next() { this.props.maestro.dataRefresh('goTo', 'next'); }
  previous() { this.props.maestro.dataRefresh('goTo', 'previous'); }

  toggleGoto() {
    this.setState({
      open: !this.state.open,
      stateClass: (this.page.className === 'hideInput') ? 'showInput' : 'hideInput'
    });
    setTimeout(() => {
      this.page.focus();
      this.page.select();
    }, 50);
  }

  render() { // exemple de render en ternaire
    const curPage = this.props.currentPage;
    const nbPages = this.props.nbTotalPages;

    return (
      <div id="pagination" className={this.state.stateClass}>
        <div id="firstPage" onClick={this.goToFirst}>
          <i className="material-icons">first_page</i>
        </div>
        <div id="previous" onClick={this.previous}>
          <i className="material-icons">chevron_left</i>
        </div>
        <div className="pagination">
          <div className="currentPage" onClick={this.toggleGoto}> {curPage} </div>
          <input
            type="number"
            min="1"
            name="page"
            id="page"
            autoComplete="off"
            ref={input => this.page = input}
            className={this.state.stateClass}
            onKeyPress={this.goTo}
          />

          <div className="slash">
            <i className="material-icons">remove</i>
          </div>
          <div className="totalPages ng-binding"> {nbPages} </div>
        </div>
        <div id="next" onClick={this.next}>
          <i className="material-icons">chevron_right</i>
        </div>
        <div id="lastPage" onClick={this.goToLast}>
          <i className="material-icons">last_page</i>
        </div>
      </div>);
  }
}

Pagination.propTypes = {
  currentPage: PropTypes.number,
  nbTotalPages: PropTypes.number,
  maestro: PropTypes.object
};

Pagination.defaultProps = { // define the default props
  currentPage: 1,
  nbTotalPages: 1,
  maestro: { dataRefresh: () => {} }
};

export default Pagination;

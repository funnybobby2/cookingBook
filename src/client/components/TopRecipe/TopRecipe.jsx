import React from 'react';
import PropTypes from 'prop-types';
// import styles
import './TopRecipe.scss';

class TopRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: this.props.recipeTitle
    };
    this.editTitle = this.editTitle.bind(this);
    this.editTitleByEnter = this.editTitleByEnter.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  editTitle(e) {
    this.setState({ inputValue: e.target.value });
  }

  editTitleByEnter(e) {
    if (e.key === 'Enter') {
      this.props.maestro.dataRefresh('updateSimpleField', this.props.recipeID, 'title', this.title.value);
      this.title.blur();
    }
  }

  toggleEditMode() {
    this.props.maestro.dataRefresh('toggleEdit');
  }

  render() {
    const { validatedBy, user, edition } = this.props;
    let isValid = false;
    for (let i = 0, len = validatedBy.length; i < len; i += 1) {
      if (validatedBy[i].login === user.login) {
        isValid = true;
        break;
      }
    }

    const validationItem = isValid
      ? (<div className="ribbon" > <span>Validée !</span> </div>)
      : (<div className="notValidated" />);

    const image = (user.role === 'admin')
      ? (edition
        ? (
          <div className="recipeEditor isEdited">
            <img
              src={require('../../assets/img/pencil-tool.png')}
              alt="edition"
              className="editButton"
              onClick={this.toggleEditMode}
            />
          </div>)
        : (
          <div className="recipeEditor">
            <img
              src={require('../../assets/img/pencil-tool.png')}
              alt="edition"
              className="editButton"
              onClick={this.toggleEditMode}
            />
          </div>))
      : <span />;

    const titleAfterSearch = (this.props.query.length > 2) ? this.props.recipeTitle.replace(new RegExp(`(${this.props.query})`, 'gi'), '<mark>$1</mark>') : this.props.recipeTitle;

    const titleRecipe = (edition
      ? (<input
        onKeyPress={this.editTitleByEnter}
        onChange={this.editTitle}
        autoComplete="off"
        className="titleInput"
        name="title"
        id="title"
        ref={input => this.title = input}
        type="text"
        value={this.state.inputValue}
      />)
      : (<div className="recipeTitle" dangerouslySetInnerHTML={{ __html: titleAfterSearch }} />));

    return (
      <div className="topRecipe">
        <span />
        {titleRecipe}
        {image}
        {validationItem}
      </div>);
  }
}

TopRecipe.propTypes = {
  recipeTitle: PropTypes.string,
  edition: PropTypes.bool,
  recipeID: PropTypes.number,
  validatedBy: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.shape({
    _id: PropTypes.string,
    login: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user']),
    email: PropTypes.string
  }),
  query: PropTypes.string,
  maestro: PropTypes.object
};

TopRecipe.defaultProps = { // define the default props
  recipeTitle: 'Titre de ma recette',
  edition: false,
  recipeID: 1,
  validatedBy: [],
  user: {
    _id: '', login: '', password: '', role: 'user', email: ''
  },
  query: '',
  maestro: { dataRefresh: () => {} }
};

export default TopRecipe;

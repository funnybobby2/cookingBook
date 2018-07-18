import React from 'react';
import PropTypes from 'prop-types';
// import style
import './Comment.scss';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  edit() {
    console.log('edit', this);
  }

  delete() {
    this.props.maestro.dataRefresh('deleteComment', this.props.recipeID, this.props.date);
  }

  render() {
    const date = new Date(this.props.date).toLocaleString();
    const itsMyComment = (this.props.user === undefined) ? 'material-icons hidden' : ((this.props.user.login === this.props.commentUser) ? 'material-icons' : 'material-icons hidden');
    return (
      <div className="commentsContainer">
        <div className="author">
          <span>{date}, par {this.props.commentUser}</span>
          <i className={itsMyComment} title="Edition" onClick={this.edit}>create</i>
          <i className={itsMyComment} title="Effacer" onClick={this.delete}>delete_forever</i>
        </div>
        <div className="comment">{this.props.text}</div>
      </div>);
  }
}

Comment.propTypes = {
  date: PropTypes.string,
  user: PropTypes.shape({
    _id: PropTypes.string,
    login: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user']),
    email: PropTypes.string
  }),
  commentUser: PropTypes.string,
  text: PropTypes.string,
  recipeID: PropTypes.number,
  maestro: PropTypes.object
};

Comment.defaultProps = { // define the default props
  date: new Date().toLocaleString(),
  user: {
    _id: '', login: '', password: '', role: 'user', email: ''
  },
  commentUser: '',
  text: '',
  recipeID: 1,
  maestro: { dataRefresh: () => {} }
};

export default Comment;

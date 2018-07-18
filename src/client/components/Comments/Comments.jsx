import React from 'react';
import PropTypes from 'prop-types';
// import react component
import Comment from './Comment';
// Import style
import './Comments.scss';

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.addComment = this.addComment.bind(this);
  }

  addComment() {
    if (this.props.user === undefined) return;
    this.props.maestro.dataRefresh('addComment', this.props.recipeID, this.commentForm.value, this.props.user._id);
    this.commentForm.value = '';
  }

  render() {
    const commentForm = (this.props.user === undefined) ?
      '' :
      (
        <div className="commentForm">
          <textarea name="comment-to-send" id="comment-to-send" ref={textarea => this.commentForm = textarea} placeholder="Tapez votre commentaire" rows="3" />
          <button onClick={this.addComment}>
            <i className="material-icons">add_comment</i>
          </button>
        </div>);

    return (
      <div className="comments">
        <div className="commentsTitle">Commentaires</div>
        <div className="commentList">
          {this.props.comments.map(com => <Comment text={com.text} date={com.postedAt} recipeID={this.props.recipeID} maestro={this.props.maestro} commentUser={com.author.login} user={this.props.user} key={new Date(com.postedAt).toLocaleString()} />)}
        </div>
        {commentForm}
      </div>);
  }
}

Comments.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    login: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user']),
    email: PropTypes.string
  }),
  recipeID: PropTypes.number,
  comments: PropTypes.arrayOf(PropTypes.object),
  maestro: PropTypes.object
};

Comments.defaultProps = { // define the default props
  user: undefined,
  recipeID: 1,
  comments: [],
  maestro: { dataRefresh: () => {} }
};

export default Comments;

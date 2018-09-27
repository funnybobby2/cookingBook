import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import PropTypes from 'prop-types';
// import react component
import Comment from './Comment';
// Import style
import './Comments.scss';

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emojiOpen: false
    };

    this.addComment = this.addComment.bind(this);
    this.addEmoji = this.addEmoji.bind(this);
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
  }

  addComment() {
    if (this.props.user === undefined) return;
    this.props.maestro.dataRefresh('addComment', this.props.recipeID, this.commentForm.value, this.props.user._id);
    this.commentForm.value = '';
  }

  addEmoji(emojiCode, emojiObject) {
    this.commentForm.value = `${this.commentForm.value} :${emojiObject.name}:`;
  }

  toggleEmojiPicker() {
    this.setState({
      emojiOpen: !this.state.emojiOpen
    });
  }

  render() {
    const emojiClass = this.state.emojiOpen ? 'emojiPart' : 'emojiPart close';
    const commentForm = (this.props.user === undefined) ?
      '' :
      (
        <div className="commentForm">
          <div className="textPart">
            <textarea name="comment-to-send" id="comment-to-send" ref={textarea => this.commentForm = textarea} placeholder="Tapez votre commentaire" rows="3" />
            <button onClick={this.addComment}>
              <i className="material-icons">add_comment</i>
            </button>
          </div>
          <div className={emojiClass}>
            <img alt="emoji" width="32px" height="32px" src={require('../../assets/img/happy.png')} onClick={this.toggleEmojiPicker} />
            <EmojiPicker onEmojiClick={this.addEmoji} />
          </div>
        </div>);

    return (
      <div className="comments">
        <div className="commentsTitle">Commentaires</div>
        <div className="commentList">
          {this.props.comments.map((com, index) => <Comment text={com.text} date={com.postedAt} index={index} recipeID={this.props.recipeID} maestro={this.props.maestro} commentUser={com.author.login} user={this.props.user} key={new Date(com.postedAt).toLocaleString()} />)}
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
    email: PropTypes.string,
    votedFor: PropTypes.arrayOf(PropTypes.number)
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

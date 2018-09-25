import React from 'react';
import PropTypes from 'prop-types';
import EmojiConvertor from 'emoji-js';
// import style
import './Comment.scss';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.emoji = new EmojiConvertor();
  }

  componentWillMount() {
    // set the style to emojione (default - apple)
    this.emoji.img_set = 'emojione';
    // set the storage location for all emojis
    this.emoji.img_sets.emojione.path = 'https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/';

    // some more settings...
    this.emoji.supports_css = false;
    this.emoji.allow_native = false;
    this.emoji.replace_mode = 'unified';
  }

  edit() {
    this.props.maestro.dataRefresh('addNotif', 'TODO : Edition des commentaires à faire', 'warning');
  }

  transform(text) {
    return this.emoji.replace_colons(text)
      .replace(/-fe0f|-200d-2642|-200d-2640/g, '')
      .replace('1f469-200d-2764-200d-1f468.png', '1f491.png')
      .replace('1f469-200d-2764-200d-1f48b-200d-1f468.png', '1f48f.png')
      .replace('1f468-200d-1f469-200d-1f466.png', '1f46a.png');
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
        <div className="comment" dangerouslySetInnerHTML={{ __html: this.transform(this.props.text) }} />
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
    email: PropTypes.string,
    votedFor: PropTypes.arrayOf(PropTypes.number)
  }),
  commentUser: PropTypes.string,
  text: PropTypes.string,
  recipeID: PropTypes.number,
  maestro: PropTypes.object
};

Comment.defaultProps = { // define the default props
  date: new Date().toLocaleString(),
  user: {
    _id: '', login: '', password: '', role: 'user', email: '', votedFor: []
  },
  commentUser: '',
  text: '',
  recipeID: 1,
  maestro: { dataRefresh: () => {} }
};

export default Comment;

import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './UserForm.scss';

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { logo: (this.props.user === undefined) ? 'egg' : this.props.user.logo };

    this.focusPassword = this.focusPassword.bind(this);
    this.focusEmail = this.focusEmail.bind(this);
    this.valideUser = this.valideUser.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.changeAvatar = this.changeAvatar.bind(this);
  }

  componentWillReceiveProps(newProps) { // props/ctx changent => synchro avec state
    if (newProps.user !== undefined) {
      this.userLogin.value = newProps.user.login;
      this.userPassword.value = newProps.user.password;
      this.userMail.value = newProps.user.email;
      this.setState({ logo: newProps.user.logo });
    }
  }

  valideUser() {
    // check if the login / password / email is not empty
    if ((this.userLogin.value === '') || (this.userPassword.value === '') || (this.userMail.value === '')) {
      this.props.maestro.dataRefresh('addNotif', 'Vous devez remplir les champs Login, password et Email', 'error');
      return;
    }
    // check if the login always exist
    if (this.props.usersLogin.includes(this.userLogin.value) && ((this.props.user === undefined) || (this.props.user.login !== this.userLogin.value))) {
      this.props.maestro.dataRefresh('addNotif', 'Nous avons déjà un compte avec ce login veuillez choisir un autre login', 'error');
      return;
    }

    // check the email format
    const regMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regMail.test(this.userMail.value)) {
      this.props.maestro.dataRefresh('addNotif', 'Votre email est suspect, essayez un vrai pour voir !', 'error');
      return;
    }

    // If you are here, congratulations, you are worthy to create your account with us
    if (this.props.user === undefined) this.props.maestro.dataRefresh('createUser', this.userLogin.value, this.userPassword.value, this.userMail.value, this.state.logo);
    else {
      this.props.maestro.dataRefresh(
        'updateUser',
        this.props.user._id,
        this.userLogin.value,
        this.userPassword.value,
        this.userMail.value,
        this.state.logo
      );
    }
  }

  closeForm() {
    this.props.maestro.dataRefresh('closeUserCreation');
  }

  focusEmail(e) {
    if (e.key !== 'Enter') return;
    this.userMail.focus();
    this.userMail.select();
  }

  focusPassword(e) {
    if (e.key !== 'Enter') return;
    this.userPassword.focus();
    this.userPassword.select();
  }

  changeAvatar(avatar) {
    this.setState({ logo: avatar.slice(5, -4) });
  }

  render() {
    const containerClass = this.props.open ? 'formContainer show' : 'formContainer';
    const titleForm = (this.props.user === undefined) ? 'Création de votre compte' : 'Mise à jour de votre compte';

    return (
      <div className={containerClass}>
        <div className="userForm">
          <div className="formTitle">{titleForm}</div>
          <div className="inputs">
            <input
              type="text"
              name="login"
              className="userInput"
              placeholder="Login"
              ref={input => this.userLogin = input}
              onKeyPress={this.focusPassword}
            />
            <input
              type="text"
              name="password"
              className="userInput"
              placeholder="Password"
              ref={input => this.userPassword = input}
              onKeyPress={this.focusEmail}
            />
            <input
              type="text"
              name="email"
              className="userInput"
              placeholder="e-mail"
              ref={input => this.userMail = input}
            />
            <div className="avatars">
              <div className="title">Avatars</div>
              {this.props.avatars.map(avatar => <img alt="avatar" key={avatar} width="40px" height="40px" src={require(`../../../assets/img/user/${avatar}`)} className={(avatar.slice(5, -4) === this.state.logo) ? 'selected' : ''} onClick={() => { this.changeAvatar(avatar); }} />)}
            </div>

          </div>
          <div className="buttons">
            <button className="validUser" onClick={this.valideUser}>Valider</button>
            <button className="closeUser" onClick={this.closeForm}>Annuler</button>
          </div>
        </div>
      </div>);
  }
}

UserForm.propTypes = {
  open: PropTypes.bool,
  usersLogin: PropTypes.arrayOf(PropTypes.string),
  maestro: PropTypes.object,
  user: PropTypes.object,
  avatars: PropTypes.arrayOf(PropTypes.string)
};

UserForm.defaultProps = { // define the default props
  open: false,
  usersLogin: [],
  maestro: { dataRefresh: () => {} },
  user: undefined,
  avatars: []
};
export default UserForm;

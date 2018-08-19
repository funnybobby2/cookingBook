import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './UserForm.scss';


class UserForm extends React.Component {
  constructor(props) {
    super(props);

    this.focusPassword = this.focusPassword.bind(this);
    this.focusEmail = this.focusEmail.bind(this);
    this.valideUser = this.valideUser.bind(this);
    this.closeForm = this.closeForm.bind(this);
  }

  valideUser() {
    // check if the login / password / email is not empty
    if ((this.userLogin.value === '') || (this.userPassword.value === '') || (this.userMail.value === '')) {
      this.props.maestro.dataRefresh('addNotif', 'Vous devez remplir les champs Login, password et Email', 'error');
      return;
    }
    // check if the login always exist
    if (this.props.usersLogin.includes(this.userLogin.value)) {
      this.props.maestro.dataRefresh('addNotif', 'Nous avons déjà un compte avec ce login veuillez choisir un autre login', 'error');
      return;
    }

    // check the email format
    const regMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regMail.test(this.userMail.value)) {
      this.props.maestro.dataRefresh('addNotif', 'Votre email est suspect, essayez un vrai pour voir !', 'error');
      return;
    }

    // If you arrived here, congratulations, you are worthy to create your account with us
    this.props.maestro.dataRefresh('createUser', this.userLogin.value, this.userPassword.value, this.userMail.value);
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

  render() {
    const containerClass = this.props.open ? 'formContainer show' : 'formContainer';
    return (
      <div className={containerClass}>
        <div className="userForm">
          <div className="formTitle">Création de votre compte</div>
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
              placeholder="Email"
              ref={input => this.userMail = input}
            />
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
  maestro: PropTypes.object
};

UserForm.defaultProps = { // define the default props
  open: false,
  usersLogin: [],
  maestro: { dataRefresh: () => {} }
};
export default UserForm;

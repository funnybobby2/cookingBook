const User = require('../../models/User');

// ///////////////// USERS API //////////////////// //

module.exports = function (app) {
  // get users
  app.get('/api/users', (req, res, next) => {
    User.find()
      .exec()
      .then(user => res.json(user))
      .catch(err => next(err));
  });

  // get a user
  app.get('/api/users/:login/:password', (req, res, next) => {
    // Pour récupérer le user avec ce login et ce password
    User.findOne({ login: req.params.login, password: req.params.password })
      .exec()
      .then(user => res.json(user)) // return user in JSON format
      .catch(err => next(err));
  });

  // create a user
  app.post('/api/users/', (req, res, next) => {
    const user = new User(); // use User schema
    // get data to create user from req.body
    user._id = `@${req.body.login}`;
    user.login = req.body.login;
    user.password = req.body.password;
    user.email = req.body.email;
    // save it
    user.save()
      .then(() => res.json(user))
      .catch(err => next(err));
  });

  // update a user
  app.put('/api/user/:login/:password', (req, res, next) => {
    // on cherche l'utilisateur concernée
    User.findOne({ login: req.params.login, password: req.params.password })
      .exec()
      .then((user) => {
        // mise à jour du user
        user.login = req.body.login;
        user.password = req.body.password; // etc ...
        // on stocke l'objet en base
        user.save()
          .then(() => res.json(user))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });
};

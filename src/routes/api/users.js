const User = require('../../models/User');
const fs = require('fs');

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
    user.logo = req.body.logo;
    // save it
    user.save()
      .then(() => res.json(user))
      .catch(err => next(err));
  });

  // update mark
  app.put('/api/users/mark/:id', (req, res) => {
    User.findOne({ _id: req.body.user })
      .then((user) => {
        user.votedFor.push(req.params.id);
        user.save(() => {
          res.json(user);
        });
      });
  });

  // update a user
  app.put('/api/users/update', (req, res, next) => {
    // on cherche l'utilisateur concernée
    User.findOne({ _id: req.body.id })
      .exec()
      .then((user) => {
        // si l'utilisateur a toujours le même login
        if (user.login === req.body.login) {
          user.password = req.body.password;
          user.email = req.body.email;
          user.logo = req.body.logo;
          // on stocke l'objet en base
          user.save()
            .then(() => res.json(user))
            .catch(err => next(err));
        } else {
          const newUser = new User(); // use User schema
          // get data to create user from req.body
          newUser._id = `@${req.body.login}`;
          newUser.login = req.body.login;
          newUser.password = req.body.password;
          newUser.email = req.body.email;
          newUser.logo = req.body.logo;
          // delete the old user
          User.findByIdAndRemove(user._id)
            .catch(err => console.log(err));
          // save it
          newUser.save()
            .then(() => res.json(newUser))
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  });

  // get files elements in the src\client\assets\img\user folder
  app.get('/api/files/avatars', (req, res) => {
    const files = [];
    fs.readdirSync(`${__dirname}/../../client/assets/img/user`).forEach((file) => {
      files.push(file);
    });
    return new Promise(((resolve) => {
      resolve(res.json(files));
    }));
  });
};

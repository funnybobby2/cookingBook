const User = require('../../models/User');
const Recipe = require('../../models/Recipe');


// ///////////////// RECIPES API //////////////////// //

module.exports = function (app) {
  // //////////////////////////////////////    GET A RECIPE   //////////////////////////////// //

  app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({ recipeID: Number(req.params.id) }) // Pour récupérer la recipe avec cet id
      .populate('validatedBy') // pour peupler les users en ref
      .populate('deletedBy') // pour peupler les users en ref
      .populate('comments.author') // pour peupler les users en ref
      .exec()
      .then(recipe => res.json(recipe)) // return recipe in JSON format
      .catch(err => next(err));
  });

  // //////////////////////////////////////    GET ALL RECIPES   //////////////////////////////// //

  app.get('/api/recipes', (req, res, next) => {
    Recipe.find() // Pour récupérer tous les recipes
      .populate('validatedBy') // pour peupler les users en ref
      .populate('deletedBy') // pour peupler les users en ref
      .populate('comments.author') // pour peupler les users en ref
      .exec()
      .then((recipes) => {
        res.json(recipes);
      })// return recipes in JSON format
      .catch(err => next(err));
  });

  // //////////////////////////////////////    CREATE A RECIPE   //////////////////////////////// //

  app.post('/api/recipes/', (req, res, next) => {
    const recipe = new Recipe(); // on utilise le schema de Recipe
    // on récupère les données reçues pour les ajouter à l'objet Recipe
    recipe.category = req.body.category;
    recipe.title = req.body.title;
    // etc ...
    // on stocke l'objet en base
    recipe.save()
      .then(() => res.json(recipe))
      .catch(err => next(err));
  });

};

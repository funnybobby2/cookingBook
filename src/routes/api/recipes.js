const User = require('../../models/User');
const Recipe = require('../../models/Recipe');
const _ = require('lodash');

const getFilteredParam = (query) => {
  const filterParam = {};
  // filtered on category
  if ((query.cat !== undefined) && (query.cat !== 'all')) {
    filterParam.category = query.cat;
  }
  // filtered on query
  if ((query.q !== undefined) && (query.q !== '') && (query.q.length > 2)) {
    const words = query.q
      .trim()
      .split(' ')
      .filter(word => word.length > 2);

    const queryArr = [];
    words.forEach((w) => {
      queryArr.push({
        $or: [{ title: { $regex: w, $options: 'ig' } },
          { 'ingredients.ingredient': { $regex: w, $options: 'ig' } },
          { 'steps.text': { $regex: w, $options: 'ig' } },
          { chiefTrick: { $regex: w, $options: 'ig' } },
          { tags: { $regex: w, $options: 'ig' } }]
      });
    });

    filterParam.$and = queryArr;
  }

  return filterParam;
};

const checkFilterMinMax = (spiceMin, spiceMax, rateMin, rateMax, spiceFilter, rateFilter, recipe) => {
  let spiceVal = true;
  if (spiceFilter === 'true') spiceVal = (Number(recipe.spicy) >= Number(spiceMin)) && (Number(recipe.spicy) <= Number(spiceMax));
  let rateVal = true;
  if (rateFilter === 'true') {
    const rate = Number(recipe.mark) / Number(recipe.nbMark);
    rateVal = (rate >= Number(rateMin)) && (rate <= Number(rateMax));
  }
  return spiceVal && rateVal;
};

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
    const filterParam = getFilteredParam(req.query);

    Recipe.find(filterParam) // Pour récupérer tous les recipes
      .populate('validatedBy') // pour peupler les users en ref
      .populate('deletedBy') // pour peupler les users en ref
      .populate('comments.author') // pour peupler les users en ref
      .exec()
      .then((recipes) => {
        // ici on filtre sur les new only/deleted only/validated only :
        // del: onlyDeleted, val: onlyValidated, new: onlyNew, q: query, u: user._id
        recipes = _.filter(recipes, (r) => {
          // check spice and rate
          const checkSpiceAndRate = checkFilterMinMax(req.query.spiceMin, req.query.spiceMax, req.query.rateMin, req.query.rateMax, req.query.spice, req.query.rate, r);
          // only deleted
          if (req.query.del === 'true') return (_.filter(r.deletedBy, { _id: req.query.u }).length > 0) && checkSpiceAndRate;

          const notDeleted = _.filter(r.deletedBy, { _id: req.query.u }).length === 0;
          const validated = _.filter(r.validatedBy, { _id: req.query.u }).length > 0;
          // only validated
          if (req.query.val === 'true') return (validated && notDeleted && checkSpiceAndRate);
          // only new
          if (req.query.new === 'true') return (!validated && notDeleted && checkSpiceAndRate);
          return notDeleted && checkSpiceAndRate;
        });

        res.json(recipes);
      })// return recipes in JSON format
      .catch(err => next(err));
  });

  // //////////////////////////////////////    CREATE A RECIPE   //////////////////////////////// //

  app.post('/api/recipes/create', (req, res, next) => {
    Recipe.find()
      .sort({ recipeID: -1 })
      .limit(1)
      .exec()
      .then((recip) => {
        const nextId = recip[0].recipeID + 1;
        const recipe = new Recipe(); // on utilise le schema de Recipe
        recipe.recipeID = nextId;
        const bodyRecipe = JSON.parse(req.body.recipe);
        recipe.category = bodyRecipe.category;
        recipe.title = bodyRecipe.title;
        recipe.prepPeriod = bodyRecipe.prepPeriod;
        recipe.cookPeriod = bodyRecipe.cookPeriod;
        recipe.restPeriod = bodyRecipe.restPeriod;
        recipe.nbPeople = bodyRecipe.nbPeople;
        recipe.nbPeopleUnit = bodyRecipe.nbPeopleUnit;
        recipe.meatClass = bodyRecipe.meatClass;
        recipe.chiefTrick = bodyRecipe.chiefTrick;
        recipe.video = Boolean(bodyRecipe.video);
        recipe.spicy = Number(bodyRecipe.spicy);
        recipe.ingredients = bodyRecipe.ingredients;
        recipe.steps = bodyRecipe.steps;
        recipe.tags = bodyRecipe.tags;

        // on stocke l'objet en base
        recipe.save()
          .then(() => res.json(recipe))
          .catch(err => next(err));
      });
  });

  // //////////////////////////////////////    UPDATE A RECIPE   //////////////////////////////// //

  app.put('/api/recipes/validate/add/:id', (req, res, next) => {
    User.findById(req.body.user)
      .then((u) => {
        Recipe.findOne({ recipeID: Number(req.params.id) })
          .populate('validatedBy') // pour peupler les users en ref
          .populate('deletedBy') // pour peupler les users en ref
          .populate('comments.author') // pour peupler les users en ref
          .then((recipe) => {
            recipe.validatedBy.push(u);
            recipe.save(() => {
              res.json(recipe);
            });
          });
      })
      .catch(err => next(err));
  });

  app.put('/api/recipes/validate/del/:id', (req, res) => {
    Recipe.findOne({ recipeID: Number(req.params.id) })
      .populate('validatedBy') // pour peupler les users en ref
      .populate('deletedBy') // pour peupler les users en ref
      .populate('comments.author') // pour peupler les users en ref
      .then((recipe) => {
        recipe.validatedBy.remove(req.body.user);
        recipe.save(() => {
          res.json(recipe);
        });
      });
  });

  app.put('/api/recipes/delete/add/:id', (req, res, next) => {
    User.findById(req.body.user)
      .then((u) => {
        Recipe.findOne({ recipeID: Number(req.params.id) })
          .populate('validatedBy') // pour peupler les users en ref
          .populate('deletedBy') // pour peupler les users en ref
          .populate('comments.author') // pour peupler les users en ref
          .then((recipe) => {
            recipe.deletedBy.push(u);
            recipe.save(() => {
              res.json(recipe);
            });
          });
      })
      .catch(err => next(err));
  });

  app.put('/api/recipes/delete/del/:id', (req, res) => {
    Recipe.findOne({ recipeID: Number(req.params.id) })
      .populate('validatedBy') // pour peupler les users en ref
      .populate('deletedBy') // pour peupler les users en ref
      .populate('comments.author') // pour peupler les users en ref
      .then((recipe) => {
        recipe.deletedBy.remove(req.body.user);
        recipe.save(() => {
          res.json(recipe);
        });
      });
  });

  app.put('/api/recipes/update/:fieldName/:id', (req, res) => {
    Recipe.findOne({ recipeID: Number(req.params.id) })
      .populate('validatedBy') // pour peupler les users en ref
      .populate('deletedBy') // pour peupler les users en ref
      .populate('comments.author') // pour peupler les users en ref
      .then((recipe) => {
        recipe[req.params.fieldName] = req.body.field;
        recipe.save(() => {
          res.json(recipe);
        });
      });
  });

  app.put('/api/recipes/updateArray/:fieldName/:index/:subField/:id', (req, res) => {
    Recipe.findOne({ recipeID: Number(req.params.id) })
      .populate('validatedBy') // pour peupler les users en ref
      .populate('deletedBy') // pour peupler les users en ref
      .populate('comments.author') // pour peupler les users en ref
      .then((recipe) => {
        if (req.params.subField !== 'none') { // array of object
          recipe[req.params.fieldName][req.params.index][req.params.subField] = req.body.field;
        } else { // array of value
          recipe[req.params.fieldName][req.params.index] = req.body.field;
          recipe.markModified(`${req.params.fieldName}.${req.params.index}`);
        }

        recipe.save(() => {
          res.json(recipe);
        });
      });
  });

  app.put('/api/recipes/addComment/:id', (req, res) => {
    User.findById(req.body.user)
      .then((u) => {
        Recipe.findOne({ recipeID: Number(req.params.id) })
          .populate('validatedBy') // pour peupler les users en ref
          .populate('deletedBy') // pour peupler les users en ref
          .populate('comments.author') // pour peupler les users en ref
          .then((recipe) => {
            recipe.comments.push({ author: u, text: req.body.comment });

            recipe.save(() => {
              res.json(recipe);
            });
          });
      });
  });

  app.put('/api/recipes/deleteComment/:id', (req, res, next) => {
    Recipe.findOneAndUpdate(
      { recipeID: Number(req.params.id) },
      { $pull: { comments: { postedAt: req.body.postedAt } } },
      { new: true, upsert: true },
      (err) => {
        if (err) console.log('error during the delete comment action', err);
        else {
          Recipe.findOne({ recipeID: Number(req.params.id) }) // Get the recipe with id
            .populate('validatedBy') // pour peupler les users en ref
            .populate('deletedBy') // pour peupler les users en ref
            .populate('comments.author') // pour peupler les users en ref
            .exec()
            .then((recipe) => {
              res.json(recipe);
            })
            .catch(e => next(e));
        }
      }
    );
  });

  app.put('/api/recipes/addArray/:fieldName/:id/:isObj', (req, res) => {
    Recipe.findOne({ recipeID: Number(req.params.id) })
      .populate('validatedBy') // pour peupler les users en ref
      .populate('deletedBy') // pour peupler les users en ref
      .populate('comments.author') // pour peupler les users en ref
      .then((recipe) => {
        if (req.params.isObj === 'false') recipe[req.params.fieldName].push(req.body.field);
        else recipe[req.params.fieldName].push(JSON.parse(req.body.field));

        recipe.save(() => {
          res.json(recipe);
        });
      });
  });

  app.put('/api/recipes/reorderIngredients/:id', (req, res, next) => {
    Recipe.findOneAndUpdate({ recipeID: Number(req.params.id) }, { $set: { ingredients: [] } }, { upsert: true }, (err) => {
      if (err) console.log('error during the delete all ingredients action', err);
      else {
        Recipe.findOne({ recipeID: Number(req.params.id) }) // Get the recipe with id
          .populate('validatedBy') // pour peupler les users en ref
          .populate('deletedBy') // pour peupler les users en ref
          .populate('comments.author') // pour peupler les users en ref
          .exec()
          .then((recipe) => {
            const newIngrs = JSON.parse(req.body.ingredients);
            newIngrs.forEach((i) => {
              recipe.ingredients.push(i);
            });
            recipe.save(() => {
              res.json(recipe);
            });
          })
          .catch(e => next(e));
      }
    });
  });

  app.put('/api/recipes/deleteArray/:fieldName/:index/:subField/:id', (req, res, next) => {
    if (req.params.subField !== 'none') { // array of object
      const obj = {};
      const subObj = {};
      subObj[req.params.subField] = Number(req.body.field);
      obj[req.params.fieldName] = subObj;
      Recipe.findOneAndUpdate(
        { recipeID: Number(req.params.id) },
        { $pull: obj },
        { new: true, upsert: true },
        (err) => {
          if (err) console.log('error during the delete comment action', err);
          else {
            Recipe.findOne({ recipeID: Number(req.params.id) }) // Get the recipe with id
              .populate('validatedBy') // pour peupler les users en ref
              .populate('deletedBy') // pour peupler les users en ref
              .populate('comments.author') // pour peupler les users en ref
              .exec()
              .then((recipe) => {
                if (req.params.fieldName === 'steps') {
                  recipe[req.params.fieldName].forEach((step) => {
                    if (step.index > (Number(req.params.index) + 1)) step.index -= 1;
                  });
                  recipe.save(() => res.json(recipe));
                } else res.json(recipe);
              }) // return recipe in JSON format
              .catch(e => next(e));
          }
        }
      );
    } else { // array of value
      Recipe.findOne({ recipeID: Number(req.params.id) })
        .populate('validatedBy') // pour peupler les users en ref
        .populate('deletedBy') // pour peupler les users en ref
        .populate('comments.author') // pour peupler les users en ref
        .then((recipe) => {
          recipe[req.params.fieldName].remove(req.body.field);
          recipe.save(() => {
            res.json(recipe);
          });
        });
    }
  });

  app.put('/api/recipes/mark/:id', (req, res) => {
    Recipe.findOne({ recipeID: Number(req.params.id) })
      .populate('validatedBy') // pour peupler les users en ref
      .populate('deletedBy') // pour peupler les users en ref
      .populate('comments.author') // pour peupler les users en ref
      .then((recipe) => {
        recipe.mark = Number(req.body.mark);
        recipe.nbMark += 1;
        recipe.save(() => {
          res.json(recipe);
        });
      });
  });
};

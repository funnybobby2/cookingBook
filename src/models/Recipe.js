const mongoose = require('mongoose');

// //////////////////////////////  SCHEMAS   ////////////////////////////////

const recipeSchema = new mongoose.Schema({
  recipeID: {
    type: Number
  },
  category: {
    type: String,
    enum: ['aperitif', 'autre', 'boisson', 'dessert', 'entree', 'plat'],
    default: 'plat'
  },
  title: {
    type: String
  },
  prepPeriod: {
    type: String,
    default: '0 min'
  },
  cookPeriod: {
    type: String,
    default: '0 min'
  },
  restPeriod: {
    type: String,
    default: '0 min'
  },
  nbPeople: {
    type: String
  },
  nbPeopleUnit: {
    type: String,
    enum: ['Pers.', 'Pièces'],
    default: 'Pers.'
  },
  mark: {
    type: Number,
    default: 0
  },
  nbMark: {
    type: Number,
    default: 0
  },
  spicy: {
    type: Number,
    min: 0,
    max: 3,
    default: 0
  },
  meatClass: {
    type: String,
    enum: ['', 'boeuf', 'boeufporc', 'canard', 'crustace', 'moutonpoulet', 'poisson', 'porc', 'porccrustace', 'porcpoisson', 'poulet', 'pouletcrustace', 'pouletporc', 'vegetable'],
    default: ''
  },
  chiefTrick: {
    type: String,
    default: 'Aucune astuce !'
  },
  comments: [
    {
      text: { type: String, required: true },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      postedAt: { type: Date, default: Date.now, index: true },
    },
  ],
  ingredients: [
    {
      ingredient: { type: String, required: true },
      quantity: {
        type: String,
        default: ''
      },
      unit: {
        type: String,
        default: ''
      },
      index: { type: Number, required: true },
      group: {
        type: String,
        default: ''
      }
    }
  ],
  steps: [{
    text: { type: String, required: true },
    index: { type: Number, required: true },
  }],
  tags: { type: [String], index: true },
  video: {
    type: String,
    default: ''
  },
  help: {
    type: String,
    default: ''
  },
  validatedBy: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: 'User' }],
  deletedBy: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: 'User' }]
});

// //////////////////////////////  MODELS   ////////////////////////////////

module.exports = mongoose.model('Recipe', recipeSchema);

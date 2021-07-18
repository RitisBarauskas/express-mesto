const mogoose = require('mongoose');

const cardSchema = new mogoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  link: {
    type: String,
    required: true,
  },

  owner: {
    type: mogoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: [
    {
      type: mogoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      default: '',
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mogoose.model('card', cardSchema);

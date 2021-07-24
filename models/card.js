const mogoose = require("mongoose");
const validator = require("validator");

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
    validate: {
      validator: (v) => validator.isURL(v),
      message: "link должно быть ссылкой",
    },
  },

  owner: {
    type: mogoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  likes: {
    type: [
      {
        type: mogoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mogoose.model("card", cardSchema);

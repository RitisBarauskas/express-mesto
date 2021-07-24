const mogoose = require("mongoose");
const validator = require("validator");

const userSchema = new mogoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Email должен быть корректным",
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },

  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Ritis Barauskas",
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "SuperDeveloper",
  },

  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Avatar должно быть ссылкой",
    },
  },
});

module.exports = mogoose.model("user", userSchema);

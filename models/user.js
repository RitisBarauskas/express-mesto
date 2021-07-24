const mogoose = require("mongoose");

const userSchema = new mogoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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
  },
});

module.exports = mogoose.model("user", userSchema);

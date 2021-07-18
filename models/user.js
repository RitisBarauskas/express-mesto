const mogoose = require("mongoose");

const userSchema = new mogoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Ritis Barauskas",
    required: true,
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "SuperDeveloper",
    required: true,
  },

  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    required: true,
  },

});

module.exports = mogoose.model("user", userSchema);

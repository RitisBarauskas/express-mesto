const users = require("express").Router();

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getProfileMe,
} = require("../controllers/users");

const {
  validationUserID,
  validationUpdateAvatar,
  validationUpdateUser,
} = require("../utils/validations");

users.get("/", getUsers);

users.get("/me", getProfileMe);

users.get("/:userId", validationUserID, getUser);

users.patch("/me", validationUpdateUser, updateUser);

users.patch("/me/avatar", validationUpdateAvatar, updateAvatar);

module.exports = users;

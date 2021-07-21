const users = require("express").Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getProfileMe,
} = require("../controllers/users");

users.get("/", getUsers);

users.get("/me", getProfileMe);

users.get("/:userId", getUser);

users.patch("/me", updateUser);

users.patch("/me/avatar", updateAvatar);

module.exports = users;

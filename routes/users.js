const users = require('express').Router();
const { createUser, getUsers, getUser, updateUser, updateAvatar } = require('../controllers/users');

users.get('/', getUsers);

users.get('/:userId', getUser);

users.post('/', createUser);

users.patch('/me', updateUser);

users.patch('/me/avatar', updateAvatar);

module.exports = users;

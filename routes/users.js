const users = require('express').Router();
const User = require('../models/user');


users.get('/', (req, res) => {
  res.send('Hello, users!');
});

users.get('/:userId', (req, res) => {
  res.send('Hello, user!');
});


users.post('/', (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch(err => console.log(err));
});

module.exports = users;

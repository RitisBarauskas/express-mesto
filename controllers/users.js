const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => console.log(err));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => console.log(err));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const err = new Error('Пользователь с таким ID не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.message });
      }
      if (err.statusCode === 400) {
        return res.status(400).send({ message: 'Неверный ID' });
      }
      return res.status(500).send({ message: 'Некорректный запрос' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, about }, {new: true})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, {new: true})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

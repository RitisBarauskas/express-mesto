const User = require("../models/user");

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(err => {
      if (err.statusCode === ERROR_CODE_400) {
        return res.status(ERROR_CODE_400).send({ message: "Переданы некорректные данные при создании пользователя" });
      }
      res.status(ERROR_CODE_500).send({ message: "Некорректный запрос" });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(err => {
      if (err.statusCode === ERROR_CODE_400) {
        return res.status(ERROR_CODE_400).send({ message: "Переданы некорректные данные при создании пользователя" });
      }
      res.status(ERROR_CODE_500).send({ message: "Некорректный запрос" });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  User.findById(userId)
    .orFail(() => {
      const error = new Error("Пользователь с таким ID не найден");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err.statusCode);
      if (err.statusCode === ERROR_CODE_404) {
        return res.status(ERROR_CODE_404).send({ message: err.message });
      }
      if (err.statusCode === ERROR_CODE_400) {
        return  res.status(ERROR_CODE_400).send({ message: 'Неизвестный ID' });
      } else {
        res.status(ERROR_CODE_500).send({ message: "Некорректный запрос" });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch(err => res.status(ERROR_CODE_500).send({ message: err.message }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch(err => res.status(ERROR_CODE_500).send({ message: err.message }));
};

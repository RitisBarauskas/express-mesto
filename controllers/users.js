const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user");

const JWT_SECRET_KEY='SUPER_SECRET_KEY';
const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

module.exports.createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({
      email: email,
      password: hash,
      name: name,
      about: about,
      avatar: avatar
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_CODE_400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res.status(ERROR_CODE_500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(ERROR_CODE_500).send({ message: "Произошла ошибка" });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("Пользователь с таким ID не найден");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_404) {
        res.status(ERROR_CODE_404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(ERROR_CODE_400).send({ message: "Неизвестный ID" });
      } else {
        res.status(ERROR_CODE_500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(
    owner,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("Пользователь с таким ID не найден");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_404) {
        res.status(ERROR_CODE_404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(ERROR_CODE_400).send({ message: "Неизвестный ID" });
      } else if (err.name === "ValidationError") {
        res
          .status(ERROR_CODE_400)
          .send({ message: "Пришли невалидные данные" });
      } else {
        res.status(ERROR_CODE_500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error("Пользователь с таким ID не найден");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_404) {
        res.status(ERROR_CODE_404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(ERROR_CODE_400).send({ message: "Неизвестный ID" });
      } else if (err.name === "ValidationError") {
        res
          .status(ERROR_CODE_400)
          .send({ message: "Пришли невалидные данные" });
      } else {
        res.status(ERROR_CODE_500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).send({
      message: "Отсутствует пароль или email"
    })
  } else {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          res.status(409).send({
            message: "Ошибка аутентификации - пользователь не найден"
          })
        } else {
          bcrypt.compare(password, user.password, (err, isValid) => {
            if (!isValid) {
              res.status(403).send({
                message: "Ошибка аутентификации - пароль некорректный"
              })
            } else {
              const userToken = jwt.sign(
                { _id: user._id },
                JWT_SECRET_KEY,
                { expiresIn: '7d' });
              res.send({ token: userToken })
            }
          })
        }
      })
      .catch((err) => {
        if (err.statusCode === ERROR_CODE_404) {
          res.status(ERROR_CODE_404).send({ message: err.message });
        } else if (err.name === "CastError") {
          res.status(ERROR_CODE_400).send({ message: "Неизвестный ID" });
        } else if (err.name === "ValidationError") {
          res
            .status(ERROR_CODE_400)
            .send({ message: "Пришли невалидные данные" });
        } else {
          res.status(ERROR_CODE_500).send({ message: "Произошла ошибка" });
        }
      });
  }
};

module.exports.getProfileMe = (req, res) => {
  const owner = req.user._id;
  User.findById(owner)
    .orFail(() => {
      const error = new Error("Пользователь с таким ID не найден");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_404) {
        res.status(ERROR_CODE_404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(ERROR_CODE_400).send({ message: "Неизвестный ID" });
      } else if (err.name === "ValidationError") {
        res
          .status(ERROR_CODE_400)
          .send({ message: "Пришли невалидные данные" });
      } else {
        res.status(ERROR_CODE_500).send({ message: "Произошла ошибка" });
      }
    });
};

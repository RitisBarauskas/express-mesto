const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ConflictError = require("../errors/conflict");

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");

const { JWT_SECRET_KEY = "SUPER_SECRET_KEY" } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;
  if (!email || !password) {
    throw new UnauthorizedError("Отсутствуют почта или пароль");
  }
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
    )
    .then((user) => res.send({ data: { email: user.email, name: user.name } }))
    .catch((err) => {
      if (err.name === "MongoError" || err.code === 11000) {
        throw new ConflictError("Пользователь с таким email уже существует");
      }
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Передана некорретная почта или пароль");
      }
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError("Пользователь с таким ID не найден");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Неизвестный идентификатор");
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(
    owner,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("Пользователь с таким ID не найден");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError("Пользователь с таким ID не найден");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new UnauthorizedError("Не указаны логин или пароль");
  }
  User.findOne({ email })
    .select("+password")
    .orFail(() => {
      throw new UnauthorizedError("Не найден пользователь с такой почтой");
    })
    .then((user) => {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (!isValid) {
          return next(new UnauthorizedError("Пароль некорректный"));
        }
        const userToken = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
          expiresIn: "7d",
        });
        res.send({ token: userToken });
      });
    })
    .catch(next);
};

module.exports.getProfileMe = (req, res, next) => {
  const owner = req.user._id;
  User.findById(owner)
    .orFail(() => {
      throw new NotFoundError("Пользователь не найден");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      }
    })
    .catch(next);
};

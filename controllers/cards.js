const Card = require("../models/card");

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(err => {
      if (err.statusCode === ERROR_CODE_400) {
        return res.status(ERROR_CODE_400).send({ message: "Переданы некорректные данные при создании карточки" });
      }
      res.status(ERROR_CODE_500).send({ message: "Некорректный запрос" });
    });
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(err => res.status(ERROR_CODE_500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch(err => {
      if (err.statusCode === ERROR_CODE_404) {
        return res.status(ERROR_CODE_404).send({ message: "Карточка с таким ID не найдена" });
      }
      res.status(ERROR_CODE_500).send({ message: "Некорректный запрос" });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(err => {
      if (err.statusCode === ERROR_CODE_400) {
        return res.status(ERROR_CODE_400).send({ message: "Переданы некорректные данные при постановке лайка" });
      }
      res.status(ERROR_CODE_500).send({ message: "Некорректный запрос" });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(err => {
      if (err.statusCode === ERROR_CODE_400) {
        return res.status(ERROR_CODE_400).send({ message: "Переданы некорректные данные при дизлайке" });
      }
      res.status(ERROR_CODE_500).send({ message: "Некорректный запрос" });
    });
};

const cards = require("express").Router();
const {
  createCard,
  getAllCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const {
  validationCardID,
  validationCreateCard,
} = require("../utils/validations");

cards.post("/", validationCreateCard, createCard);
cards.get("/", getAllCards);
cards.delete("/:cardId", validationCardID, deleteCard);
cards.put("/:cardId/likes", validationCardID, likeCard);
cards.delete("/:cardId/likes", validationCardID, dislikeCard);

module.exports = cards;

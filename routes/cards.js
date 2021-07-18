const cards = require('express').Router();
const { createCard, getAllCards, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

cards.post('/', createCard);
cards.get('/', getAllCards);
cards.delete('/:cardId', deleteCard);
cards.put('/:cardId/likes', likeCard);
cards.delete('/:cardId/likes', dislikeCard);

module.exports = cards;

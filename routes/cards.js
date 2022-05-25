const router = require('express').Router();

const {
  createCard, getCards, deleteCard, LikeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/cards', createCard);
router.get('/cards', getCards);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', LikeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;

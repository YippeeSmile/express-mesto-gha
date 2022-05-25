const Card = require('../models/card');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })

    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};

const getCards = (_, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка ' }));
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена.'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send('Переданы некорректные данные.');
      }
      return res.status(500).send('Ошибка на сервере');
    });
};

const LikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена.'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send('Переданы некорректные данные (id карточки).');
      }
      return res.status(500).send('Ошибка на сервере');
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена.'));
      }
      res.send({ data: card });
    })
    .catch(() => {
      next(new ServerError('Ошибка на сервере'));
    });
};

module.exports = {
  createCard, getCards, deleteCard, LikeCard, dislikeCard,
};

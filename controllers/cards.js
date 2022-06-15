const Card = require('../models/card');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

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

const getCards = (_req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const deleteCardHandler = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then(() => res.send({ message: 'Карточка удалена' }))
      .catch((err) => {
        if (err.name === 'CastError' || err.name === 'ValidationError') {
          return next(new BadRequestError('Переданы некорректные данные.'));
        }
        return next(new ServerError('Ошибка на сервере'));
      });
  };

  Card.findById(req.params.cardId)
    .then((cardInfo) => {
      if (!cardInfo) {
        return next(new NotFoundError('Карточка не найдена.'));
      }
      if (req.user._id !== cardInfo.owner.toString()) {
        return next(new ForbiddenError('невозможно удалить карточку другого пользователя'));
      }
      return deleteCardHandler();
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные.'));
      }
      return next(new ServerError('Ошибка на сервере'));
    });
};

const LikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена.'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с таким id не найдена.'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные.' }));
      }
      next(new ServerError({ message: 'Ошибка на сервере' }));
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  LikeCard,
  dislikeCard,
};

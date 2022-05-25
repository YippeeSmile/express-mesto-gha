const User = require('../models/user');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })

    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные.' }));
      } else {
        next(new ServerError({ message: 'Ошибка на сервере' }));
      }
    });
};

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => {
      next(new ServerError({ message: 'Ошибка на сервере' }));
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (!users) {
        next(new NotFoundError({ message: 'Пользователь не найден.' }));
      }
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные.' }));
      }
      next(new ServerError({ message: 'Ошибка на сервере' }));
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidations: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные.' }));
      }
      next(new ServerError({ message: 'Ошибка на сервере' }));
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidations: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные.' }));
      } else {
        next(new ServerError({ message: 'Ошибка на сервере' }));
      }
      next(err);
    });
};

module.exports = {
  createUser, getUsers, getUser, updateUser, updateAvatar,
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const InternalServerError = require('../errors/InternalServerError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      const err = new InternalServerError('Ошибка сервера');
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError('Невалидный id');
        next(error);
      } else {
        const error = new InternalServerError('Ошибка сервера');
        next(error);
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError('Невалидный id');
        next(error);
      } else {
        const error = new InternalServerError('Ошибка сервера');
        next(error);
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send({
      data: {
        email: user.email, name: user.name, about: user.about, avatar: user.avatar, id: user._id,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Невалидные данные');
        next(error);
      } else if (err.code === 11000) {
        const error = new ConflictError('Пользователь с таким email уже существует');
        next(error);
      } else {
        const error = new InternalServerError('Ошибка сервера');
        next(error);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Невалидные данные');
        next(error);
      } else {
        const error = new InternalServerError('Ошибка сервера');
        next(error);
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Невалидные данные');
        next(error);
      } else {
        const error = new InternalServerError('Ошибка сервера');
        next(error);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-mega-ultra-over-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      const error = new UnauthorizedError('Неправильные почта или пароль');
      next(error);
    })
    .catch(next);
};

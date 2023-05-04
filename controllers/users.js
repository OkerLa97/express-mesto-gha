const http2 = require('http2');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: err.message });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Нет пользователя с таким id' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Невалидный id' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Невалидные данные' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Невалидные данные' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Невалидные данные' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка сервера' });
      }
    });
};

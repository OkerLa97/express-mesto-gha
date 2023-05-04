const http2 = require('http2');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка сервера' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Невалидные данные' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Нет карточки с таким id' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Невалидный id' });
      } else {
        res.send({ message: err.message });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Нет карточки с таким id' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Невалидный id' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: err.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Нет карточки с таким id' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Невалидный id' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: err.message });
      }
    });
};

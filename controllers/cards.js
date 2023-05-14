const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const InternalServerError = require('../errors/InternalServerError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      const err = new InternalServerError('Ошибка сервера');
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Ошибка валидации');
        next(error);
      } else {
        const error = new InternalServerError('Ошибка сервера');
        next(error);
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id; // получаем id пользователя из токена авторизации
  Card.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      } else if (card.owner.toString() !== userId) {
        throw new UnauthorizedError('Нет прав на удаление карточки');
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then((cardData) => {
            res.send({ data: cardData });
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

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      } else {
        res.send({ data: card });
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

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      } else {
        res.send({ data: card });
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

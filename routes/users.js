const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers, getUser, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

const { AVATAR_VALIDATION_REGEX } = require('../config');

// getUsers
router.get('/', getUsers);

// getCurrentUser
router.get('/me', getCurrentUser);

// getUser
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser);

// updateUser
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

// updateAvatar
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .regex(AVATAR_VALIDATION_REGEX),
  }),
}), updateAvatar);

module.exports = router;

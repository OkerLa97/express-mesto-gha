const express = require('express');

const http2 = require('http2');
const { errors } = require('celebrate');

const errorHandler = require('../middlewares/errorHandler');
const auth = require('../middlewares/auth');

const router = express.Router();

// роуты, не требующие авторизации
router.use('/signin', require('./signin'));
router.use('/signup', require('./signup'));

// авторизация
router.use(auth);

// роуты, требующие авторизации
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

// обработчик ошибки 404
router.use((req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

// обработчик ошибок celebrate
router.use(errors());

// здесь обрабатываем все ошибки
router.use(errorHandler);

module.exports = router;

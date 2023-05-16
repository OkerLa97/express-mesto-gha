const http2 = require('http2');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('Соединение с БД установлено'))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// роуты, не требующие авторизации
app.use('/signin', require('./routes/signin'));
app.use('/signup', require('./routes/signup'));

// авторизация
app.use(auth);

// роуты, требующие авторизации
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// обработчик ошибки 404
app.use((req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

// обработчик ошибок celebrate
app.use(errors());

// здесь обрабатываем все ошибки
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});

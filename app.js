const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('Соединение с БД установлено'))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes/index');

app.use('/', routes);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});

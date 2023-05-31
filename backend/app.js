const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('Соединение с БД установлено'))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Роуты
app.use('/', routes);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});

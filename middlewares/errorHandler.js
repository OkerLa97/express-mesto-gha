const http2 = require('http2');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });

  next();
};

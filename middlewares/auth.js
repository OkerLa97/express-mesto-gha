const jwt = require('jsonwebtoken');
const http2 = require('http2');

const handleAuthError = (res) => {
  res
    .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-mega-ultra-over-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();

  return true;
};

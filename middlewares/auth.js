const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { AUTH_SECRET } = require('../config');

const handleAuthError = (res, next) => {
  const error = new UnauthorizedError('Необходима авторизация');
  next(error);
  return error;
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res, next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, AUTH_SECRET);
  } catch (err) {
    return handleAuthError(res, next);
  }

  req.user = payload;

  next();

  return true;
};

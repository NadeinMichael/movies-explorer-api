const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
require('dotenv').config();

const { JWT_SECRET } = process.env;

const doesUserHavePermission = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new UnauthorizedError('Необходима авторизация1'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация2'));
  }

  req.user = payload;

  return next();
};

module.exports = doesUserHavePermission;

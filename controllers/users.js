const bcrypt = require('bcrypt');

const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const { _id } = user;
      res.status(201).send({
        name: user.name,
        email: user.email,
        _id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя.'
          )
        );
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильные почта или пароль.'));
      }
      return bcrypt.compare(
        password,
        user.password,
        (error, isPasswordMatch) => {
          if (!isPasswordMatch) {
            return next(
              new UnauthorizedError('Неправильные почта или пароль.')
            );
          }
          const token = generateToken(user._id);
          return res.status(200).send({ token });
        }
      );
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный _id.'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля.'
          )
        );
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUser,
  updateUser,
};

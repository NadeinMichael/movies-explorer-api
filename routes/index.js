const router = require('express').Router();

const userRouters = require('./users');
const movieRouters = require('./movies');
const doesUserHavePermission = require('../middlewares/auth');
const { validateCreateUser, validateLogin } = require('../utils/validation');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);

router.use(doesUserHavePermission);

router.use('/users', userRouters);
router.use('/movies', movieRouters);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;

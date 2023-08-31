const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const newMovie = req.body;
  newMovie.owner = req.user.id;

  Movie.create(newMovie)
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании фильма.',
          ),
        );
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findOne({ movieId })
    .orFail(() => next(new NotFoundError('Фильм с указанным _id не найден'))) // если фильм не найден, то возвращаем ошибку
    .then((movie) => {
      movie
        .deleteOne() // удаляем фильм
        .then(() => res.send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};

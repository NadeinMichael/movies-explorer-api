const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
  },
  director: {
    type: String,
  },
  duration: {
    type: Number,
  },
  year: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    // Ссылка на постер к фильму
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат ссылки на постер к фильму',
    },
  },
  trailer: {
    // Ссылка на трейлер фильма
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат ссылки на трейлер фильма',
    },
  },
  thumbnail: {
    // Миниатюрное изображение постера к фильму
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат миниатюрного изображения постера к фильму',
    },
  },
  owner: {
    // _id пользователя, который сохранил статью
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  movieId: {
    // id фильма, который содержится в ответе сервиса MoviesExplorer
    type: Number,
  },
  nameRU: {
    // Название фильма на русском языке
    type: String,
  },
  nameEN: {
    // Название фильма на английском языке
    type: String,
  },
});

module.exports = mongoose.model('movie', movieSchema);

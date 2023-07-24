const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    // Ссылка на постер к фильму
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат ссылки на постер к фильму',
    },
  },
  trailer: {
    // Ссылка на трейлер фильма
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат ссылки на трейлер фильма',
    },
  },
  thumbnail: {
    // Миниатюрное изображение постера к фильму
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат миниатюрного изображения постера к фильму',
    },
  },
  owner: {
    // _id пользователя, который сохранил статью
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    // id фильма, который содержится в ответе сервиса MoviesExplorer
    type: Number,
    required: true,
  },
  nameRU: {
    // Название фильма на русском языке
    type: String,
    required: true,
  },
  nameEN: {
    // Название фильма на английском языке
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);

/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minLength: 2,
      maxLength: 30,
    },

    about: {
      type: String,
      default: 'Исследователь',
      minLength: 2,
      maxLength: 30,
    },

    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (e) => validator.isEmail(e),
        message: 'Неверный электронный адрес',
      },
    },

    password: {
      type: String,
      required: true,
      minLength: 8,
      select: false,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);

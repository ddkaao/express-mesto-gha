const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const {
  createUser,
  login,
} = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { error } = require('./middlewares/error');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
const REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const PORT = 3000;
const URI = 'mongodb://127.0.0.1:27017/mestodb';

mongoose.connect(URI);

app.use(express.json());

app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REGEX),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REGEX),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/', (req, res, next) => {
  next(new NotFoundError('Страницы не существует'));
});

app.use(errors());
app.use('/', error);

app.listen(PORT);

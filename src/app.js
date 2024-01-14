/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const {
  createUser,
  login,
} = require('./controllers/users');
const cookieParser = require('cookie-parser');
const { auth } = require('./middlewares/auth');
const { error } = require('./middlewares/error');
const { errors } = require('celebrate');

const app = express();
const PORT = 3000;
const URI = 'mongodb://127.0.0.1:27017/mestodb';

mongoose.connect(URI);

app.use(express.json());

app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());
app.use('/', error);

app.listen(PORT);

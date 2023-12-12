const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const { PORT, URI } = process.env;

mongoose.connect(URI);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '65763bf9fba0c7e06b55890a',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT);

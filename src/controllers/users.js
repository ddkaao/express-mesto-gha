const User = require('../models/User');

const OK = 200;
const CREATED = 201;
const NOT_FOUND = 404;
const BAD = 400;
const SERVER__ERROR = 500;

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(OK).send(users);
  } catch (error) {
    return res.status(SERVER__ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    return res.status(OK).send(user);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      default:
        return res.status(SERVER__ERROR).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(CREATED).send(newUser);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res.status(BAD).send({ message: 'Переданы некорректные данные при создании пользователя' });
      default:
        return res.status(SERVER__ERROR).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.updateUserInfo = async (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    );
    return res.send(user);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      case 'ValidationError':
        return res.status(BAD).send({ message: 'Переданы некорректные данные при создании пользователя' });
      default:
        return res.status(SERVER__ERROR).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.send(user);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      case 'ValidationError':
        return res.status(BAD).send({ message: 'Переданы некорректные данные при создании пользователя' });
      default:
        return res.status(SERVER__ERROR).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

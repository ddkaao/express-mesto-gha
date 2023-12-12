const User = require('../models/User');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    return res.status(200).send(user);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).send(newUser);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
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
        return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      case 'ValidationError':
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
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
        return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      case 'ValidationError':
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

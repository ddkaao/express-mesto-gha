const Card = require('../models/Card');

const OK = 200;
const CREATED = 201;
const NOT_FOUND = 404;
const BAD = 400;
const SERVER__ERROR = 500;

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(OK).send(cards);
  } catch (error) {
    return res.status(SERVER__ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const newCard = await Card.create({
      name,
      link,
      owner,
    });
    return res.status(CREATED).send(newCard);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res.status(BAD).send({ message: 'Переданы некорректные данные при создании карточки' });
      default:
        return res.status(SERVER__ERROR).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  try {
    const selectedCard = await Card.findByIdAndDelete({
      _id: cardId,
      owner,
    });
    if (!selectedCard) {
      return res.status(NOT_FOUND).send({ message: 'Карточка по указанному id не найдена' });
    }
    return res.send(selectedCard);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(NOT_FOUND).send({ message: 'Передан не валидный идентификатор' });
      default:
        return res.status(SERVER__ERROR).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.likeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Карточка по указанному id не найдена' });
    }
    return res.send(card);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(NOT_FOUND).send({ message: 'Передан не валидный идентификатор' });
      default:
        return res.status(SERVER__ERROR).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Карточка по указанному id не найдена' });
    }
    return res.send(card);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(NOT_FOUND).send({ message: 'Передан не валидный идентификатор' });
      default:
        return res.status(SERVER__ERROR).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

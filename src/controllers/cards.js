const Card = require('../models/Card');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
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
    return res.status(201).send(newCard);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
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
    return res.send(selectedCard);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(404).send({ message: 'Карточка по указанному id не найдена' });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
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
    return res.send(card);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(404).send({ message: 'Передан несуществующий id карточки' });
      case 'ValidationError':
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
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
    return res.send(card);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(404).send({ message: 'Передан несуществующий id карточки' });
      case 'ValidationError':
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

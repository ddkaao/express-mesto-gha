const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/Card');

const OK = 200;
const CREATED = 201;

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(OK).send(cards);
  } catch (error) {
    return next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
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
    return next(error);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  try {
    const selectedCard = await Card.findByIdAndDelete({
      _id: cardId,
      owner,
    })
      .orFail(() => new NotFoundError('Карточка по указанному id не найдена'));
    if (owner !== selectedCard.owner.toString()) {
      throw new ForbiddenError('Нельзя удалить чужую карточку');
    }
    return res.send(selectedCard);
  } catch (error) {
    return next(error);
  }
};

module.exports.likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => new NotFoundError('Карточка по указанному id не найдена'));
    return res.send(card);
  } catch (error) {
    return next(error);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => new NotFoundError('Карточка по указанному id не найдена'));
    return res.send(card);
  } catch (error) {
    return next(error);
  }
};

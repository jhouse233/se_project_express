const ClothingItem = require('../models/clothingitem');
const BadRequestError = require("../utils/Errors/BadRequestError");
const ForbiddenError = require("../utils/Errors/ForbiddenError");
const NotFoundError = require("../utils/Errors/NotFoundError");





const getAllItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    res.status(200).json({ data: items })
  } catch (err) {
    next(err);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;

    if (!name || !weather || !imageUrl) {
      throw new BadRequestError('Name, weather, and imageUrl are required');
    }

    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id
    });
    res.status(201).send({ data: item });
  } catch(err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Invalid data format'))
    } else {
      next(err);
    }
  }
};

const deleteItem = async (req, res, next) => {
  const { itemId } = req.params;
  try {
    const item = await ClothingItem.findById(itemId).orFail()

    if (item.owner.toString() !== req.user._id) {
      throw new ForbiddenError('You do not have permission to delete this item')
    }

    await item.deleteOne();
    return res.status(204).send();

  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Data format is invalid'));
    } else if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError('Requested resource not found'))
    } else {
      next(err);
    }
  }
};

const addLike = async (req, res, next) => {
  const { itemId } = req.params;
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id }},
      { new: true }
    ).orFail();

    return res.status(200).json({ data: item})
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid item ID'))
    } else if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError('Item not found'));
    } else {
      next(err);
    }
  }
};

const removeLike = async (req, res, next) => {
  const { itemId } = req.params;
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail()
    return res.status(200).json({ data: item })
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError('Requested resource not found'))
    } else if (err.name === 'CastError') {
      next(new BadRequestError('Invalid Data'))
    } else {
      next(err);
    }
  }
}




module.exports = {
  getAllItems,
  createItem,
  deleteItem,
  addLike,
  removeLike
};


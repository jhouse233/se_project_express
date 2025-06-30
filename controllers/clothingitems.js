const ClothingItem = require('../models/clothingitem');
const { OK, CREATED } = require('../utils/constants');

const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// const TEST_USER_ID = '68123daa710934366df09dd9';

const getAllItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    return res.status(OK).json(items);
  } catch (err) {
    next(err);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;

    if (!name || !weather || !imageUrl) {
      throw new BadRequestError('Name, weather, and imageUrl are required')
    }

    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id
    });
    return res.status(CREATED).send(item);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Invalid data format'));
    }
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      throw new NotFoundError('Item not found')
    }

    if (!item.owner.equals(req.user._id)) {
      throw new ForbiddenError('Item not found or not authorized');
    }

    await ClothingItem.findByIdAndDelete(itemId);
    return res.status(OK).send({
      message: 'Item deleted successfully'
    });

  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID'));
    }
    next(err);
  }
};

const addLike = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      throw new NotFoundError('Item not found')
    }

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    return res.status(OK).json(updatedItem);

  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID'));
    }
    next(err);
  }
};

const removeLike = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      throw new NotFoundError('Item not found')
    }

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    return res.status(OK).json(updatedItem);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID'))
    }
    next(err);
  }
};

module.exports = {
  getAllItems,
  createItem,
  deleteItem,
  addLike,
  removeLike
};


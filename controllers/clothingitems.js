const ClothingItem = require('../models/clothingitem');
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_FOUND, OK, CREATED, UNAUTHORIZED, FORBIDDEN, CONFLICT_ERROR } = require('../utils/constants');

// const TEST_USER_ID = '68123daa710934366df09dd9';

const getAllItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    return res.status(OK).json(items);
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).send({
      message: 'An error occurred on the server'
    });
  }
};

const createItem = async (req, res) => {
  console.log('===CREATE ITEM FUNCTION CALLED===')
  console.log('Request body:', req.body);
  try {
    const { name, weather, imageUrl } = req.body;

    if (!name || !weather || !imageUrl) {
      console.log('❌ Missing required fields');
      return res.status(BAD_REQUEST).send({
        message: 'Name, weather, and imageUrl are required'
      });
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
      return res.status(BAD_REQUEST).send({
        message: 'Invalid data format'
      });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({
      message: 'An error occurred on the server'
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return res.status(NOT_FOUND).send({
        message: 'Item not found'
      });
    }

    if (!item.owner.equals(req.user._id)) {
      return res.status(FORBIDDEN).send({
        message: 'Item not found or not authorized'
      });
    }

    await ClothingItem.findByIdAndDelete(itemId);
    return res.status(OK).send({
      message: 'Item deleted successfully'
    });

  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({
        message: 'Invalid item ID'
      });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({
      message: 'An error occurred on the server'
    });
  }
};

const addLike = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return res.status(NOT_FOUND).send({
        message: 'Item not found'
      });
    }

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    return res.status(OK).json(updatedItem);

  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({
        message: 'Invalid item ID'
      });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({
      message: 'An error occurred on the server'
    });
  }
};

const removeLike = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return res.status(NOT_FOUND).send({
        message: 'Item not found'
      });
    }

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    return res.status(OK).json(updatedItem);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({
        message: 'Invalid item ID'
      });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({
      message: 'An error occurred on the server'
    });
  }
};

module.exports = {
  getAllItems,
  createItem,
  deleteItem,
  addLike,
  removeLike
};


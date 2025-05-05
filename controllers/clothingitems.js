const ClothingItem = require('../models/clothingitem');

const TEST_USER_ID = '68123daa710934366df09dd9';

const getAllItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    return res.status(200).json({ data: items });
  } catch (err) {
    return res.status(500).send({
      message: 'An error occurred on the server'
    });
  }
};

const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;

    if (!name || !weather || !imageUrl) {
      return res.status(400).send({
        message: 'Name, weather, and imageUrl are required'
      });
    }

    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: TEST_USER_ID
    });
    return res.status(201).send({ data: item });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Invalid data format'
      });
    }
    return res.status(500).send({
      message: 'An error occurred on the server'
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return res.status(404).send({
        message: 'Item not found'
      });
    }

    await ClothingItem.findByIdAndDelete(itemId);
    return res.status(200).send({
      message: 'Item deleted successfully'
    });

  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({
        message: 'Invalid item ID'
      });
    }
    return res.status(500).send({
      message: 'An error occurred on the server'
    });
  }
};

const addLike = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return res.status(404).send({
        message: 'Item not found'
      });
    }

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: TEST_USER_ID } },
      { new: true }
    );

    return res.status(200).json({ data: updatedItem });

  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({
        message: 'Invalid item ID'
      });
    }
    return res.status(500).send({
      message: 'An error occurred on the server'
    });
  }
};

const removeLike = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return res.status(404).send({
        message: 'Item not found'
      });
    }

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: TEST_USER_ID } },
      { new: true }
    );

    return res.status(200).json({ data: updatedItem });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({
        message: 'Invalid item ID'
      });
    }
    return res.status(500).send({
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


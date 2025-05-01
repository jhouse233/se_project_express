const router = require('express').Router();
const { authorize } = require('../middlewares/auth');
const { getAllItems, createItem, deleteItem, addLike, removeLike } = require('../controllers/clothingitems');

router.get('/', getAllItems);

router.use(authorize);

router.post('/', createItem);
router.delete('/:itemId', deleteItem);
router.put('/:itemId/likes', addLike);
router.delete('/:itemId/likes', removeLike)



module.exports = router;
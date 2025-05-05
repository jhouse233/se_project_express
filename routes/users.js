const router = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');
// const { authorize } = require('../middlewares/auth');

// router.get('/me', authorize, (req, res) => {
//   res.send(req.user);
// })

// router.get('/',authorize, getUsers);
// router.get('/:userId', authorize, getUserById);
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);




module.exports = router;
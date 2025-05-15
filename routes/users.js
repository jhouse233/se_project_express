const router = require('express').Router();
const { getUsers, getCurrentUser, updateUser } = require('../controllers/users');
const { authorize } = require('../middlewares/auth');

// router.get('/me', authorize, (req, res) => {
//   res.send(req.user);
// })
router.get('/me', authorize, getCurrentUser);
router.get('/', authorize, getUsers);
router.patch('/me', authorize, updateUser);

// router.get('/',authorize, getUsers);
// router.get('/:userId', authorize, getUserById);
// router.post('/', createUser);
// router.get('/', getUsers);
// router.get('/:userId', getUserById);




module.exports = router;
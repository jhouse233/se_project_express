const router = require('express').Router();
const { getUsers, getCurrentUser, updateUser, createUser, createBasicUser } = require('../controllers/users');
const { authorize } = require('../middlewares/auth');


router.get('/me', authorize, getCurrentUser);
router.get('/', authorize, getUsers);
router.patch('/me', authorize, updateUser);
router.post('/', createBasicUser);
// router.post('/users/basic', createBasicUser);


module.exports = router;
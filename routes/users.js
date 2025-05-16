const router = require('express').Router();
const { getUsers, getCurrentUser, updateUser } = require('../controllers/users');
const { authorize } = require('../middlewares/auth');


router.get('/me', authorize, getCurrentUser);
router.get('/', authorize, getUsers);
router.patch('/me', authorize, updateUser);
// router.post('/', createUser);



module.exports = router;
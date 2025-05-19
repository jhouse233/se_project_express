const router = require('express').Router();
const { getCurrentUser, updateUser } = require('../controllers/users');
const { authorize } = require('../middlewares/auth');


router.get('/me', authorize, getCurrentUser);
router.patch('/me', authorize, updateUser);



module.exports = router;
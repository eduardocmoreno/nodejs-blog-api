const { Router } = require('express');
const router = Router();
const { userSignup, userLogin, userLogout } = require('../controllers/authController');

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/logout', userLogout);

module.exports = router;
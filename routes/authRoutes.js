const { Router } = require('express');
const router = Router();
const { signup_post, login_post, logout_get } = require('../controllers/authController');

router.post('/signup', signup_post);
router.post('/login', login_post);
router.get('/logout', logout_get);

module.exports = router;
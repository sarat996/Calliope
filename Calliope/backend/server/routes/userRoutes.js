const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const { signupUser, signinUser, userProfile } = require('../controllers/userController');

router.post('/signup', signupUser);

router.post('/signin', signinUser);

router.post('/userprofile', [auth], userProfile);

module.exports = router;
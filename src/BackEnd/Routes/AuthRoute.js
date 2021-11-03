const express = require('express');
const router = express.Router();

const AuthController = require('../Controllers/AuthController');

// Authorization
router.post('/register' , AuthController.register);
router.post('/login' , AuthController.login);

// Refresh the token with the refresh token when the token is expired
router.post('/refresh' , AuthController.refresh);



module.exports = router
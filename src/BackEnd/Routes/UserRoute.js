const express = require('express');
const router = express.Router();

const UserController = require('../Controllers/UserController');
const Authenticate = require('../Middleware/Authenticate');

//User
router.get('/index' , Authenticate, UserController.index);
router.post('/show' , Authenticate, UserController.show);
router.get('/show/:Username' , Authenticate, UserController.show_spec);
router.post('/create' , Authenticate, UserController.create);
router.post('/update' , Authenticate, UserController.update);
router.post('/update/:Username' , Authenticate, UserController.topup);
router.post('/remove' , Authenticate, UserController.remove);



module.exports = router;
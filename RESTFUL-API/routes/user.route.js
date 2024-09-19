const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.post('/register', userController.register);
router.get('/', userController.getUserDetail);
router.put('/', userController.updateUser);
router.put('/password', userController.updatePassword);

module.exports = router;
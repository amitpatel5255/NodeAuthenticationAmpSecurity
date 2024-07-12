const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/auth');

router.get('/users', authController.verifyToken, userController.getAllUsers);
router.post('/users', authController.verifyToken, userController.createUser);
router.get('/users/:id', authController.verifyToken, userController.getUser);
router.put('/users/:id', authController.verifyToken, userController.updateUser);
router.delete('/users/:id', authController.verifyToken, userController.deleteUser);

module.exports = router;

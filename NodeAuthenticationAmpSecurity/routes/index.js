// routes/index.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const userController = require('../controllers/userController');

router.get('/', (req, res) => res.render('index'));

router.get('/register', (req, res) => res.render('register'));
router.post('/register', authController.register);

router.get('/login', (req, res) => res.render('login'));
router.post('/login', authController.login);

router.get('/dashboard', authController.verifyToken, (req, res) => res.render('dashboard', { user: req.user }));

router.get('/users', authController.verifyToken, userController.getAllUsers);
router.post('/users', authController.verifyToken, userController.createUser);
router.get('/users/:id', authController.verifyToken, userController.getUser);
router.put('/users/:id', authController.verifyToken, userController.updateUser);
router.delete('/users/:id', authController.verifyToken, userController.deleteUser);
router.get('/logout', authController.logout);
router.get('/logoutAll', authController.verifyToken, authController.logoutAllDevices);

module.exports = router;

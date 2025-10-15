const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authenticate, userController.getProfile);
router.put('/me', authenticate, userController.updateProfile);
router.put('/me/password', authenticate, userController.changePassword);
router.get('/', authenticate, authorize(['admin']), userController.listUsers);
router.get('/:id', authenticate, authorize(['admin']), userController.getUserById);
router.put('/:id/role', authenticate, authorize(['admin']), userController.updateUserRole);
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

module.exports = router;
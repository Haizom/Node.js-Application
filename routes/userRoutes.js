const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/add_user', userController.addUser);
router.get('/get_user/:email', userController.getUser);
router.put('/update_user/:email', userController.updateUser);
router.delete('/delete_user/:email', userController.deleteUser);

module.exports = router;
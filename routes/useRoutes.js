const express = require('express');
const { registerUser,updateUser,DeleteUser } = require('../controllers/userController');
const { validateUser } = require('../middleware/validate');

const router = express.Router();

router.post('/register', validateUser, registerUser);
router.put("/:id",updateUser);
router.delete("/:id",DeleteUser);
module.exports = router;

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { login, register } = require('../controllers/authController');
const upload = require('../config/upload'); 

router.post("/login", login);
router.post("/register", upload.single('photo'), register); 

module.exports = router;

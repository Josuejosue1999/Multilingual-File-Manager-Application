const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Route POST pour l'enregistrement
router.post('/register', registerUser);

// Route POST pour la connexion
router.post('/login', loginUser);

module.exports = router;

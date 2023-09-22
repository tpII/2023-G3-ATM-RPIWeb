const express = require('express');
const router = express.Router();

// Importar controlador
const UserController = require('../controllers/userController');

// Definir rutas para las operaciones CRUD
router.get('/count', UserController.getUserCount)

// Atributo público
module.exports = router;
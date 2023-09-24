const express = require('express');
const router = express.Router();

// Importar controlador
const controller = require('../controllers/userController');

// Definir rutas para las operaciones CRUD
router.get('/count', controller.getCount)
router.get('/all', controller.getUsers)
router.post('/adduser', controller.postUser)
// Atributo público
module.exports = router;
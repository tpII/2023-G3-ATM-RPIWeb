const express = require('express');
const router = express.Router();

// Importar controlador
const controller = require('../controllers/moveController');

// Definir rutas para las operaciones CRUD
router.get('/count', controller.getCount)

// Atributo público
module.exports = router;
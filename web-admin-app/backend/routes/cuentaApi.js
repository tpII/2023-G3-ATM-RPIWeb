const express = require('express');
const router = express.Router();

// Importar controlador
const controller = require('../controllers/cuentaController');

// Definir rutas para las operaciones CRUD
router.get('/monto/:tarjeta', controller.getMonto)

// Atributo público
module.exports = router;
const express = require('express');
const router = express.Router();

// Importar controlador
const controller = require('../controllers/cuentaController');

// Definir rutas para las operaciones CRUD
router.get('/monto/:tarjeta', controller.getMonto)
router.post('/ingreso', controller.ingresarMonto)

// Atributo público
module.exports = router;
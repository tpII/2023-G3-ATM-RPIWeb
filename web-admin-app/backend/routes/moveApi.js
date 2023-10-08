const express = require('express');
const router = express.Router();

// Importar controlador
const controller = require('../controllers/moveController');

// Definir rutas para las operaciones CRUD
router.get('/count', controller.getCount)
router.get('/all', controller.getAll)
router.post('/add', controller.post)
router.delete('/delete/:id', controller.delete)

// Atributo público
module.exports = router;
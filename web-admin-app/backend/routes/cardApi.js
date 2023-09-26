const express = require('express');
const router = express.Router();

// Importar controlador
const controller = require('../controllers/cardController');

// Definir rutas para las operaciones CRUD
router.get('/count', controller.getCount)
router.get('/all', controller.getCards)
router.post('/addcard', controller.postCard)
router.patch('/banear/:id', controller.banearTarjeta)
router.patch('/desbanear/:id', controller.desbanearTarjeta)

// Atributo público
module.exports = router;
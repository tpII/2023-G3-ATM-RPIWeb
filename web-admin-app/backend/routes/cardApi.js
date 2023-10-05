const express = require('express');
const router = express.Router();

// Importar controlador
const controller = require('../controllers/cardController');

// Definir rutas para las operaciones CRUD
router.get('/count', controller.getCount)
router.get('/all', controller.getCards)
router.post('/addcard', controller.postCard)
router.patch('/ban/:id', controller.banearTarjeta)
router.patch('/unban/:id', controller.desbanearTarjeta)
router.delete('/delete/:id', controller.deleteCard)

// Atributo público
module.exports = router;
// Importar modelo
const model = require('../models/card');

// Definir controlador (funciones disponibles)
const controller = {

    // Devuelve el número de usuarios registrados
    getCount: async(req, res) => {
        c = await model.countDocuments({});
        res.json({count: c})
    }
}

module.exports = controller;
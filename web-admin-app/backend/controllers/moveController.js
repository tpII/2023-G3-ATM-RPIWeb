// Importar modelo
const model = require('../models/move');

// Definir controlador (funciones disponibles)
const controller = {

    // Devuelve el número de transacciones registradas
    getCount: async(req, res) => {
        c = await model.countDocuments({});
        res.json({count: c})
    },

    // Retorna todas las transacciones registradas, con nombres de origen y destino
    getAll: async(req, res) => {
        moves = await model.find().populate(['emisorId', 'receptorId']);
        res.json({movimientos: moves})
    },

    // Inserción
    post: async(req, res) => {
        const {emisorId, receptorId, monto} = req.body

        const doc = new model({
            emisorId: emisorId,
            receptorId: receptorId,
            monto: monto
        })

        const saved = await doc.save()
        if (!saved) res.status(400).json({message: "No se puede insertar en la base de datos"})
        res.json(saved)
    }
}

module.exports = controller;
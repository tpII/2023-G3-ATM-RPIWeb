// Importar modelo
const model = require('../models/move');
const cuentaModel = require('../models/cuenta')

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
        return saved ? res.json(saved) : res.status(400).json({message: "Error al insertar"})
    },

    delete: async(req, res) => {
        const id = req.params.id
        if (!id) return res.status(400).json({message: "ID no especificado"})

        const doc = await model.findById(id)
        if (!doc) return res.status(400).json({message: "ID no encontrado en la base de datos"})

        const result = await doc.deleteOne()
        return result ? res.json(result) : res.status(400).json({message: "Error al borrar"}) 
    },

    getCbuInfo: async(req, res) => {
        const cbuTarget = req.params.cbu
        if (!cbuTarget) return res.status(400).json({message: "CBU no especificado"})

        const cuenta = await cuentaModel.findOne({cbu: cbuTarget}).populate(['cliente'])
        if (!cuenta) return res.status(400).json({message: "No existe cuenta asociada a dicho CBU"})

        return res.json(cuenta.cliente.nombre)
    }
}

module.exports = controller;
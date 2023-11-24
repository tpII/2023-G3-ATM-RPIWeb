// Importar modelo
const model = require('../models/cuenta');
const tarjetaModel = require('../models/card')

// Definir controlador (funciones disponibles)
const controller = {

    // Devuelve el monto de la cuenta asociada al ID de tarjeta indicado
    getMonto: async(req, res) => {
        const tarjetaId = req.params.tarjeta
        if (!tarjetaId) return res.status(400).json({message: "ID de tarjeta no especificado"})

        const monto = await model.findOne({tarjeta: tarjetaId}, 'monto -_id')
        return monto ? res.json(monto) : res.status(400).json({message: "No se encontró la cuenta"})
    },

    // Suma el monto especificado a la cuenta asociada a la tarjeta indicada
    ingresarMonto: async(req, res) => {
        const {tarjetaNro, monto} = req.body
        if (!tarjetaNro || !monto) return res.status(400).json({message: "Parámetros no especificados"})

        // Para reducir el número de consultas, el cajero puede tener el ID de cuenta
        const tarjeta = await tarjetaModel.findOne({nro: tarjetaNro})
        const cuenta = await model.findOne({tarjeta: tarjeta._id})
        const nuevoMonto = parseInt(cuenta.monto) + parseInt(monto)

        const doc = await model.findByIdAndUpdate(cuenta._id, {monto: nuevoMonto}, {new: true})
        return doc ? res.json({monto: doc.monto}) : res.status(400).json({message: "Error al actualizar monto"})
    },

    // Resta el monto especificado a la cuenta asociada a la tarjeta indicada
    retirarMonto: async(req, res) => {
        const {tarjetaNro, monto} = req.body
        if (!tarjetaNro || !monto) return res.status(400).json({message: "Parámetros no especificados"})

        const tarjeta = await tarjetaModel.findOne({nro: tarjetaNro})
        const cuenta = await model.findOne({tarjeta: tarjeta._id})
        const nuevoMonto = parseInt(cuenta.monto) - parseInt(monto)
        if (nuevoMonto < 0) return res.status(400).json({message: "Error en retiro saldo mayor al actual"})

        const doc = await model.findByIdAndUpdate(cuenta._id, {monto: nuevoMonto}, {new: true})
        return doc ? res.json({monto: doc.monto}) : res.status(400).json({message: "Error al actualizar monto"})
    },

    getLastCBU: async(req, res) => {
        const lastCBU = await model.find().sort({ cbu: -1}).limit(1)
        return lastCBU ? res.json({cbu: lastCBU}) : res.json({cbu: 0})
    }

}

module.exports = controller;
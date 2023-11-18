// Importar modelo
const model = require('../models/cuenta');
const tarjetaModel = require('../models/card')

// Definir controlador (funciones disponibles)
const controller = {

    // Devuelve el monto de la cuenta asociada al número de tarjeta indicado
    getMonto: async(req, res) => {
        const tarjetaNro = req.params.tarjeta

        const tarjeta = await tarjetaModel.findOne({nro: tarjetaNro})
        const monto = await model.findOne({tarjeta: tarjeta._id}, 'monto -_id')
        return monto ? res.status(200).json(monto) : res.status(400).json({message: "No se encontró cuenta"})
    },

    // Suma el monto especificado a la cuenta asociada a la tarjeta indicada
    ingresarMonto: async(req, res) => {
        const {tarjetaNro, monto} = req.body

        const tarjeta = await tarjetaModel.findOne({nro: tarjetaNro})
        const cuenta = await model.findOne({tarjeta: tarjeta._id})
        const nuevoMonto = parseInt(cuenta.monto) + parseInt(monto)

        const doc = await model.findByIdAndUpdate(cuenta._id, {monto: nuevoMonto}, {new: true})
        return doc ? res.status(200).json({monto: doc.monto}) : res.status(400).json({message: "Error al actualizar monto"})
    },

    // Resta el monto especificado a la cuenta asociada a la tarjeta indicada
    retirarMonto: async(req, res) => {
        const {tarjetaNro, monto} = req.body

        const tarjeta = await tarjetaModel.findOne({nro: tarjetaNro})
        const cuenta = await model.findOne({tarjeta: tarjeta._id})
        const nuevoMonto = parseInt(cuenta.monto) - parseInt(monto)
        if (nuevoMonto < 0) return res.status(400).json({message: "Error en retiro saldo mayor al actual"})

        const doc = await model.findByIdAndUpdate(cuenta._id, {monto: nuevoMonto}, {new: true})
        return doc ? res.status(200).json({monto: doc.monto}) : res.status(400).json({message: "Error al actualizar monto"})
    },

    getLastCBU: async(req, res) => {
        const lastCBU = await model.find().sort({ cbu: -1}).limit(1)
        return lastCBU ? res.status(200).json({cbu: lastCBU}) : res.status(200).json({cbu: 0})
    }

}

module.exports = controller;
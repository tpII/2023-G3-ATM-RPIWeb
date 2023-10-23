// Importar modelo
const model = require('../models/cuenta');
const tarjetaModel = require('../models/card')

// Definir controlador (funciones disponibles)
const controller = {

    getMonto: async(req, res) => {
        const tarjetaNro = req.params.tarjeta

        const tarjeta = await tarjetaModel.findOne({nro: tarjetaNro})
        const monto = await model.findOne({tarjeta: tarjeta._id}, 'monto -_id')
        return monto ? res.status(200).json(monto) : res.status(400).json({message: "No se encontró cuenta"})
    },

    ingresarMonto: async(req, res) => {
        const {tarjetaNro, monto} = req.body

        const tarjeta = await tarjetaModel.findOne({nro: tarjetaNro})
        const cuenta = await model.findOne({tarjeta: tarjeta._id})
        const nuevoMonto = parseInt(cuenta.monto) + parseInt(monto)

        const doc = await model.findByIdAndUpdate(cuenta._id, {monto: nuevoMonto}, {new: true})
        return doc ? res.status(200).json({monto: doc.monto}) : res.status(400).json({message: "Error al actualizar monto"})
    },

    retirarMonto: async(req, res) => {
        const {tarjetaNro, monto} = req.body

        const tarjeta = await tarjetaModel.findOne({nro: tarjetaNro})
        const cuenta = await model.findOne({tarjeta: tarjeta._id})
        const nuevoMonto = parseInt(cuenta.monto) - parseInt(monto)
        if (nuevoMonto< 0 ){
            return res.status(400).json({message: "Error en retiro saldo mayor al actual"})
        }

        const doc = await model.findByIdAndUpdate(cuenta._id, {monto: nuevoMonto}, {new: true})
        return doc ? res.status(200).json({monto: doc.monto}) : res.status(400).json({message: "Error al actualizar monto"})
    },

    replaceMonto: async(req, res) => {
        const cuentaId = req.params.id
        const nuevo_monto = req.params.monto

        const cuenta = await model.findById(cuentaId);
        if (!cuenta) return res.status(400).json({message: "No se encontró la cuenta en el sistema"})

        const doc = await model.findByIdAndUpdate(cuentaId, {monto: nuevo_monto}, {new: true})
        const result = await doc.save();
        return result ? res.json(result) : res.status(400).json({message: "Error al actualizar"});
    }

}

module.exports = controller;
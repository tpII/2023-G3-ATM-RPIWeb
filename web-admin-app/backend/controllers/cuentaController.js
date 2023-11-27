// Importar modelo
const model = require('../models/cuenta')

// Definir controlador (funciones disponibles)
const controller = {

    // Devuelve el número de cuentas registradas
    getCount: async(req, res) => {
        c = await model.countDocuments({});
        res.json({count: c})
    },

    // Retorna todas las transacciones registradas, con nombres de origen y destino
    getAll: async(req, res) => {
        docs = await model.find().populate(['cliente']);
        res.json({list: docs})
    },

    // Devuelve el monto de la cuenta asociada al ID de tarjeta indicado
    getMonto: async(req, res) => {
        const tarjetaId = req.params.tarjeta
        if (!tarjetaId) return res.status(400).json({message: "ID de tarjeta no especificado"})

        const monto = await model.findOne({tarjeta: tarjetaId}, 'monto -_id')
        return monto ? res.json(monto) : res.status(400).json({message: "No se encontró la cuenta"})
    },

    // Suma el monto especificado a la cuenta asociada a la tarjeta indicada
    ingresarMonto: async(req, res) => {
        const {tarjetaId, monto} = req.body
        if (!tarjetaId || !monto) return res.status(400).json({message: "Parámetros no especificados"})

        const cuenta = await model.findOne({tarjeta: tarjetaId})
        const nuevoMonto = parseInt(cuenta.monto) + parseInt(monto)

        const doc = await model.findByIdAndUpdate(cuenta._id, {monto: nuevoMonto}, {new: true})
        return doc ? res.json({monto: doc.monto}) : res.status(400).json({message: "Error al actualizar monto"})
    },

    // Resta el monto especificado a la cuenta asociada a la tarjeta indicada
    retirarMonto: async(req, res) => {
        const {tarjetaId, monto} = req.body
        if (!tarjetaId || !monto) return res.status(400).json({message: "Parámetros no especificados"})

        const cuenta = await model.findOne({tarjeta: tarjetaId})
        const nuevoMonto = parseInt(cuenta.monto) - parseInt(monto)
        if (nuevoMonto < 0) return res.status(400).json({message: "El monto a extraer excede al saldo en cuenta"})

        const doc = await model.findByIdAndUpdate(cuenta._id, {monto: nuevoMonto}, {new: true})
        return doc ? res.json({monto: doc.monto}) : res.status(400).json({message: "Error al actualizar monto"})
    },

    // Devuelve el próximo CBU disponible para crear una nueva cuenta
    getLastCBU: async(req, res) => {
        const lastCBU = await model.find().sort({ cbu: -1}).limit(1)
        return lastCBU ? res.json({cbu: lastCBU}) : res.json({cbu: 0})
    },

    // A partir de un CBU, devuelve el nombre del cliente asociado
    getCbuInfo: async(req, res) => {
        const tarjetaId = req.params.tarjetaId
        const cbuTarget = req.params.cbuTarget
        if (!tarjetaId || !cbuTarget) return res.status(400).json({message: "Parámetros no especificados"})

        // Encontrar cuenta destino a partir de CBU
        const cuentaDest = await model.findOne({cbu: cbuTarget}).populate(['cliente'])
        if (!cuentaDest) return res.status(400).json({message: "No existe una cuenta asociada a dicho CBU"})

        // Verificar que la cuenta origen y destino no sean la misma
        if (cuentaDest.tarjeta == tarjetaId) return res.status(400).json({message: "El CBU corresponde a tu propia cuenta"})
        return res.json(cuentaDest.cliente.nombre)
    },

}

module.exports = controller;
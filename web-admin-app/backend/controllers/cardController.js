// Importar modelo
const model = require('../models/card');
const cuentaModel = require('../models/cuenta')

// Definir controlador (funciones disponibles)
const controller = {

    // Devuelve el número de tarjetas registrados
    getCount: async(req, res) => {
        c = await model.countDocuments({});
        res.json({count: c})
    },

    // Devuelve todas las tarjetas registradas
    getCards: async(req, res) => {
        cards = await model.find();
        res.json({tarjetas: cards});
    },

    // Inserta una tarjeta en la db
    postCard: async(req,res)  => {
        const {clienteSeleccionado, nro, pin, fechavto,cvv} = req.body

        // Control de parámetros
        if (!clienteSeleccionado) return res.status(404).json({message:"Cliente no especificado"});

        const newCard = new model({
            cliente:clienteSeleccionado,
            nro:nro, //es el numero parseado de la raspberry pi
            pin:pin,
            fechavto:fechavto,
            cvv: cvv,
            ban: false,
        })
        const savedCard = await newCard.save()
        
        // También creamos la cuenta asociada
        const nuevaCuenta = new cuentaModel({
            cliente: clienteSeleccionado,
            tarjeta: savedCard._id,
            tipo: "Cuenta corriente en pesos",
            monto: 0.00
        })

        await nuevaCuenta.save()
        res.json(savedCard);
    },

    // Inserta una tarjeta con los datos elementales (desde cajero)
    getPin: async(req, res) => {
        const nro = req.params.nro
        if (!nro) return res.status(400).json({message: "Numero no especificado"})

        const pin = await model.findOne({nro: nro, ban: false}, 'pin -_id')
        return pin ? res.json(pin) : res.status(400).json({message: "Tarjeta no encontrada"})
    },

    // Setea en true el campo "ban" de la tarjeta indicada por id
    banearTarjeta: async(req,res) => {
        const id = req.params.id
        if (!id) return res.status(400).json({message: "ID no especificado"})

        const tarjeta = await model.findById(id);
        if (!tarjeta) return res.status(400).json({message: "No se encontró la tarjeta en el sistema"})

        const doc = await model.findByIdAndUpdate(req.params.id, {ban: true}, { new: true });

        const result = await doc.save();
        return result ? res.json(result) : res.status(400).json({message: "Error al actualizar"});
    },

    // Setea en false el campo "ban" de la tarjeta indicada por id 
    desbanearTarjeta: async(req,res) => {
        const id = req.params.id
        if (!id) return res.status(400).json({message: "ID no especificado"})

        const tarjeta = await model.findById(id);
        if (!tarjeta) return res.status(400).json({message: "No se encontró la tarjeta en el sistema"})

        const doc = await model.findByIdAndUpdate(req.params.id, {ban: false}, { new: true });

        const result = await doc.save();
        return result ? res.json(result) : res.status(400).json({message: "Error al actualizar"});
    },

    // Elimina una tarjeta de manera permanente
    deleteCard: async(req, res) => {
        const id = req.params.id
        if (!id) return res.status(400).json({message: "ID no especificado"})

        const card = await model.findById(id)
        if (!card) return res.status(400).json({message: "ID no encontrado en la base de datos"})

        const result1 = await card.deleteOne()
        const cuenta = await cuentaModel.findOne({tarjeta: id})
        const result2 = await cuenta.deleteOne()
        return (result1 && result2) ? res.json(result) : res.status(400).json({message: "Error al borrar"}) 
    }
}

module.exports = controller;
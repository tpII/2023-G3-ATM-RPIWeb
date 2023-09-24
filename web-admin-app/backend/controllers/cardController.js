// Importar modelo
const model = require('../models/card');

// Definir controlador (funciones disponibles)
const controller = {

    // Devuelve el número de usuarios registrados
    getCount: async(req, res) => {
        c = await model.countDocuments({});
        res.json({count: c})
    },

    getCards: async(req, res) => {
        c = await model.find();
        res.json({tarjetas: c});
    },

    postCard: async(req,res)  => {
        const {clienteSeleccionado, nro, pin, fechavto,cvv} = req.body
        const newCard = new model({
            cliente:clienteSeleccionado,
            nro:nro, //es el numero parseado de la raspberry pi
            pin:pin,
            fechavto:fechavto,
            cvv: cvv,
            ban: false,
        })
        const savedCard = await newCard.save()
        res.json(savedCard);
        
    },

    banearTarjeta: async(req,res) => {
        let tarjeta = await model.findById(req.params.id).exec();
        if (!tarjeta) return res.status(404).json({message:"No se encontro la tarjeta en el sistema"});
        tarjeta = await model.findByIdAndUpdate(req.params.id, {
            cliente: tarjeta.cliente,
            nro: tarjeta.nro,
            pin: tarjeta.pin,
            fechavto: tarjeta.fechavto,
            cvv: tarjeta.cvv,
            ban: true
        }, { new: true });
        tarjeta = await tarjeta.save();
        if (!tarjeta) return res.status(404).json({message:"Ha ocurrido un error"});
        res.json(tarjeta);
    },

    desbanearTarjeta: async(req,res) => {
        let tarjeta = await model.findById(req.params.id).exec();
        if (!tarjeta) return res.status(404).json({message:"No se encontro la tarjeta en el sistema"});
        tarjeta = await model.findByIdAndUpdate(req.params.id, {
            cliente: tarjeta.cliente,
            nro: tarjeta.nro,
            pin: tarjeta.pin,
            fechavto: tarjeta.fechavto,
            cvv: tarjeta.cvv,
            ban: false
        }, { new: true });
        tarjeta = await tarjeta.save();
        if (!tarjeta) return res.status(404).json({message:"Ha ocurrido un error"});
        res.json(tarjeta);
    }
}

module.exports = controller;
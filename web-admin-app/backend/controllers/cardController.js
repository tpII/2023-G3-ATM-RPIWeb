// Importar modelo
const model = require('../models/card');

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

    // Setea en true el campo "ban" de la tarjeta indicada por id
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

    // Setea en false el campo "ban" de la tarjeta indicada por id 
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
// Importar modelo
const model = require('../models/card');

// Definir controlador (funciones disponibles)
const controller = {

    // Devuelve el número de usuarios registrados
    getCount: async(req, res) => {
        c = await model.countDocuments({});
        res.json({count: c})
    },

    postCard: async(req,res)  => {
        const {nro, pin, fechavto,cvv} = req.body
        const newCard = new model({
            nro:nro, //es el numero parseado de la raspberry pi
            pin:pin,
            fechavto:fechavto,
            cvv: cvv,
            ban: false
        })
        const savedCard = await newCard.save()
        res.json(savedCard);
        
    }
}

module.exports = controller;
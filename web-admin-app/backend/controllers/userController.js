// Importar modelo
const model = require('../models/user');

// Definir controlador (funciones disponibles)
const controller = {

    // Devuelve el número de usuarios registrados
    getCount: async(req, res) => {
        c = await model.countDocuments({});
        res.json({count: c})
    },

    getUsers: async(req, res) => {
        u = await model.find();
        res.json({Usuarios: u});
    },

    postUser: async(req,res)  => {
        const {nombre} = req.body
        const newUser = new model({
            nombre: nombre
        })
        const savedUser = await newUser.save()
        res.json(savedUser);
        
    },

    
}

module.exports = controller;
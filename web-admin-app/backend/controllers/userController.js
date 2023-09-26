// Importar modelo
const model = require('../models/user');

// Definir controlador (funciones disponibles)
const controller = {

    // Devuelve el número de usuarios registrados
    getCount: async(req, res) => {
        c = await model.countDocuments({});
        res.json({count: c})
    },

    // Devuelve todos los usuarios registrados
    getUsers: async(req, res) => {
        users = await model.find();
        res.json({Usuarios: users});
    },

    // Inserta un usuario en la db
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
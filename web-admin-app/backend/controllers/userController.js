// Importar modelo
const User = require('../models/user');

// Definir controlador (funciones disponibles)
const UserController = {

    // Devuelve el número de usuarios registrados
    getUserCount: async(req, res) => {
        c = await User.countDocuments({});
        res.json({count: c})
    }
}

module.exports = UserController;
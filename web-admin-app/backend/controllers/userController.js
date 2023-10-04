// Importar modelo
const model = require("../models/user");
const tarjetas = require("../models/card");

// Definir controlador (funciones disponibles)
const controller = {
  // Devuelve el número de usuarios registrados
  getCount: async (req, res) => {
    c = await model.countDocuments({});
    res.json({ count: c });
  },

  // Devuelve todos los usuarios registrados
  getUsers: async (req, res) => {
    // Usando aggregate() en lugar de find(), se puede realizar un "join" entre colecciones
    users = await model.aggregate().lookup({
        from: 'tarjetas',
        localField: '_id',
        foreignField: 'cliente',
        as: 'tarjetas'
    });
    res.json({ Usuarios: users });
  },

  // Inserta un usuario en la db
  postUser: async (req, res) => {
    const { nombre } = req.body;
    const newUser = new model({
      nombre: nombre,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  },

  // Elimina un usuario de manera permanente
  deleteUser: async (req, res) => {
    const id = req.params.id;

    try {
      let user = await model.findById(id).exec();
      if (!user) return res.status(400).json({ message: "ID no encontrado" });

      let tarjetas_asociadas = await tarjetas.findOne({ cliente: id });
      if (tarjetas_asociadas)
        return res.status(400).json({
          message:
            "No se puede eliminar usuario por poseer tarjetas a su nombre",
        });

      result = await model.deleteOne({ _id: id });
      return result ? res.json(result) : res.status(400);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = controller;

const mongoose = require('mongoose')

// Definición de esquemas (campos de los documentos)
const schema = new mongoose.Schema({
  nombre: String
});

// Crea un modelo a partir del esquema
const User = mongoose.model("Cliente", schema);

module.exports = User;

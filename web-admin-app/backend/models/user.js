const mongoose = require('mongoose')

// Definición de esquemas (campos de los documentos)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// Crea un modelo a partir del esquema
const User = mongoose.model("User", userSchema);

module.exports = User;

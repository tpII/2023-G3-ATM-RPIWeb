const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId

// Definición de esquemas (campos de los documentos)
const schema = new mongoose.Schema({
  cliente: ObjectId,
  tarjeta: ObjectId,
  tipo: String,
  monto: Number,
  cbu: Number
});

// Crea un modelo a partir del esquema
const Cuenta = mongoose.model("Cuentas", schema);

module.exports = Cuenta;

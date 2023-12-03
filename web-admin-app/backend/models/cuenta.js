const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId

// Definición de esquemas (campos de los documentos)
const schema = new mongoose.Schema({
  cliente: {type: ObjectId, ref: "Cliente"},
  tarjeta: ObjectId,
  tipo: String,
  monto: Number,
  cbu: Number
});

// Crea un modelo a partir del esquema
const Cuenta = mongoose.model("Cuenta", schema);

module.exports = Cuenta;

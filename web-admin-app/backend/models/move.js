const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId

// Definición de esquemas (campos de los documentos)
const schema = new mongoose.Schema({
  emisorId: ObjectId,
  receptorId: ObjectId,
  monto: Number
});

// Crea un modelo a partir del esquema
const Move = mongoose.model("Transacciones", schema);

module.exports = Move;

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId

// Definición de esquemas, con referencias a clientes
const schema = new mongoose.Schema({
  emisorId: {type: ObjectId, ref: "Cliente"},
  receptorId: {type: ObjectId, ref: "Cliente"},
  monto: Number
});

// Crea un modelo a partir del esquema
const Move = mongoose.model("Transferencia", schema);

module.exports = Move;

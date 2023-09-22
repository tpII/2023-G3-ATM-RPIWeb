const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId

// Definición de esquemas (campos de los documentos)
const schema = new mongoose.Schema({
  userId: ObjectId,
  lastNumbers: Number
});

// Crea un modelo a partir del esquema
const Card = mongoose.model("Tarjeta", schema);

module.exports = Card;

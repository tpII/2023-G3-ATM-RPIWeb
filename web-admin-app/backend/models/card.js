const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId

// Definición de esquemas (campos de los documentos)
const schema = new mongoose.Schema({
  cliente: ObjectId,
  nro:String, //es el numero parseado de la raspberry pi
  pin:Number,
  fechavto:Date,
  cvv: Number,
  ban: Boolean
});

// Crea un modelo a partir del esquema
const Card = mongoose.model("Tarjeta", schema);

module.exports = Card;

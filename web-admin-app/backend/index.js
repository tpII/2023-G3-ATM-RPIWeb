const mongoose = require("mongoose");

// Conexión a la base de datos local
mongoose.connect('mongodb://127.0.0.1:27017/atm-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB'))
db.once('open', () => {
  console.log("Conectado correctamente a la base de datos!")
})


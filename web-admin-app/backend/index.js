const mongoose = require("mongoose");
const express = require('express');

// CORS para evitar error 'Access-Control-Allow-Origin'
var cors = require('cors');       

// Inicialización Express
const app = express();
const PORT = process.env.PORT || 2000;

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

// Importar APIs
const userApi = require('./routes/userApi')
const cardApi = require('./routes/cardApi')
const moveApi = require('./routes/moveApi')
const cuentaApi = require('./routes/cuentaApi')

app.use(express.json());
app.use(cors())
app.use((req, _, next) => {console.log('API Request: ', req.url); next()})
app.use('/api/users', userApi);
app.use('/api/cards', cardApi);
app.use('/api/moves', moveApi);
app.use('/api/cuentas', cuentaApi);

// Quedarse a la escucha...
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

// Importaciones de librerias
const mongoose = require("mongoose");
const express = require("express");
const mqtt = require("mqtt");
const http = require('http')
const cors = require("cors"); // CORS para evitar error 'Access-Control-Allow-Origin'
const { Server } = require("socket.io");

// Importaciones de APIs
const userApi = require("./routes/userApi");
const cardApi = require("./routes/cardApi");
const moveApi = require("./routes/moveApi");
const cuentaApi = require("./routes/cuentaApi");

// Puertos
const BACKEND_PORT = process.env.PORT || 2000;
const FRONTEND_PORT = 3000
const MQTT_PORT = 1883;
const DB_PORT = 27017;

// Otras constantes
const MQTT_BROKER_IP = "127.0.0.1";
const LOCALHOST = "127.0.0.1";
const DB_NAME = "atm-db";

// Variables globales
let efectivo = 0.00;
let miSocket;

// Configuración MQTT y base de datos local
const mqttClient = mqtt.connect(`mqtt://${MQTT_BROKER_IP}:${MQTT_PORT}`);

mqttConfig();
dbConfig();

// Inicialización de Express
const app = express();
app.use(express.json());
app.use(cors());

// Inicialización WebSocket
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: `http://localhost:${FRONTEND_PORT}`,
    methods: ['GET', 'POST']
  }
})

io.on('connection', socket => {
  console.log("Usuario conectado al socket: ", socket.id)
  miSocket = socket
})

// Middleware
app.use((req, res, next) => {
  console.log("API Request: ", req.url);
  next();
});

// APIs Mongoose
app.use("/api/users", userApi);
app.use("/api/cards", cardApi);
app.use("/api/moves", moveApi);
app.use("/api/cuentas", cuentaApi);

// APIs MQTT
app.use("/api/cash", (req, res) => {
  res.json({value: efectivo})
})

// Backend listening
server.listen(BACKEND_PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${BACKEND_PORT}`);
});

// ---- CONFIGURACIÓN MQTT -------------------------------------------

function mqttConfig() {
  

  mqttClient.on("connect", () => {
    console.log("Conectado correctamente al broker MQTT");

    // Suscribirse al tema
    mqttClient.subscribe("cajero/efectivo");
  });

  // Al recibir publicación
  mqttClient.on("message", (topic, message) => {
    console.log(`Mensaje recibido en el tema ${topic}: ${message.toString()}`);

    // Actualizar efectivo
    if (topic === "cajero/efectivo"){
      efectivo = parseFloat(message)
      
      miSocket?.emit('cash', {value: efectivo})
    }
  });
};

// ---- CONFIGURACIÓN BASE DE DATOS -------------------------------------------

function dbConfig() {
  mongoose.connect(`mongodb://${LOCALHOST}:${DB_PORT}/${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Error de conexión a MongoDB"));
  db.once("open", () => {
    console.log("Conectado correctamente a la base de datos!");
  });
};

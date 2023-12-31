// Importaciones de librerias
const mongoose = require("mongoose");
const express = require("express");
const mqtt = require("mqtt");
const http = require("http");
const cors = require("cors"); // CORS para evitar error 'Access-Control-Allow-Origin'
const { Server } = require("socket.io");
const axios = require('axios')

// Importaciones de APIs
const userApi = require("./routes/userApi");
const cardApi = require("./routes/cardApi");
const moveApi = require("./routes/moveApi");
const cuentaApi = require("./routes/cuentaApi");

// Puertos
const BACKEND_PORT = process.env.PORT || 2000;
const FRONTEND_PORT = 3000;
const MQTT_PORT = 1883;
const DB_PORT = 27017;

// Otras constantes
const MQTT_BROKER_IP = "127.0.0.1";
const LOCALHOST = "127.0.0.1";
const DB_NAME = "atm-db";

// Variables globales
let cajero_activo = false
let limites_extraccion = [0.0, 0.0]
let efectivo = 0.0;
let mqttClient;
let miSocket;

// Inicialización de Express
const app = express();
app.use(express.json());
app.use(cors());

// Configuración MQTT y base de datos local
mqttConfig();
dbConfig();

// Inicialización WebSocket
const server = http.createServer(app);
webSocketConfig();

// Middleware
app.use((req, res, next) => {
  console.log("API Request: ", req.url, req.method);
  next();
});

// APIs Mongoose
app.use("/api/users", userApi);
app.use("/api/cards", cardApi);
app.use("/api/moves", moveApi);
app.use("/api/cuentas", cuentaApi);

// APIs MQTT
app.get("/api/status", (req, res) => res.json({value: cajero_activo}))
app.get("/api/cash", (req, res) => res.json({ value: efectivo }))

// Carga de límites de extracción
app.get("/api/settings/limites", (req, res) => res.json({
  min: limites_extraccion[0],
  max: limites_extraccion[1]
}))

// Modificación de efectivo al cajero
app.post("/api/cash", (req, res) => {
  const value = req.body.value
  if (!value) return res.status(400).json({message: "Valor no especificado"})
  if (!mqttClient) return res.status(400).json({message: "Cliente MQTT no inicializado"})
  mqttClient.publish("cajero/efectivo", value.toString())
  return res.status(200).json({message: "Efectivo actualizado"})
})

// Envío de nuevos límites de extracción
app.post("/api/settings/limites", (req, res) => {
  const min = req.body.min
  const max = req.body.max
  if (!min || !max) return res.status(400).json({message: "Montos no especificados"})
  if (!mqttClient) return res.status(400).json({message: "Cliente MQTT no inicializado"})
  mqttClient.publish("cajero/limites", min.toString() + "-" + max.toString())
  return res.status(200).json({message: "Límites actualizados con éxito"})
})

// Instancia Axios
const miApi = axios.create({
  baseURL: "http://127.0.0.1:2000/api",
  timeout: 5000,
  headers: {'Content-Type': 'application/json'}
})

// Backend listening
server.listen(BACKEND_PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${BACKEND_PORT}`);
});

// ---- CONFIGURACIÓN MQTT -------------------------------------------

function mqttConfig() {
  mqttClient = mqtt.connect(`mqtt://${MQTT_BROKER_IP}:${MQTT_PORT}`);
  const CASH_TOPIC = "cajero/efectivo"
  const REQUEST_PIN_TOPIC = "cajero/pin_request"
  const RESPONSE_PIN_TOPIC = "cajero/pin_response"
  const STATUS_TOPIC = "cajero/status"
  const MONTO_REQUEST_TOPIC = "cajero/monto_request"
  const MONTO_RESPONSE_TOPIC = "cajero/monto_response"
  const INGRESO_REQUEST_TOPIC = "cajero/ingreso_request"
  const INGRESO_RESPONSE_TOPIC = "cajero/ingreso_response"
  const RETIRO_REQUEST_TOPIC = "cajero/retiro_request"
  const RETIRO_RESPONSE_TOPIC = "cajero/retiro_response"
  const CBU_REQUEST_TOPIC = "cajero/cbu_request"
  const CBU_RESPONSE_TOPIC = "cajero/cbu_response"
  const TRANSFER_REQUEST_TOPIC = "cajero/transfer_request"
  const TRANSFER_RESPONSE_TOPIC = "cajero/transfer_response"
  const LIMITES_TOPIC = "cajero/limites"

  mqttClient.on("connect", () => {
    console.log("Conectado correctamente al broker MQTT");
    mqttClient.subscribe(CASH_TOPIC)
    mqttClient.subscribe(REQUEST_PIN_TOPIC)
    mqttClient.subscribe(STATUS_TOPIC)
    mqttClient.subscribe(MONTO_REQUEST_TOPIC)
    mqttClient.subscribe(INGRESO_REQUEST_TOPIC)
    mqttClient.subscribe(RETIRO_REQUEST_TOPIC)
    mqttClient.subscribe(CBU_REQUEST_TOPIC)
    mqttClient.subscribe(TRANSFER_REQUEST_TOPIC)
    mqttClient.subscribe(LIMITES_TOPIC)
  });

  // Al recibir publicación
  mqttClient.on("message", (topic, message) => {
    console.log(`Mensaje recibido en el tema ${topic}: ${message.toString()}`);

    // Filtrar por tema
    if (topic === CASH_TOPIC) {
      efectivo = parseFloat(message);
      miSocket?.emit("cash", { value: efectivo });
    } 
    
    // PIN Request: se devuelve "PIN-ID" correspondiente al número de tarjeta indicado
    // En caso de error, se devuelve el caracter "-" seguido del mensaje de error
    else if (topic === REQUEST_PIN_TOPIC) {
      miApi.get(`cards/pin/${message}`)
        .then(res => mqttClient.publish(RESPONSE_PIN_TOPIC, res.data.pin.toString() + "-" + res.data.tarjetaId.toString()))
        .catch(err => mqttClient.publish(RESPONSE_PIN_TOPIC, "-" + err.response.data.message))
    } 
    
    else if (topic === STATUS_TOPIC){
      cajero_activo = message.toString() === "1"
      miSocket?.emit('status', {value: cajero_activo})
    } 
    
    // Consulta de saldo: se devuelve monto en cuenta para el ID de tarjeta indicado
    else if (topic === MONTO_REQUEST_TOPIC){
      miApi.get(`cuentas/monto/${message}`)
        .then(res => mqttClient.publish(MONTO_RESPONSE_TOPIC, res.data.monto.toString()))
        .catch(err => mqttClient.publish(MONTO_RESPONSE_TOPIC, "-2"))
    } 
    
    // Depósito: se recibe cardID-monto y se devuelve el saldo actualizado de la cuenta
    else if (topic === INGRESO_REQUEST_TOPIC){
      const partes = message.toString().split("-")
      miApi.post("cuentas/ingreso", {tarjetaId: partes[0], monto: partes[1]})
        .then(res => mqttClient.publish(INGRESO_RESPONSE_TOPIC, res.data.monto.toString()))
        .catch(err => mqttClient.publish(INGRESO_RESPONSE_TOPIC, "-2"))
    } 
    
    // Retiros: se recibe cardID-monto y se devuelve el saldo actualizado de la cuenta
    else if (topic === RETIRO_REQUEST_TOPIC){
      const partes = message.toString().split("-")
      miApi.post("cuentas/retiro", {tarjetaId: partes[0], monto: partes[1]})
        .then(res => mqttClient.publish(RETIRO_RESPONSE_TOPIC, res.data.monto.toString()))
        .catch(err => mqttClient.publish(RETIRO_RESPONSE_TOPIC, "-2"))
    } 
    
    // CBU Info: se recibe CBUdestino-cardIDorigen y se devuelve el nombre del cliente destino
    // En caso de error, se devuelve un mensaje con el prefijo "-"
    else if (topic === CBU_REQUEST_TOPIC){
      const partes = message.toString().split("-")
      miApi.get(`cuentas/cbu-info/${partes[0]}/${partes[1]}`)
        .then(res => mqttClient.publish(CBU_RESPONSE_TOPIC, res.data))
        .catch(err =>  mqttClient.publish(CBU_RESPONSE_TOPIC, "-" + err.response.data.message))
    }

    // Transferencia: se recibe cardID-CBUdestino-monto y se devuelve el saldo actualizado de origen
    else if (topic === TRANSFER_REQUEST_TOPIC){
      const partes = message.toString().split("-")
      miApi.post("moves/transferir", {tarjetaId: partes[0], cbuDestino: partes[1], monto: partes[2]})
        .then(res => mqttClient.publish(TRANSFER_RESPONSE_TOPIC, res.data.monto.toString()))
        .catch(err => mqttClient.publish(TRANSFER_RESPONSE_TOPIC, "-2"))
    }

    // Recepción de límites al iniciar cajero y en actualización exitosa
    else if (topic === LIMITES_TOPIC){
      const partes = message.toString().split("-")
      limites_extraccion = [parseInt(partes[0]), parseInt(partes[1])]
    }
  });
}

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
}

// ---- CONFIGURACIÓN WEB SOCKET -------------------------------------------------

function webSocketConfig() {
  const io = new Server(server, {
    cors: {
      origin: `http://localhost:${FRONTEND_PORT}`,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado al socket: ", socket.id);
    miSocket = socket;
  });
}

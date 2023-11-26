// Importar modelo
const model = require('../models/move');
const cuentaModel = require('../models/cuenta')
const cardModel = require('../models/card')

// Definir controlador (funciones disponibles)
const controller = {

    // Devuelve el número de transacciones registradas
    getCount: async(req, res) => {
        c = await model.countDocuments({});
        res.json({count: c})
    },

    // Retorna todas las transacciones registradas, con nombres de origen y destino
    getAll: async(req, res) => {
        moves = await model.find().populate(['emisorId', 'receptorId']);
        res.json({movimientos: moves})
    },

    // Inserción: transfiere cierto monto desde un origen (ID de tarjeta) hacia destino (CBU)
    postMove: async(req, res) => {
        const {tarjetaId, cbuDestino, monto} = req.body

        // Comprobación de parámetros presentes
        if (!tarjetaId || !cbuDestino || !monto){
            return res.status(400).json({message: "Parametros no especificados"})
        }

        const cuentaOrigen = await cuentaModel.findOne({tarjeta: tarjetaId})
        const cuentaDestino = await cuentaModel.findOne({cbu: cbuDestino})

        // Verificar si las cuentas coinciden
        if (cuentaOrigen.cbu.toString() == cbuDestino){
            return res.status(400).json({message: "CBU origen y destino coinciden"})
        }

        // Verificar si no excede saldo actual en origen
        if (cuentaOrigen.monto < monto){
            return res.status(400).json({message: "Saldo insuficiente en cuenta origen"})
        }

        // Actualizar cuentas
        cuentaDestino.monto = parseInt(cuentaDestino.monto) + parseInt(monto)
        cuentaOrigen.monto -= monto

        // Crear documento en coleccion moves
        const move = new model({
            emisorId: cuentaOrigen.cliente,
            receptorId: cuentaDestino.cliente,
            monto: monto
        })

        const saved1 = await cuentaDestino.save()
        const saved2 = await cuentaOrigen.save()
        const saved3 = await move.save()

        if (saved1 && saved2 && saved3) return res.json({monto: cuentaOrigen.monto})
        else res.status(400).json({message: "Error al realizar transferencia"})
    }
}

module.exports = controller;
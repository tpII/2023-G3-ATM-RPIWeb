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

    // Inserción
    post: async(req, res) => {
        const {emisorId, receptorId, monto} = req.body

        const doc = new model({
            emisorId: emisorId,
            receptorId: receptorId,
            monto: monto
        })

        const saved = await doc.save()
        return saved ? res.json(saved) : res.status(400).json({message: "Error al insertar"})
    },

    delete: async(req, res) => {
        const id = req.params.id
        if (!id) return res.status(400).json({message: "ID no especificado"})

        const doc = await model.findById(id)
        if (!doc) return res.status(400).json({message: "ID no encontrado en la base de datos"})

        const result = await doc.deleteOne()
        return result ? res.json(result) : res.status(400).json({message: "Error al borrar"}) 
    },

    transferir: async(req, res) => {
        const {tarjetaNro, cbuDestino, monto} = req.body
        console.log(tarjetaNro, cbuDestino, monto)
        
        if (!tarjetaNro || !cbuDestino || !monto) 
            return res.status(400).json({message: "Parametros no especificados"})

        const cuentaDestino = await cuentaModel.findOne({cbu: cbuDestino})
        const tarjetaOrigen = await cardModel.findOne({nro: tarjetaNro})
        const cuentaOrigen = await cuentaModel.findOne({tarjeta: tarjetaOrigen._id})

        // Verificar si las cuentas coinciden
        if (cuentaOrigen.cbu.toString() == cbuDestino){
            return res.status(400).json({message: "CBU destino es igual a origen"})
        }

        // Verificar si no excede saldo actual en origen
        if (cuentaOrigen.monto < monto){
            return res.status(400).json({message: "Saldo insuficiente en cuenta"})
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
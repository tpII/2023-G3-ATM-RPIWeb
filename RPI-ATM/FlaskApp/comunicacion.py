import Constantes
import Utils

class Suscriptor():

    def __init__(self, mef):
        self.mef = mef

    def suscribir_topicos(self, cliente):
        cliente.subscribe(Constantes.MAX_TOPIC)
        cliente.subscribe(Constantes.MIN_TOPIC)
        cliente.subscribe(Constantes.PIN_RESPONSE_TOPIC)
        cliente.subscribe(Constantes.MONTO_RESPONSE_TOPIC)
        cliente.subscribe(Constantes.INGRESO_RESPONSE_TOPIC)
        cliente.subscribe(Constantes.RETIRO_RESPONSE_TOPIC)
        cliente.subscribe(Constantes.CBU_RESPONSE_TOPIC)

    def procesar(self, topic, payload):
        if topic == Constantes.MIN_TOPIC:
            self.mef.limites.extraccion_min = Utils.try_parseInt(payload)
        elif topic == Constantes.MAX_TOPIC:
            self.mef.limites.extraccion_max = Utils.try_parseInt(payload)
            self.mef.limites.guardar()
        elif topic == Constantes.PIN_RESPONSE_TOPIC:
            self.mef.sesion.pin = Utils.try_parseInt(payload)
            self.mef.sesion.pin_respondido = True
        elif topic == Constantes.MONTO_RESPONSE_TOPIC:
            self.mef.montoCuenta = Utils.try_parseInt(payload)
        elif topic == Constantes.INGRESO_RESPONSE_TOPIC:
            self.mef.montoCuenta = Utils.try_parseInt(payload)
        elif topic == Constantes.RETIRO_RESPONSE_TOPIC:
            self.mef.montoCuenta = Utils.try_parseInt(payload)
        elif topic == Constantes.CBU_RESPONSE_TOPIC:
            self.mef.message = payload.decode("utf-8")
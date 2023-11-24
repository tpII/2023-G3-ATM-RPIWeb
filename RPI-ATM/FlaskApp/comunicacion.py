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
        cliente.subscribe(Constantes.TRANSFER_RESPONSE_TOPIC)

    def procesar(self, topic, payload):
        print("MQTT", topic, payload)

        if topic == Constantes.MIN_TOPIC:
            self.mef.limites.extraccion_min = Utils.try_parseInt(payload)
        elif topic == Constantes.MAX_TOPIC:
            self.mef.limites.extraccion_max = Utils.try_parseInt(payload)
            self.mef.limites.guardar()
        
        elif topic == Constantes.PIN_RESPONSE_TOPIC:
            # payload: PIN-ID o caracter "-" seguido del mensaje de error
            payload_str = payload.decode("utf-8")
            if payload_str.startswith("-"):
                self.mef.sesion.cancel(payload_str[1:])
            else:
                parts = payload_str.split("-")
                self.mef.sesion.set_pin(parts[0], parts[1])

        elif topic == Constantes.MONTO_RESPONSE_TOPIC:
            self.mef.montoCuenta = Utils.try_parseInt(payload)
        elif topic == Constantes.INGRESO_RESPONSE_TOPIC:
            self.mef.montoCuenta = Utils.try_parseInt(payload)
        elif topic == Constantes.RETIRO_RESPONSE_TOPIC:
            self.mef.montoCuenta = Utils.try_parseInt(payload)
        elif topic == Constantes.CBU_RESPONSE_TOPIC:
            self.mef.message = payload.decode("utf-8")
        elif topic == Constantes.TRANSFER_RESPONSE_TOPIC:
            self.mef.montoCuenta = Utils.try_parseInt(payload)
from Preferencias import LimitesConfig
from Estados import Estados
import Constantes

# Constantes
STATE_PAGES = ["menu", "waiting-card", "pin-ack", "pin-input", 
               "option-saldo", "option-ingreso", "option-retiro", 
               "error"]

class Sesion():

    # Constructor
    def __init__(self, id, text):
        self.id = id
        self.text = text
        self.pin = -1
        self.pin_respondido = False
        self.auth = False

class MEF():
    
    # Constructor
    def __init__(self):
        self.current_state = Estados.ESPERANDO_TARJETA
        self.limites = LimitesConfig()
        self.times_in_state = 0
        self.attempts = 0
        self.efectivo = 2000
        self.montoCuenta = -1
        self.montoDiff = -1
        self.message = ""

    def start(self, lectorRfid, clienteMqtt):
        self.lectorRfid = lectorRfid
        self.clienteMqtt = clienteMqtt
        self.clienteMqtt.publish(Constantes.STATUS_TOPIC, "1", retain=True)
        self.clienteMqtt.publish(Constantes.CASH_TOPIC, str(self.efectivo), retain=True)
        self.limites.cargar()

    def changeToState(self, newState):
        self.current_state = newState
        self.times_in_state = 0
        self.montoCuenta = -1
        self.montoDiff = -1

    def getCurrentView(self) -> str:
        return STATE_PAGES[self.current_state.value]
    
    def isCurrentView(self, pageName) -> bool:
        return STATE_PAGES[self.current_state.value] == pageName

    def update(self, entry_x = -1):

        if (self.current_state == Estados.ESPERANDO_TARJETA):
            id, text = self.lectorRfid.read()
            self.sesion = Sesion(id, text)
            self.clienteMqtt.publish(Constantes.PIN_REQUEST_TOPIC, self.sesion.id)
            self.changeToState(Estados.CONOCIENDO_PIN)

        elif (self.current_state == Estados.CONOCIENDO_PIN):
            if self.sesion.pin_respondido:
                if self.sesion.pin == -1:
                    self.message = "La tarjeta no está registrada o habilitada en el sistema"
                    self.changeToState(Estados.ERROR)
                else:
                    self.changeToState(Estados.INGRESO_PIN)
            elif self.times_in_state == 5:
                self.message = "No hubo respuesta por parte del servidor. Puede retirar su tarjeta"
                self.changeToState(Estados.ERROR)

        elif (self.current_state == Estados.INGRESO_PIN):
            if entry_x == 0:
                self.attempts = self.attempts + 1
                if self.attempts == 3:
                    self.message = "Se alcanzó la máxima cantidad de intentos permitidos"
                    self.changeToState(Estados.ERROR)
                    self.attempts = 0
            elif entry_x == 1:
                self.changeToState(Estados.MENU)
                self.attempts = 0

        elif (self.current_state == Estados.MENU):
            if entry_x == 1:
                self.changeToState(Estados.MUESTRA_SALDO)
            elif entry_x == 2:
                self.changeToState(Estados.INGRESO_DINERO)
            elif entry_x == 3:
                self.changeToState(Estados.RETIRO_DINERO)
            elif entry_x == 4:
                self.changeToState(Estados.ESPERANDO_TARJETA)

        elif (self.current_state == Estados.MUESTRA_SALDO):
            if entry_x == 1:
                self.changeToState(Estados.MENU)
            elif entry_x == 2:
                self.clienteMqtt.publish(Constantes.MONTO_REQUEST_TOPIC, self.sesion.id)

                # Esperar respuesta del backend
                while self.montoCuenta == -1:
                    pass

                # En caso de error, backend responde "-2"
                if (self.montoCuenta == -2):
                    self.success = 0
                    self.message = "No se pudo completar la operación"
                else:
                    self.success = 1
                    self.message = self.montoCuenta

        elif (self.current_state == Estados.INGRESO_DINERO):
            if entry_x == 1:
                self.changeToState(Estados.MENU)
            elif entry_x == 2:
                self.clienteMqtt.publish(Constantes.INGRESO_REQUEST_TOPIC, str(self.sesion.id) + "-" + str(self.montoDiff))

                # Esperar respuesta del backend
                while self.montoCuenta == -1:
                    pass

                # En caso de error, backend responde "-2"
                if (self.montoCuenta == -2):
                    self.success = 0
                    self.message = "Operación no realizada. Devolviendo el dinero ingresado..."
                else:
                    self.success = 1
                    self.message = self.montoCuenta
                    self.efectivo = self.efectivo + self.montoDiff
                    self.clienteMqtt.publish(Constantes.CASH_TOPIC, str(self.efectivo), retain=True)

        elif (self.current_state == Estados.RETIRO_DINERO):
            if entry_x == 1:
                self.changeToState(Estados.MENU)
            elif entry_x == 2:
                self.success = 0

                # Control de limites
                if (self.montoDiff > self.efectivo):
                    self.message = "No hay dinero suficiente en el cajero. Disculpe las molestias"
                elif (self.montoDiff < self.limites.extraccion_min):
                    self.message = f"El monto mínimo para extraer es ${self.limites.extraccion_min}"
                elif (self.montoDiff > self.limites.extraccion_max):
                    self.message = f"El monto máximo para extraer es ${self.limites.extraccion_max}"
                else:
                    # Publicacion MQTT
                    self.clienteMqtt.publish(Constantes.RETIRO_REQUEST_TOPIC, str(self.sesion.id) + "-" + str(self.montoDiff))

                    # Esperar respuesta del backend
                    while self.montoCuenta == -1:
                        pass

                    # En caso de error, backend responde "-2"
                    if (self.montoCuenta == -2):
                        self.message = "Extracción mayor al saldo en cuenta. Operación no realizada"
                    else:
                        self.success = 1
                        self.message = self.montoCuenta
                        self.efectivo = self.efectivo - self.montoDiff
                        self.clienteMqtt.publish(Constantes.CASH_TOPIC, str(self.efectivo), retain=True)

        elif (self.current_state == Estados.ERROR):
            if entry_x == 1:
                self.changeToState(Estados.ESPERANDO_TARJETA)

        self.times_in_state = self.times_in_state + 1
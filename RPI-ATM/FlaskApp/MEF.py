from Estados import Estados
import Constantes

# Constantes
STATE_PAGES = ["menu", "waiting-card", "pin-ack", "pin-input", "option-saldo"]

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
    def __init__(self, lectorRfid, clienteMQTT):
        self.current_state = Estados.ESPERANDO_TARJETA
        self.times_in_state = 0
        self.attempts = 0
        self.efectivo = 2000

    def start(self, lectorRfid, clienteMQTT):
        self.lectorRfid = lectorRfid
        self.clienteMQTT = clienteMQTT
        self.clienteMqtt.publish(Constantes.STATUS_TOPIC, "1", retain=True)
        self.clienteMqtt.publish(Constantes.CASH_TOPIC, str(self.efectivo), retain=True)

    def changeToState(self, newState):
        self.current_state = newState
        self.times_in_state = 0

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

            # if (self.times_in_state >= 8):
            #    self.changeToState(Estados.INGRESO_PIN)

        elif (self.current_state == Estados.CONOCIENDO_PIN):
            if self.sesion.pin_respondido:
                if self.sesion.pin == -1:
                    print("La tarjeta no está registrada o habilitada en el sistema")
                    self.changeToState(Estados.ESPERANDO_TARJETA)
                else:
                    self.changeToState(Estados.INGRESO_PIN)
            elif self.times_in_state == 5:
                print("No hubo respuesta por parte del servidor. Puede retirar su tarjeta")
                self.changeToState(Estados.ESPERANDO_TARJETA)

        elif (self.current_state == Estados.INGRESO_PIN):
            if entry_x == 0:
                self.attempts = self.attempts + 1
                if self.attempts == 3:
                    self.changeToState(Estados.ESPERANDO_TARJETA)
                    self.attempts = 0
            elif entry_x == 1:
                self.changeToState(Estados.MENU)
                self.attempts = 0

        elif (self.current_state == Estados.MENU):
            if entry_x == 1:
                self.changeToState(Estados.MUESTRA_SALDO)
            if entry_x == 4:
                self.changeToState(Estados.ESPERANDO_TARJETA)

        elif (self.current_state == Estados.MUESTRA_SALDO):
            if entry_x == 1:
                self.changeToState(Estados.MENU)

        self.times_in_state = self.times_in_state + 1
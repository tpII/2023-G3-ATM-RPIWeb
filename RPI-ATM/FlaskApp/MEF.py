from Estados import Estados

# Constantes
STATE_PAGES = ["menu", "waiting-card", "pin-ack", "pin-input", "option-saldo"]

class MEF():
    
    # Constructor
    def __init__(self):
        self.current_state = Estados.ESPERANDO_TARJETA
        self.times_in_state = 0
        self.attempts = 0

    def changeToState(self, newState):
        self.current_state = newState
        self.times_in_state = 0

    def getCurrentView(self) -> str:
        return STATE_PAGES[self.current_state.value]
    
    def isCurrentView(self, pageName) -> bool:
        return STATE_PAGES[self.current_state.value] == pageName

    def update(self, entry_x = -1):

        if (self.current_state == Estados.ESPERANDO_TARJETA):
            if (self.times_in_state >= 8):
                self.changeToState(Estados.INGRESO_PIN)

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
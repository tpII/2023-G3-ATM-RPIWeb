class Sesion():

    # Constructor
    def __init__(self, id, text):
        self.id = id
        self.text = text
        self.pin = -1
        self.pin_respondido = False
        self.card_database_id = ""
        self.error = ""

    # Cancelación ante PIN inexistente o inhabilitado
    def cancel(self, error):
        self.pin = -1
        self.error = error
        self.pin_respondido = True

    # Recepción de PIN y ID database de tarjeta
    def set_pin(self, pin_str, id):
        self.pin = int(pin_str)
        self.card_database_id = id
        self.pin_respondido = True

from enum import Enum                   # Enumerativos

class Estados(Enum):
    MENU = 0
    ESPERANDO_TARJETA = 1
    CONOCIENDO_PIN = 2
    INGRESO_PIN = 3
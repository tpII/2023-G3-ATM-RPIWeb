from enum import Enum                   # Enumerativos

class Estados(Enum):
    MENU = 0
    ESPERANDO_TARJETA = 1
    CONOCIENDO_PIN = 2
    INGRESO_PIN = 3
    MUESTRA_SALDO = 4
    INGRESO_DINERO = 5
    RETIRO_DINERO = 6
    TRANSACCION = 7
    ERROR = 8
    
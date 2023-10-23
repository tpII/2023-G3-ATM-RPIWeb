# Importaciones de librerias
from time import sleep                  # Delay
from enum import Enum                   # Enumerativos
from mfrc522 import SimpleMFRC522       # Lector RFID
import paho.mqtt.publish as publish     # MQTT Python
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO                 # Pines RPI
import random

# Importaciones del mismo directorio
from Preferencias import LimitesConfig

# ---- Clases ------------------------------
class Estados(Enum):
    MENU = 0
    ESPERANDO_TARJETA = 1
    CONOCIENDO_PIN = 2
    INGRESO_PIN = 3


class Sesion():

    # Constructor
    def __init__(self, id, text):
        self.id = id
        self.text = text
        self.pin = -1
        self.pin_respondido = False
        self.auth = False

# ---- Constantes -------------------------------------------
CASH_TOPIC = "cajero/efectivo"
MIN_TOPIC = "cajero/limite_min"
MAX_TOPIC = "cajero/limite_max"
PIN_REQUEST_TOPIC = "cajero/pin_request"
PIN_RESPONSE_TOPIC = "cajero/pin_response"
STATUS_TOPIC = "cajero/status"
MONTO_REQUEST_TOPIC = "cajero/monto_request"
MONTO_RESPONSE_TOPIC = "cajero/monto_response"
HOSTNAME = "163.10.142.89"              # DE LA COMPUTADORA, NO LA RASPBERRY

# ---- Funciones ---------------------------------------------
def readCard(reader):
    id, text = reader.read()
    return Sesion(id, text)

# Leer digitos de teclado
def readPin(sesion):
    intentos_restantes = 3

    while (not sesion.auth) and (intentos_restantes > 0):
        ingreso = input("Ingrese PIN:")
        pin_ingresado = try_parseInt(ingreso)

        # Comparar
        if pin_ingresado == sesion.pin:
            sesion.auth = True
        else:
            intentos_restantes = intentos_restantes - 1

def showMenu():
    print("1. Ingresar dinero")
    print("2. Retirar efectivo")
    print("3. Consultar saldo")
    #print("4. Realizar transacción")
    print("0. Finalizar")

def try_parseInt(text):
    try:
        return int(text)
    except:
        return 0
    
def publishCash(cash):
    publish.single(CASH_TOPIC, payload=str(cash), hostname=HOSTNAME, retain=True)

def onReceiveMqttMessage(mosq, obj, msg):
    global limites
    global sesion
    global montoCuenta

    if msg.topic == MIN_TOPIC:
        limites.extraccion_min = try_parseInt(msg.payload)
        print("Se actualizó el mínimo de extracción: $", limites.extraccion_min)
    elif msg.topic == MAX_TOPIC:
        limites.extraccion_max = try_parseInt(msg.payload)
        print("Se actualizó el máximo de extracción: $", limites.extraccion_max)
        limites.guardar()
    elif msg.topic == PIN_RESPONSE_TOPIC:
        sesion.pin = try_parseInt(msg.payload)
        sesion.pin_respondido = True
    elif msg.topic == MONTO_RESPONSE_TOPIC:
        montoCuenta = try_parseInt(msg.payload)

# ----------------------------------------------------------

# Setup
lectorRfid = SimpleMFRC522()
estado = Estados.ESPERANDO_TARJETA
timesInState = 0
efectivo = 2000
montoCuenta = -1

# Cargar preferencias
limites = LimitesConfig()
limites.cargar()

# Conexión MQTT
cliente = mqtt.Client(f'cajero-{random.randint(0, 100)}')
cliente.connect(HOSTNAME)
cliente.subscribe(MAX_TOPIC)
cliente.subscribe(MIN_TOPIC)
cliente.subscribe(PIN_RESPONSE_TOPIC)
cliente.subscribe(MONTO_RESPONSE_TOPIC)
publishCash(efectivo)

# MQTT Callbacks
cliente.on_message = onReceiveMqttMessage
cliente.loop_start()       

# Informar estado activo de cajero
cliente.publish(STATUS_TOPIC, "1", retain=True)

print("Cajero iniciado")
print(f"Límites de extracción: ${limites.extraccion_min} - ${limites.extraccion_max}")
print("------------------------------------------")

# Loop
try:
    while 1:
        if estado == Estados.ESPERANDO_TARJETA:
            print("Esperando tarjeta")
            sesion = readCard(lectorRfid)
            publish.single(PIN_REQUEST_TOPIC, sesion.id, hostname=HOSTNAME)
            estado = Estados.CONOCIENDO_PIN
            timesInState = 0

        elif estado == Estados.CONOCIENDO_PIN:
            if sesion.pin_respondido:
                if sesion.pin == -1:
                    print("La tarjeta no está registrada o habilitada en el sistema")
                    estado = Estados.ESPERANDO_TARJETA
                    sleep(2)
                else:
                    estado = Estados.INGRESO_PIN
            elif timesInState == 5:
                print("No hubo respuesta por parte del servidor. Puede retirar su tarjeta")
                estado = Estados.ESPERANDO_TARJETA
                sleep(2)
            else:
                timesInState = timesInState + 1
                sleep(1)

        elif estado == Estados.INGRESO_PIN:
            readPin(sesion)

            if (sesion.auth):
                print("Bienvenido!")
                estado = Estados.MENU
                timesInState = 0
            else:
                print("Se alcanzó la máxima cantidad de intentos permitidos")
                estado = Estados.ESPERANDO_TARJETA
                sleep(2)

        elif estado == Estados.MENU:
            if timesInState == 0:
                showMenu()

            timesInState = timesInState + 1
            opcion = input()

            if opcion == "1":
                text = input("Ingrese el monto a ingresar: ")
                monto = try_parseInt(text)
                if (monto > 0):
                    efectivo = efectivo + monto
                    publishCash(efectivo)
                    print("Operación realizada con éxito")
                estado = Estados.MENU
                timesInState = 0
                
            elif opcion == "2":
                text = input("Ingrese el monto a retirar: ")
                monto = try_parseInt(text)
                if (monto > efectivo):
                    print("No hay dinero suficiente en cajero. Disculpe las molestias")
                    sleep(2)
                elif (monto < limites.extraccion_min):
                    print(f"El monto mínimo para extraer es ${limites.extraccion_min}")
                    sleep(2)
                elif (monto > limites.extraccion_max):
                    print(f"El monto máximo para extraer es ${limites.extraccion_max}")
                    sleep(2)
                elif (monto > 0):
                    efectivo = efectivo - monto
                    publishCash(efectivo)
                    print("Operación realizada con éxito")
                estado = Estados.MENU
                timesInState = 0

            elif opcion == "3":
                cliente.publish(MONTO_REQUEST_TOPIC, sesion.id)

                while montoCuenta == -1:
                    pass

                # se recibio response
                print(f"Su saldo es {montoCuenta}")
                montoCuenta = -1
                estado = Estados.MENU
                timesInState = 0

            elif opcion == "0":
                print("Puede retirar su tarjeta. Gracias por utilizar nuestro servicio")
                sleep(3)
                estado = Estados.ESPERANDO_TARJETA

except KeyboardInterrupt:
    cliente.publish(STATUS_TOPIC, "0", retain=False)
    limites.guardar()
    print("Cajero cerrado de manera voluntaria")
except Exception as e:
    print("Cajero fuera de servicio")
    print(e)
finally:
    GPIO.cleanup()
    exit(0)

# sección inalcanzable
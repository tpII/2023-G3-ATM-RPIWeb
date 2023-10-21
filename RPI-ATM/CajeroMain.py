# Importaciones
from time import sleep                  # Delay
from enum import Enum                   # Enumerativos
from mfrc522 import SimpleMFRC522       # Lector RFID
import paho.mqtt.publish as publish     # MQTT Python
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO                 # Pines RPI
import random

# ---- Clases ------------------------------
class Estados(Enum):
    ESPERANDO_TARJETA = 1
    MENU = 2


class Sesion():

    # Constructor
    def __init__(self, id, text):
        self.id = id
        self.text = text
        self.autenticado = False

# -----------------------------------------------

# Constantes globales
CASH_TOPIC = "cajero/efectivo"
MIN_TOPIC = "cajero/limite_min"
MAX_TOPIC = "cajero/limite_max"
HOSTNAME = "192.168.0.27"

# Variables globales
extraccion_min = 1000
extraccion_max = 50000
pin_error = 0
esperando = 1
pin = -1

# ---- Funciones ---------------------------------------------
def readCard(reader):
    id, text = reader.read()
    return Sesion(id, text)

def readPin(sesion, cliente):
    # Solicitar PIN a MongoDB (vía MQTT)
    publish.single("cajero/pin_request", sesion.id, hostname=HOSTNAME)
    global esperando
    global pin_error

    esperando = 1

    while esperando:
       sleep(1)

    if pin_error:
        print("La tarjeta no está cargada en el sistema")
        sleep(2)
        return 0

    # Leer digitos de teclado
    pin_correcto = 0
    intentos_restantes = 3

    while (not pin_correcto) and (intentos_restantes > 0):
        ingreso = input("Ingrese PIN:")
        pin_ingresado = try_parseInt(ingreso)

        if pin_ingresado == pin:
            pin_correcto = 1
            return 1
        else:
            intentos_restantes = intentos_restantes - 1

    # Se pasó de los intentos disponibles
    print("Se alcanzó la máxima cantidad de intentos permitidos")
    return 0

def showMenu():
    print("1. Ingresar dinero")
    print("2. Retirar efectivo")
    #print("3. Consultar saldo")
    #print("4. Realizar transacción")
    print("0. Finalizar")

def try_parseInt(text):
    try:
        return int(text)
    except:
        return 0
    
def publishCash(cash):
    publish.single(CASH_TOPIC, payload=str(cash), hostname=HOSTNAME)

def onReceiveMqttMessage(mosq, obj, msg):
    #print("Se recibio", msg.payload, "en topico", msg.topic)

    if msg.topic == MIN_TOPIC:
        global extraccion_min
        extraccion_min = try_parseInt(msg.payload)
        print("Se actualizó el mínimo de extracción: $", extraccion_min)
    elif msg.topic == MAX_TOPIC:
        global extraccion_max
        extraccion_max = try_parseInt(msg.payload)
        print("Se actualizó el máximo de extracción: $", extraccion_max)
    elif msg.topic == "cajero/pin_response":
        global esperando
        global pin_error
        global pin

        pin = try_parseInt(msg.payload)
        pin_error = 1 if pin == -1 else 0
        esperando = 0

# ----------------------------------------------------------

# Setup
lectorRfid = SimpleMFRC522()
estado = Estados.ESPERANDO_TARJETA
timesInMenu = 0
efectivo = 2000

# Conexión MQTT
cliente = mqtt.Client(f'cajero-{random.randint(0, 100)}')
cliente.connect(HOSTNAME)
cliente.subscribe(MAX_TOPIC)
cliente.subscribe(MIN_TOPIC)
cliente.subscribe("cajero/pin_response")
publishCash(efectivo)

# MQTT Callbacks
cliente.on_message = onReceiveMqttMessage
cliente.loop_start()        

# Loop
try:
    while 1:
        if estado == Estados.ESPERANDO_TARJETA:
            print("Esperando tarjeta")
            sesion = readCard(lectorRfid)
            exito = readPin(sesion, cliente)

            if exito:
                print("Bienvenido!")
                estado = Estados.MENU
                timesInMenu = 0

        elif estado == Estados.MENU:
            if timesInMenu == 0:
                showMenu()

            timesInMenu = timesInMenu + 1
            text = input()

            if text == "1":
                text = input("Ingrese el monto a ingresar: ")
                monto = try_parseInt(text)
                if (monto > 0):
                    efectivo = efectivo + monto
                    publishCash(efectivo)
                    print("Operación realizada con éxito")
                estado = Estados.MENU
                timesInMenu = 0
                
            elif text == "2":
                text = input("Ingrese el monto a retirar: ")
                monto = try_parseInt(text)
                if (monto > efectivo):
                    print("No hay dinero suficiente en cajero. Disculpe las molestias")
                    sleep(2)
                elif (monto < extraccion_min):
                    print("El monto mínimo para extraer es $", extraccion_min)
                    sleep(2)
                elif (monto > extraccion_max):
                    print("El monto máximo para extraer es $", extraccion_max)
                    sleep(2)
                elif (monto > 0):
                    efectivo = efectivo - monto
                    publishCash(efectivo)
                    print("Operación realizada con éxito")
                estado = Estados.MENU
                timesInMenu = 0

            elif text == "0":
                print("Puede retirar su tarjeta. Gracias por utilizar nuestro servicio")
                sleep(3)
                estado = Estados.ESPERANDO_TARJETA

except KeyboardInterrupt:
    print("Cajero cerrado de manera voluntaria")
except Exception as e:
    print("Cajero fuera de servicio")
    print(e)
finally:
    GPIO.cleanup()
    exit(0)

# sección inalcanzable
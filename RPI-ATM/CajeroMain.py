# Importaciones de librerias
from time import sleep                  # Delay
from mfrc522 import SimpleMFRC522       # Lector RFID
import paho.mqtt.publish as publish     # MQTT Python
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO                 # Pines RPI
import random

# Importaciones del mismo directorio
from MEF import MEF_Cajero
import Constantes
import Utils

HOSTNAME = "163.10.142.89"              # DE LA COMPUTADORA, NO LA RASPBERRY

# ---- MQTT Callbacks ---------------------------------------------
    
def onReceiveMqttMessage(mosq, obj, msg):
    global mef

    if msg.topic == Constantes.MIN_TOPIC:
        mef.limites.extraccion_min = Utils.try_parseInt(msg.payload)
        print("Se actualizó el mínimo de extracción: $", mef.limites.extraccion_min)
    elif msg.topic == Constantes.MAX_TOPIC:
        mef.limites.extraccion_max = Utils.try_parseInt(msg.payload)
        print("Se actualizó el máximo de extracción: $", mef.limites.extraccion_max)
        mef.limites.guardar()
    elif msg.topic == Constantes.PIN_RESPONSE_TOPIC:
        mef.sesion.pin = Utils.try_parseInt(msg.payload)
        mef.sesion.pin_respondido = True
    elif msg.topic == Constantes.MONTO_RESPONSE_TOPIC:
        mef.montoCuenta = Utils.try_parseInt(msg.payload)
    elif msg.topic == Constantes.INGRESO_RESPONSE_TOPIC:
        mef.montoCuenta = Utils.try_parseInt(msg.payload)
    elif msg.topic == Constantes.RETIRO_RESPONSE_TOPIC:
        mef.montoCuenta = Utils.try_parseInt(msg.payload)

# ----------------------------------------------------------

# Setup
lectorRfid = SimpleMFRC522()

# Conexión MQTT
cliente = mqtt.Client(f'cajero-{random.randint(0, 100)}')
cliente.connect(HOSTNAME)
cliente.subscribe(Constantes.MAX_TOPIC)
cliente.subscribe(Constantes.MIN_TOPIC)
cliente.subscribe(Constantes.PIN_RESPONSE_TOPIC)
cliente.subscribe(Constantes.MONTO_RESPONSE_TOPIC)
cliente.subscribe(Constantes.INGRESO_RESPONSE_TOPIC)
cliente.subscribe(Constantes.RETIRO_RESPONSE_TOPIC)

# MQTT Callbacks
cliente.on_message = onReceiveMqttMessage
cliente.loop_start()       

# Iniciar MEF
mef = MEF_Cajero(cliente, lectorRfid)
mef.start()

# Loop
try:
    while 1:
        mef.update()
except KeyboardInterrupt:
    mef.stop()
    print("Cajero cerrado de manera voluntaria")
except Exception as e:
    print("Cajero fuera de servicio")
    print(e)
finally:
    GPIO.cleanup()
    exit(0)

# sección inalcanzable
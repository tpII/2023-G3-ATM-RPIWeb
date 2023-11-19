from flask import Flask, render_template, jsonify, redirect, request
from datetime import datetime           # Hora actual
from time import sleep
import threading
import random
import sys                              # Argumentos por consola

# Librerias GPIO, RFID y MQTT
from mfrc522 import SimpleMFRC522       # Lector RFID
import paho.mqtt.publish as publish     # MQTT Python
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO                 # Pines RPI

# Clases propias
from Estados import Estados
from MEF import MEF
import Constantes
import Utils

# Constantes
HOSTNAME = sys.argv[1]              # DE LA COMPUTADORA, NO LA RASPBERRY

app = Flask(__name__)
mef = MEF()

# ---- VISTAS --------------------------------------

@app.route("/")
def home():
    return redirect(mef.getCurrentView())

@app.route("/error")
def error():
    return render_template('error.html', message=mef.error)

@app.route("/waiting-card")
def waiting_card():
    if mef.isCurrentView("waiting-card"):
        return render_template('waiting_card.html', message="Esperando tarjeta...")
    else:
        return redirect('/')
    
@app.route("/pin-ack")
def pin_ack():
    return render_template('waiting_card.html', message= "Por favor, espere...")

@app.route("/pin-input")
def pin_input():
    if mef.isCurrentView("pin-input"):
        return render_template('pin_input.html', message="Ingrese PIN")
    else:
        return redirect('/')
    
@app.route("/menu")
def menu():
    if mef.isCurrentView("menu"):
        return render_template('menu.html')
    else:
        return redirect('/')
    
@app.route("/option-saldo")
def consulta_saldo():
    return render_template("consulta_saldo.html")

@app.route("/forward")
def forward():
    mef.update(entry_x=1)
    return redirect("/")

# ---- API REQUESTS --------------------------------------

@app.route("/status")
def status():
    return jsonify(status = 'ready' if mef.current_state != Estados.ESPERANDO_TARJETA else 'waiting')

@app.route("/datetime")
def get_datetime():
    now = datetime.now()
    date_time = now.strftime("%d/%m/%Y - %H:%M")
    return jsonify(text = date_time)

@app.route("/pin-process", methods=['POST'])
def pin_process():
    data = request.get_json()
    pin_ingresado = data['pin']
    print("PIN ingresado:", pin_ingresado)
    
    mef.update(entry_x = 1 if pin_ingresado == str(mef.sesion.pin) else 0)
    return jsonify(result = mef.getCurrentView())

@app.route("/menu/select_option", methods=['POST'])
def menu_select_option():
    data = request.get_json()
    option = data['option_number']
    mef.update(entry_x = int(option))
    return jsonify(result = mef.getCurrentView())

# ---- MQTT Callbacks ---------------------------------------------
    
def onReceiveMqttMessage(mosq, obj, msg):
    #if msg.topic == Constantes.MIN_TOPIC:
    #    mef.limites.extraccion_min = Utils.try_parseInt(msg.payload)
    #    print("Se actualizó el mínimo de extracción: $", mef.limites.extraccion_min)
    #elif msg.topic == Constantes.MAX_TOPIC:
    #    mef.limites.extraccion_max = Utils.try_parseInt(msg.payload)
    #    print("Se actualizó el máximo de extracción: $", mef.limites.extraccion_max)
    #    mef.limites.guardar()
    if msg.topic == Constantes.PIN_RESPONSE_TOPIC:
        mef.sesion.pin = Utils.try_parseInt(msg.payload)
        mef.sesion.pin_respondido = True
    elif msg.topic == Constantes.MONTO_RESPONSE_TOPIC:
        mef.montoCuenta = Utils.try_parseInt(msg.payload)
    elif msg.topic == Constantes.INGRESO_RESPONSE_TOPIC:
        mef.montoCuenta = Utils.try_parseInt(msg.payload)
    elif msg.topic == Constantes.RETIRO_RESPONSE_TOPIC:
        mef.montoCuenta = Utils.try_parseInt(msg.payload)

# ---- TAREAS DE SEGUNDO PLANO -------------------

def backgroundLoop():
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

    # Asignar callbacks
    cliente.on_message = onReceiveMqttMessage
    cliente.loop_start()  

    mef.start(lectorRfid, cliente)

    # Loop
    while 1:
        sleep(1)
        mef.update()

# -------------------------------------------------

if __name__ == "__main__":
    backgroundThread = threading.Thread(target=backgroundLoop, daemon=True)
    backgroundThread.start()

    # Hacerlo accesible desde otros dispositivos
    # Si debug se deja en True, se crean 2 background threads
    app.run(host='0.0.0.0', port=5000, debug=False)
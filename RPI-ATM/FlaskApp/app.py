from flask import Flask, render_template, jsonify, redirect, request
from datetime import datetime           # Hora actual
from time import sleep

import signal
import threading
import random
import sys                              # Argumentos por consola

# Librerias GPIO, RFID y MQTT
from mfrc522 import SimpleMFRC522       # Lector RFID
import paho.mqtt.client as mqtt         # MQTT Python
import RPi.GPIO as GPIO                 # Pines RPI

# Clases propias
from comunicacion import Suscriptor
from Estados import Estados
from MEF import MEF

# Constantes
HOSTNAME = sys.argv[1]              # DE LA COMPUTADORA, NO LA RASPBERRY

app = Flask(__name__)
mef = MEF()
suscriptor = Suscriptor(mef)

# Detección de CTRL+C
def handle_signal(signum, frame):
    print("Cerrando cajero")
    mef.stop()
    GPIO.cleanup()
    exit(0)

signal.signal(signal.SIGINT, handle_signal)

# ---- VISTAS --------------------------------------

@app.route("/")
def home():
    return redirect(mef.getCurrentView())

@app.route("/error")
def error():
    return render_template('error.html', message=mef.message)

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
def opcion_consulta():
    return render_template("op_consulta.html")

@app.route("/option-ingreso")
def opcion_ingreso():
    return render_template("op_ingreso.html")

@app.route("/option-retiro")
def opcion_retiro():
    return render_template("op_retiro.html")

@app.route("/option-transaccion")
def opcion_transaccion():
    return render_template("op_transaccion.html")

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
    mef.update(entry_x = 1 if data['pin'] == str(mef.sesion.pin) else 0)
    return jsonify(result = mef.getCurrentView())

@app.route("/menu/select_option", methods=['POST'])
def menu_select_option():
    data = request.get_json()
    mef.update(entry_x = data['option_number'])
    return jsonify(result = mef.getCurrentView())

@app.route("/api/diff", methods=['POST'])
def api_diff():
    data = request.get_json()
    mef.montoDiff = data['monto']
    mef.update(entry_x=2)
    return jsonify(success=mef.success, msg=mef.message)

@app.route("/api/consultar-cbu", methods=['POST'])
def api_consultar_cbu():
    data = request.get_json()
    mef.cbu = data['cbu']
    mef.update(entry_x=2)
    print(mef.success, mef.message)
    return jsonify(success=mef.success, msg=mef.message)

@app.route("/api/transferir", methods=['POST'])
def api_transferir():
    data = request.get_json()
    mef.montoDiff = data['monto']
    mef.update(entry_x=3)
    print(mef.success, mef.montoCuenta)
    return jsonify(success=mef.success, msg=mef.montoCuenta)

@app.route("/api/monto")
def api_get_monto():
    mef.update(entry_x=2)
    return jsonify(success=mef.success, msg=mef.message)

# ---- MQTT Callbacks ---------------------------------------------
    
def onReceiveMqttMessage(mosq, obj, msg):
    suscriptor.procesar(msg.topic, msg.payload)

# ---- TAREAS DE SEGUNDO PLANO -------------------

def backgroundLoop():
    # Setup 
    lectorRfid = SimpleMFRC522()

    # Conexión MQTT
    cliente = mqtt.Client(f'cajero-{random.randint(0, 100)}')
    cliente.connect(HOSTNAME)
    suscriptor.suscribir_topicos(cliente)

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
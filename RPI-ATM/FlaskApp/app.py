from flask import Flask, render_template, jsonify, redirect, request
from enum import Enum                   # Enumerativos
from time import sleep
import threading

class Estados(Enum):
    MENU = 0
    ESPERANDO_TARJETA = 1
    CONOCIENDO_PIN = 2
    INGRESO_PIN = 3

app = Flask(__name__)
current_state = Estados.ESPERANDO_TARJETA

DEFAULT_PIN = "1234"

# ---- VISTAS --------------------------------------

@app.route("/")
def home():
    if current_state == Estados.ESPERANDO_TARJETA:
        return redirect('waiting-card')
    if current_state == Estados.INGRESO_PIN: 
        return redirect('pin-input')
    if current_state == Estados.MENU:
        return redirect('menu')

@app.route("/waiting-card")
def waiting_card():
    if (current_state != Estados.ESPERANDO_TARJETA):
        return redirect('/')
    else:
        return render_template('waiting_card.html', message="Esperando tarjeta...")

@app.route("/pin-input")
def pin_input():
    if (current_state != Estados.INGRESO_PIN):
        return redirect('/')
    else:
        return render_template('pin_input.html', message="Ingrese PIN")
    
@app.route("/menu")
def menu():
    if (current_state == Estados.MENU):
        return render_template('menu.html')
    else:
        return redirect('/')
    
@app.route("/finish-session")
def finish_session():
    global current_state
    current_state = Estados.ESPERANDO_TARJETA
    return redirect("/")

# ---- API REQUESTS --------------------------------------

@app.route("/status")
def status():
    return jsonify(dict(status=('ready' if current_state == Estados.INGRESO_PIN else 'waiting')))

@app.route("/pin-process", methods=['POST'])
def pin_process():
    global current_state
    data = request.get_json()
    pin_ingresado = data['pin']
    
    if pin_ingresado == DEFAULT_PIN:
        current_state = Estados.MENU
        return jsonify(result = "1")
    else:
        return jsonify(result = "0")

# ---- TAREAS DE SEGUNDO PLANO -------------------

def backgroundLoop():
    global current_state

    while 1:
        sleep(8)
        if current_state == Estados.ESPERANDO_TARJETA: 
            current_state = Estados.INGRESO_PIN

# -------------------------------------------------

if __name__ == "__main__":
    backgroundThread = threading.Thread(target=backgroundLoop, daemon=True)
    backgroundThread.start()

    # Hacerlo accesible desde otros dispositivos
    # Si debug se deja en True, se crean 2 background threads
    app.run(host='0.0.0.0', port=5000, debug=True)
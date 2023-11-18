from flask import Flask, render_template, jsonify, redirect, request
from datetime import datetime           # Hora actual
from time import sleep
import threading

# Clases propias
from Estados import Estados
from MEF import MEF

app = Flask(__name__)
mef = MEF()
DEFAULT_PIN = "1234"

# ---- VISTAS --------------------------------------

@app.route("/")
def home():
    return redirect(mef.getCurrentView())

@app.route("/waiting-card")
def waiting_card():
    if mef.isCurrentView("waiting-card"):
        return render_template('waiting_card.html', message="Esperando tarjeta...")
    else:
        return redirect('/')

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

@app.route("/menu/return")
def return_to_menu():
    mef.update(entry_x = 1)
    return redirect("/")

# ---- API REQUESTS --------------------------------------

@app.route("/status")
def status():
    return jsonify(status = 'ready' if mef.current_state == Estados.INGRESO_PIN else 'waiting')

@app.route("/datetime")
def get_datetime():
    now = datetime.now()
    date_time = now.strftime("%d/%m/%Y - %H:%M")
    return jsonify(text = date_time)

@app.route("/pin-process", methods=['POST'])
def pin_process():
    data = request.get_json()
    pin_ingresado = data['pin']
    
    mef.update(entry_x = 1 if pin_ingresado == DEFAULT_PIN else 0)
    return jsonify(result = mef.getCurrentView())

@app.route("/menu/select_option", methods=['POST'])
def menu_select_option():
    data = request.get_json()
    option = data['option_number']
    mef.update(entry_x = int(option))
    return jsonify(result = mef.getCurrentView())

# ---- TAREAS DE SEGUNDO PLANO -------------------

def backgroundLoop():
    while 1:
        sleep(1)
        mef.update()

# -------------------------------------------------

if __name__ == "__main__":
    backgroundThread = threading.Thread(target=backgroundLoop, daemon=True)
    backgroundThread.start()

    # Hacerlo accesible desde otros dispositivos
    # Si debug se deja en True, se crean 2 background threads
    app.run(host='0.0.0.0', port=5000, debug=True)
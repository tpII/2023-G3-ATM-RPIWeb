from flask import Flask, render_template, jsonify, redirect, request
from time import sleep
import threading

app = Flask(__name__)
card_read = False

DEFAULT_PIN = "1234"

# ---- VISTAS --------------------------------------

@app.route("/")
def home():
    return redirect('pin-input' if card_read else 'waiting-card')

@app.route("/waiting-card")
def waiting_card():
    return render_template('waiting_card.html', message="Esperando tarjeta...")

@app.route("/pin-input")
def pin_input():
    if not card_read:
        return redirect('/')
    else:
        return render_template('pin_input.html', message="Ingrese PIN")
    
@app.route("/menu")
def menu():
    return render_template('menu.html')

# ---- API REQUESTS --------------------------------------

@app.route("/status")
def status():
    return jsonify(dict(status=('ready' if card_read else 'waiting')))

@app.route("/pin-process", methods=['POST'])
def pin_process():
    data = request.get_json()
    pin_ingresado = data['pin']
    print("PIN ingresado:", pin_ingresado)
    return jsonify(result = "1" if pin_ingresado == DEFAULT_PIN else "0")

# ---- TAREAS DE SEGUNDO PLANO -------------------

def backgroundLoop():
    global card_read
    sleep(15)
    print("card is now read")
    card_read = True

# -------------------------------------------------

if __name__ == "__main__":
    backgroundThread = threading.Thread(target=backgroundLoop, daemon=True)
    backgroundThread.start()

    # Hacerlo accesible desde otros dispositivos
    # Si debug se deja en True, se crean 2 background threads
    app.run(host='0.0.0.0', port=5000, debug=False)
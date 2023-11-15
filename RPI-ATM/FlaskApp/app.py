from flask import Flask, render_template, jsonify, url_for, redirect, send_file
from time import sleep
import threading

app = Flask(__name__)
card_read = False

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

@app.route("/status")
def status():
    return jsonify(dict(status=('ready' if card_read else 'waiting')))

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
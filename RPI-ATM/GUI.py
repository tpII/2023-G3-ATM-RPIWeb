# Importaciones de librerías
from time import sleep                  # Delay
from datetime import datetime           # Hora actual
import tkinter

UPDATE_RATE_MS = 1000
DEFAULT_TEXT_PADY = 150

# Clase GUI
class GUI():

    # Constructor: creación de ventana principal
    def __init__(self, bgColor, textColor):
        self.ventana = tkinter.Tk()
        self.bgColor = bgColor
        self.textColor = textColor
        self.mainVarText = tkinter.StringVar()
        self.hourVarText = tkinter.StringVar()
        self.running = 1

        self.ventana.title("Cajero RPI")            # Título
        self.ventana.geometry('600x400')            # Dimensiones
        self.ventana.configure(bg=self.bgColor)     # Color de fondo

        # Texto centrado
        self.mainText = tkinter.Label(self.ventana, textvariable=self.mainVarText, font=14, 
                                      pady=DEFAULT_TEXT_PADY, bg=self.bgColor, fg=self.textColor)
        self.mainText.pack()

        # Texto de hora actual
        hourText = tkinter.Label(self.ventana, textvariable=self.hourVarText, font=12, 
                                 bg=self.bgColor, fg=self.textColor)
        hourText.pack(side="bottom")

        # Entrada de texto (oculto al inicio)
        self.entryText = tkinter.Entry(self.ventana, justify='center', show='*')

        # Botón (oculto al inicio)
        self.button = tkinter.Button(self.ventana, text="OK", command=self.checkEntry)

        # Al cerrar ventana
        self.ventana.protocol("WM_DELETE_WINDOW", self.on_close)

        # Actualizador de textos
        self.updater()

    # Cierre de ventana
    def on_close(self):
        self.ventana.destroy()
        self.running = 0

    # Muestra el componente Entry
    def showEntry(self):
        self.entryText.place(x=170, y=263)

    # Borra el texto ingresado y oculta el Entry
    def hideEntry(self):
        self.entryText.delete(0, 'end')
        self.entryText.place_forget()

    # Chequeo de ingreso
    def checkEntry(self):
        entrada = self.entryText.get()
        if entrada == '1234':
            self.hideEntry()
            self.hideButton()
            self.showMenuView()
        else:
            self.showText("PIN incorrecto")

    # Muestra el botón OK
    def showButton(self):
        self.button.place(x=400, y=260)

    # Oculta el botón OK
    def hideButton(self):
        self.button.place_forget()

    # Actualiza el texto centrado de la ventana con el mensaje pasado por parámetro
    def showText(self, message):
        self.mainVarText.set(message)

    # Actualización automática de fecha y hora
    def updater(self):
        now = datetime.now()
        date_time = now.strftime("%d/%m/%Y \t\t\t\t %H:%M:%S")
        self.hourVarText.set(date_time)
        self.ventana.after(UPDATE_RATE_MS, self.updater)

    # Actualización hasta cierre de ventana (bloqueante)
    def loop(self):
        self.ventana.mainloop()

    # Actualización única de vistas (llamar cada 10 ms)
    def update(self):
        self.ventana.update()
        self.ventana.update_idletasks()

    # ---- VISTAS --------------------------------------------

    def showPinRequest(self):
        self.showText("Ingrese PIN")
        self.showEntry()
        self.showButton()

    def showMenuView(self):
        self.showText("Bienvenido!")
        self.mainText.config(pady=50)

        # Construir botones de opción
        self.b1 = tkinter.Button(self.ventana, text="Consultar saldo", width=15)
        self.b2 = tkinter.Button(self.ventana, text="Ingresar dinero", width=15)
        self.b3 = tkinter.Button(self.ventana, text="Retirar dinero", width=15)
        self.b4 = tkinter.Button(self.ventana, text="Terminar", width=15, command=self.onFinishSession)

        # Coordenadas
        self.b1.place(x=100, y=140)
        self.b2.place(x=350, y=140)
        self.b3.place(x=100, y=270)
        self.b4.place(x=350, y=270)

    # ---- CLICK ACTIONS -------------------------------------------------

    # Oculta los botones del menú y recupera la posición original del texto
    def onFinishSession(self):
        self.b1.destroy()
        self.b2.destroy()
        self.b3.destroy()
        self.b4.destroy()
        self.mainText.config(pady=DEFAULT_TEXT_PADY)
        self.showPinRequest()

    # --------------------------------------------------------------------

# Programa test
gui = GUI(bgColor='blue', textColor='white')
gui.showText("Iniciando...")

ticks = 0

while gui.running:
    gui.update()

    if ticks == 100:
        gui.showText("Esperando tarjeta")

    if ticks == 300:
        gui.showPinRequest()

    if ticks < 1000:
        ticks = ticks + 1
    
    sleep(0.01)
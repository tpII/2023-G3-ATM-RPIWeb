# Importaciones de librerías
from time import sleep                  # Delay
from datetime import datetime           # Hora actual
import tkinter

UPDATE_RATE_MS = 1000

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

        # Título, dimensiones y color de fondo
        self.ventana.title("Cajero RPI")
        self.ventana.geometry('600x400')
        self.ventana.configure(bg=self.bgColor)

        # Texto centrado
        mainText = tkinter.Label(self.ventana, textvariable=self.mainVarText, font=14, pady=150, 
                              bg=self.bgColor, fg=self.textColor)
        mainText.pack()

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

    # Muestra la entrada de texto
    def showEntry(self):
        self.entryText.place(x=170, y=263)

    # Oculta la entrada de texto
    def hideEntry(self):
        self.entryText.pack_forget()

    # Chequeo de ingreso
    def checkEntry(self):
        entrada = self.entryText.get()
        if entrada == '1234':
            self.showText("Bienvenido!")
        else:
            self.showText("PIN incorrecto")

    # Muestra el botón OK
    def showButton(self):
        self.button.place(x=400, y=260)

    # Oculta el botón OK
    def hideButton(self):
        self.button.pack_forget()

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

# Programa test
gui = GUI(bgColor='blue', textColor='white')
gui.showText("Iniciando...")

ticks = 0

while gui.running:
    gui.update()

    if ticks == 100:
        gui.showText("Esperando tarjeta")

    if ticks == 300:
        gui.showText("Ingrese PIN")
        gui.showEntry()
        gui.showButton()

    if ticks < 1000:
        ticks = ticks + 1
    
    sleep(0.01)
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
        self.variableText = tkinter.StringVar()
        self.hourVarText = tkinter.StringVar()

        # Título, dimensiones y color de fondo
        self.ventana.title("Cajero RPI")
        self.ventana.geometry('600x400')
        self.ventana.configure(bg=self.bgColor)

        # Texto centrado
        mainText = tkinter.Label(self.ventana, textvariable=self.variableText, font=14, pady=150, 
                              bg=self.bgColor, fg=self.textColor)
        mainText.pack()

        # Texto de hora actual
        hourText = tkinter.Label(self.ventana, textvariable=self.hourVarText, font=12, 
                                 bg=self.bgColor, fg=self.textColor)
        hourText.pack(side="bottom")

        # Updater
        self.updater()

    # Actualiza el texto centrado de la ventana con el mensaje pasado por parámetro
    def print(self, message):
        self.variableText.set(message)

    def update(self):
        self.ventana.update_idletasks()
        self.ventana.update()

    def updater(self):
        # Actualización de variables...
        now = datetime.now()
        date_time = now.strftime("%m/%d/%Y \t\t\t\t %H:%M:%S")
        self.hourVarText.set(date_time)
        self.ventana.after(UPDATE_RATE_MS, self.updater)

    def loop(self):
        self.ventana.mainloop()

# Programa principal
gui = GUI(bgColor='blue', textColor='white')
gui.print("Esperando tarjeta")
gui.loop()
# Máquina de estados finito del cajero RPI
from time import sleep                  # Delay
from enum import Enum                   # Enumerativos

from Preferencias import LimitesConfig
import Constantes                       # Nombres de tópicos MQTT
import Utils                            # Conversión de tipos

# ---- CLASES AUXILIARES ------------------------------------

class Estados(Enum):
    MENU = 0
    ESPERANDO_TARJETA = 1
    CONOCIENDO_PIN = 2
    INGRESO_PIN = 3

class Sesion():

    # Constructor
    def __init__(self, id, text):
        self.id = id
        self.text = text
        self.pin = -1
        self.pin_respondido = False
        self.auth = False

# --------------------------------------------------------

class MEF_Cajero():
    
    # Constructor
    def __init__(self, clienteMqtt, lectorRfid):
        self.estado = Estados.ESPERANDO_TARJETA
        self.timesInState = 0
        self.clienteMqtt = clienteMqtt
        self.lectorRfid = lectorRfid
        self.efectivo = 2000
        self.montoCuenta = -1
        self.limites = LimitesConfig()
        
    # Cambio de estado
    def changeToState(self, newState):
        self.estado = newState
        self.timesInState = 0

    # Publicación MQTT de efectivo
    def publishCash(self):
        self.clienteMqtt.publish(Constantes.CASH_TOPIC, str(self.efectivo), retain=True)

    # Suma efectivo al cajero y lo publica vía MQTT
    def addCash(self, monto):
        self.efectivo = self.efectivo + monto
        self.publishCash()

    # Resta efectivo al cajero y lo publica vía MQTT
    def removeCash(self, monto):
        self.efectivo = self.efectivo - monto
        self.publishCash()

    # Lectura de tarjeta RFID
    def readCard(self) -> Sesion:
        id, text = self.lectorRfid.read()
        return Sesion(id, text)
    
    # lectura de PIN por teclado
    def readPin(self):
        intentos_restantes = 3

        while (not self.sesion.auth) and (intentos_restantes > 0):
            ingreso = input("Ingrese PIN:")
            pin_ingresado = Utils.try_parseInt(ingreso)

            # Comparar
            if pin_ingresado == self.sesion.pin:
                self.sesion.auth = True
            else:
                intentos_restantes = intentos_restantes - 1

    # Carga de límites y publicación de estado activo y efectivo
    def start(self):
        self.limites.cargar()
        self.clienteMqtt.publish(Constantes.STATUS_TOPIC, "1", retain=True)
        self.publishCash()

        print("Cajero iniciado")
        print(f"Límites de extracción: ${self.limites.extraccion_min} - ${self.limites.extraccion_max}")
        print("------------------------------------------")

    # Publicación de estado desconectado
    def stop(self):
        self.clienteMqtt.publish(Constantes.STATUS_TOPIC, "0", retain=True)
        self.limites.guardar()

    # Impresión del menú de opciones
    def showMenu():
        print("1. Ingresar dinero")
        print("2. Retirar efectivo")
        print("3. Consultar saldo")
        #print("4. Realizar transacción")
        print("0. Finalizar")

    # Simular tiempo imprimiendo puntos en una misma línea
    def simulateOperation():
        print('...', end=' ')
        sleep(0.5)
        print('...', end=' ')
        sleep(0.5)
        print('...', end=' ')
        sleep(0.5)

    # Actualización de estado
    def update(self):
        if self.estado == Estados.ESPERANDO_TARJETA:
            print("Esperando tarjeta")
            self.sesion = self.readCard()
            self.clienteMqtt.publish(Constantes.PIN_REQUEST_TOPIC, self.sesion.id)
            self.changeToState(Estados.CONOCIENDO_PIN)

        elif self.estado == Estados.CONOCIENDO_PIN:
            if self.sesion.pin_respondido:
                if self.sesion.pin == -1:
                    print("La tarjeta no está registrada o habilitada en el sistema")
                    self.changeToState(Estados.ESPERANDO_TARJETA)
                    sleep(2)
                else:
                    self.changeToState(Estados.INGRESO_PIN)
            elif self.timesInState == 5:
                print("No hubo respuesta por parte del servidor. Puede retirar su tarjeta")
                self.changeToState(Estados.ESPERANDO_TARJETA)
                sleep(2)
            else:
                self.timesInState = self.timesInState + 1
                sleep(1)

        elif self.estado == Estados.INGRESO_PIN:
            self.readPin()

            if (self.sesion.auth):
                print("Bienvenido!")
                self.changeToState(Estados.MENU)
            else:
                print("Se alcanzó la máxima cantidad de intentos permitidos")
                self.changeToState(Estados.ESPERANDO_TARJETA)
                sleep(2)

        elif self.estado == Estados.MENU:
            if self.timesInState == 0:
                self.showMenu()

            self.timesInState = self.timesInState + 1
            opcion = input()

            if opcion == "1":
                text = input("Ingrese el monto a depositar: ")
                monto = Utils.try_parseInt(text)

                if (monto > 0):
                    self.clienteMqtt.publish(Constantes.INGRESO_REQUEST_TOPIC, str(self.sesion.id) + "-" + text)
                    self.simulateOperation()

                    # Esperar respuesta de backend
                    while self.montoCuenta == -1:
                        pass

                    # En caso de error, el backend responde "-2"
                    if self.montoCuenta == -2:
                        print("No se pudo completar la operación. Devolviendo el dinero ingresado", end=' ')
                        self.simulateOperation()
                    else:
                        print(f"Operación realizada con éxito. Monto en cuenta: {self.montoCuenta}")
                        self.addCash(monto)

                    self.montoCuenta = -1

                self.changeToState(Estados.MENU)

            elif opcion == "2":
                text = input("Ingrese el monto a retirar: ")
                monto = Utils.try_parseInt(text)

                if (monto > self.efectivo):
                    print("No hay dinero suficiente en cajero. Disculpe las molestias")
                    sleep(2)
                elif (monto < self.limites.extraccion_min):
                    print(f"El monto mínimo para extraer es ${self.limites.extraccion_min}")
                    sleep(2)
                elif (monto > self.limites.extraccion_max):
                    print(f"El monto máximo para extraer es ${self.limites.extraccion_max}")
                    sleep(2)
                elif (monto > 0):
                    self.clienteMqtt.publish(Constantes.RETIRO_REQUEST_TOPIC, str(self.sesion.id) + "-" + text)
                    self.simulateOperation()

                    # Esperar respuesta del backend
                    while self.montoCuenta == -1:
                        pass

                    # En caso de error, backend responde "-2"
                    if (self.montoCuenta == -2):
                        print("Extracción mayor al saldo disponible. Operación no realizada")
                        sleep(2)
                    else:
                        print(f"Operación realizada con éxito. Monto en cuenta: {self.montoCuenta}")
                        self.removeCash(monto)
                    
                    self.montoCuenta = -1

                self.changeToState(Estados.MENU)

            elif opcion == "3":
                self.clienteMqtt.publish(Constantes.MONTO_REQUEST_TOPIC, self.sesion.id)
                self.simulateOperation()

                # Esperar respuesta del backend
                while self.montoCuenta == -1:
                    pass

                # En caso de error, backend responde "-2"
                if (self.montoCuenta == -2):
                    print("No se pudo completar la operación")
                    sleep(1)
                else:
                    print(f"Su saldo es {self.montoCuenta}")
                    sleep(1)
                    
                self.montoCuenta = -1
                self.changeToState(Estados.MENU)

            elif opcion == "0":
                print("Puede retirar su tarjeta. Gracias por utilizar nuestro servicio")
                sleep(3)
                self.changeToState(Estados.ESPERANDO_TARJETA)
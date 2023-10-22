# Clase encargada de la carga y guardado de configuraciones/opciones
# del cajero automático, como por ejemplo, los límites de extracción.
import os.path

class LimitesConfig():
    archivo_limites = "config_limites.txt"

    # Constructor
    def __init__(self):
        self.extraccion_min = 1000
        self.extraccion_max = 50000

    # Recupera límites de extracción guardados
    # Si el archivo no existe, se genera y se guardan los valores default
    def cargar(self):
        if not os.path.isfile(self.archivo_limites):
            self.guardar()
            return

        try:
            with open(self.archivo_limites, 'r') as file:
                self.extraccion_min = int(file.readline())
                self.extraccion_max = int(file.readline())
                file.close()
        except Exception as e:
            print("Error al cargar límites de extracción:", e)

    # Guarda los límites de extracción en el archivo txt
    # El modo 'w' crea el archivo si no existe, y siempre sobrescribe el contenido
    # Cada write genera una línea nueva
    def guardar(self):
        try:
            with open(self.archivo_limites, 'w') as file:
                file.write(str(self.extraccion_min))
                file.write('\n')
                file.write(str(self.extraccion_max))
                file.close()
        except Exception as e:
            print("Error al guardar límites de extracción:", e)

        
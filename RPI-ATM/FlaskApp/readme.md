# Aplicación Flask en Raspberry Pi

## Instalación en Raspberry Pi
Se deben realizar los siguientes pasos. Referencia: https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/

1. Crear entorno virtual de Python mediante: `python3 -m venv .venv`
2. Activar entorno virtual: `source .venv/bin/activate`
3. Actualizar PIP: `python3 -m install --upgrade pip`
4. Instalar Flask: `python3 -m install Flask`
5. Instalar MRFC522: `python3 -m install mrfc522`
6. Instalar Paho-MQTT: `python3 -m install paho-mqtt`
7. Ejecutar aplicación: `python3 app.py [IP_WINDOWS]`

Al terminar, se debe cerrar el entorno virtual con el comando `deactivate`


## Intérprete en Windows
Durante el desarrollo, el intérprete para VSCode funcionará correctamente si:

1. Se crea un entorno virtual mediante CTRL+Shift+P > Python: Create Environment > venv
2. Se selecciona CTRL+Shift+P > Terminal: Select Default Profile > Command Prompt
3. Se abre terminal vía CTRL+Shift+P > Python: Create Terminal
4. Se instala Flask en el entorno por comando: python -m pip install flask
5. Crear la aplicación en un archivo "app.py" (si se usa otro nombre modificar FLASK_APP)
6. Correr el servidor con el comando: python -m flask run
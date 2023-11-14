# Aplicación Flask en Raspberry Pi

## Ejecución en Raspberry Pi
Instalar Flask vía ```sudo apt install python3-flask``` y luego ejecutar la app: ```python3 app.py```. De esta manera, la interfaz sencilla del cajero se puede acceder desde otros dispositivos usando un navegador web: ```192.168.0.28:5000```

## Intérprete en Windows
Durante el desarrollo, el intérprete para VSCode funcionará correctamente si:

1. Se crea un entorno virtual mediante CTRL+Shift+P > Python: Create Environment > venv
2. Se selecciona CTRL+Shift+P > Terminal: Select Default Profile > Command Prompt
3. Se abre terminal vía CTRL+Shift+P > Python: Create Terminal
4. Se instala Flask en el entorno por comando: python -m pip install flask
5. Crear la aplicación en un archivo "app.py" (si se usa otro nombre modificar FLASK_APP)
6. Correr el servidor con el comando: python -m flask run
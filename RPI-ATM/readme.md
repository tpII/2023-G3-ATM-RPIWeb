# Software del ATM en Raspberry Pi
En este directorio se encuentra el programa que implementa la lógica de los periféricos conectados al microcontrolador, como así también la comunicación con el servidor.

## Requerimientos
Para el correcto funcionamiento del programa realizado en Python:

- Habilitar SPI: sudo raspi-config > Interface Options > SPI > Enable
- Habilitar SSH: sudo raspi-config > Interface Options > SSH > Enable
- Instalar Mosquitto: sudo apt i mosquitto mosquitto-clients
- Instalar python3-dev y python3-pip mediante sudo apt i
- Instalar la librería de lectura RFID mediante sudo pip3 install mfrc522
- Instalar la librería de MQTT para Python: sudo pip3 install paho-mqtt
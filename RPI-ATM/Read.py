import Rpi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
  print("Acerque la tarjeta para leer los datos")
  id, text = reader.read()
  print(text)
  print(id)
finally:
  GPIO.cleanup()

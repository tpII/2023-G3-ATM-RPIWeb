import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
  text = input('Escribir los nuevos datos:')
  print("Acercar la tarjeta para escribir los nuevos datos")
  reader.write(text)
  print("Escrito")
finally:
  GPIO.cleanup()

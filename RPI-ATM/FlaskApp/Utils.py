# Utilidades de conversión de tipos

# Conversión de string a entero (devuelve 0 si no es posible)
def try_parseInt(text) -> int:
    try:
        return int(text)
    except:
        return 0

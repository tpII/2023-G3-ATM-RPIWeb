# Backend del Tablero de Control Web
El servidor encargado de funcionar como API de MongoDB se ejecuta en el port 2000.

## Dependencias
En el repositorio se encuentra el código fuente sin el directorio node_modules. Ejecutar el comando `npm install` para instalarlas localmente.

## Puesta en marcha
Para conectarse a la base de datos de MongoDB, se debe correr el siguiente comando en el presente directorio:

### ```npm start```

También puede ejecutar el archivo run.bat, o invocar nodemon index.js

![image](https://github.com/tpII/2023-G3-ATM-RPIWeb/assets/66924320/b45bb551-f0f2-4be0-b3db-42ca2a17825e)


## Troubleshoot
En caso de no reconocerse el comando nodemon, instalarlo globalmente: ```npm i -g nodemon```

## API Routes
Se definieron las siguientes rutas para consultas

* api/users/count: devuelve el número de usuarios registrados.
* api/cards/count: devuelve el número de tarjetas registradas.
* api/moves/count: devuelve el número de transacciones registradas.

Esquema formal de cada modelo sujeto a modificaciones.

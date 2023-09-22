# Backend del Tablero de Control Web
El servidor encargado de funcionar como API de MongoDB se ejecuta en el port 2000.

## Dependencias
En el repositorio se encuentra el código fuente sin el directorio node_modules. Ejecutar el comando `npm install` para instalarlas localmente.

## Puesta en marcha
Para conectarse a la base de datos de MongoDB, se debe correr el siguiente comando en modo administrador:

### ```nodemon index.js```

También puede ejecutar el archivo run.bat, en el presente directorio.

## Troubleshoot
En caso de no reconocerse el comando nodemon, instalarlo globalmente: ````npm i -g nodemon``

## API Routes
Se definieron las siguientes rutas para consultas

* api/users/count: devuelve el número de usuarios registrados.
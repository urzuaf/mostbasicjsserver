# CI/CD server

## Requisitos
- Tener un repositorio de git con el servidor a ejecutar
- Tener npm instalado en la vm
- Tener git instalado en la vm
- Tener cron instalado en la vm

## 1. Instalar pm2 para mantener el servicio activo

`npm install -g pm2`

Comenzar a correr el servicio 

`pm2 start server.js --name backend`

`pm2 save`

`pm2 startup`

## 2. Crear el script que actualizará el repo

Creamos un script que correrá de forma constante haciendo pull del repositorio del servidor, comparando los hashes del pull anterior con el actual, si hay cambios se vuelve a iniciar el servicio, de no haber cambios se mantiene igual.

```
#!/bin/bash

cd /ruta/a/el/servicio || exit 1

CURRENT_HASH=$(git rev-parse HEAD)

git pull origin main

NEW_HASH=$(git rev-parse HEAD)

if [ "$CURRENT_HASH" != "$NEW_HASH" ]; then
  echo "Cambios detectados. Reiniciando app..."
  npm install --production
  pm2 restart backend
else
  echo "Sin cambios."
fi
```

**Nunca hacer cambios locales en el repo, podria provocar merge conflicts y bloquear el pull**

Hacer ejecutable el archivo para poder correrlo de manera constante.

`chmod +x ruta/al/script`

## 3. Ejecutar el script de manera constante

`crontab -e`

Agregar la siguiente instrucción para hacer los pull cada 5 mins.

`*/5 * * * * /ruta/al/script >> ruta/al/servidor/deploy.log 2>&1`


Cada cambio que se haga al main se verá reflejado en el servidor en máximo 5 minutos.
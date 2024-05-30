# Descripcion

## Correr en dev
1. Clonar el repositorio
2. Crear una copia del archivo '.env.template', renobrarlo a .env y cambiar las variables de entorno
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Correr las migraciones de Prisma ```npx prisma migrate dev```
6. Ejecutar seed ```npm run seed```
7. Revisar que la base de datos tenga informacion en tableplus
8. Correr el proyecto ```npm run dev```



## Correr en prod
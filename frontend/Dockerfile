# Dockerfile para tu frontend (Fronend_PA)
FROM node:18-alpine

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de React
EXPOSE 3000

# Arrancamos la app
CMD ["npm", "start"]
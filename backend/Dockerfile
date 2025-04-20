# Imagen base
FROM node:18

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar dependencias y archivos
COPY package*.json ./
RUN npm install

# Copiar todo el código
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]

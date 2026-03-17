# Imagen base: Node.js 20
FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar manifiestos primero para aprovechar caché de capas de Docker
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Variables de entorno con valores por defecto
ENV NODE_ENV=production \
    PORT=3000

# Comando de inicio
CMD ["node", "src/server.js"]

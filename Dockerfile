FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

# Copiar el código de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 6688

ENV PORT=6688
ENV NODE_ENV=production

CMD ["node", "server.js"]

FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

# Copiar código fuente
COPY . .

# Exponer puerto del servicio
EXPOSE 6688

ENV PORT=6688
ENV NODE_ENV=production

# Healthcheck nativo mediante endpoint /health
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:6688/health || exit 1

CMD ["node", "server.js"]

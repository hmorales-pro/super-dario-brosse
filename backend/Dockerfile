FROM node:18-alpine

WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm ci --only=production

# Copier le code
COPY . .

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["node", "server.js"]

#!/bin/bash

echo "🎮 ========================================"
echo "🎮  Super Dario Brosse - Version Standalone"
echo "🎮 ========================================"
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null
then
    echo "❌ Node.js n'est pas installé !"
    echo "📥 Téléchargez-le sur: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install --package-lock-only=false express
    echo ""
fi

# Démarrer le serveur
echo "🚀 Démarrage du serveur..."
echo ""
node server.js

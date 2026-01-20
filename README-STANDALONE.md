# 🎮 Super Dario Brosse - Version Standalone

Version simplifiée du jeu qui fonctionne avec un serveur Node.js simple et un fichier JSON pour stocker les scores (pas besoin de Docker ni PostgreSQL).

## 📋 Prérequis

- **Node.js** (version 14 ou supérieure)
  - Téléchargez sur : https://nodejs.org/

## 🚀 Démarrage rapide

### Sur Windows :
Double-cliquez sur `start.bat`

### Sur macOS / Linux :
```bash
chmod +x start.sh
./start.sh
```

### Ou manuellement :
```bash
# Installer les dépendances
npm install express

# Démarrer le serveur
node server.js
```

## 🌐 Accès au jeu

Ouvrez votre navigateur sur : **http://localhost:3000**

## 📁 Fichiers importants

- `server.js` - Serveur Node.js qui gère l'API et sert les fichiers
- `scores.json` - Fichier JSON qui stocke tous les scores (créé automatiquement)
- `index.html` - Page principale du jeu
- `game.js` - Logique du jeu
- `scoring.js` - Système de scoring
- `styles.css` - Styles du jeu

## 🎯 Fonctionnalités

- ✅ Jeu de plateforme complet avec 4 niveaux
- ✅ Système de santé configurable (1-10 PV)
- ✅ Classement global multi-joueurs
- ✅ Sauvegarde automatique des scores dans scores.json
- ✅ 4 catégories de difficulté
- ✅ Contrôles tactiles pour mobile

## 🛑 Arrêter le serveur

Appuyez sur `Ctrl + C` dans le terminal

## 📊 Gestion des scores

Les scores sont sauvegardés dans le fichier `scores.json` à la racine du projet.
Pour réinitialiser les scores, supprimez simplement ce fichier (il sera recréé au prochain démarrage).

## 🔧 Changement de port

Par défaut, le serveur écoute sur le port 3000. Pour changer :
1. Ouvrez `server.js`
2. Modifiez la ligne `const PORT = 3000;`
3. Redémarrez le serveur

## ❓ Problèmes courants

### Le port 3000 est déjà utilisé
- Fermez les autres applications qui utilisent ce port
- Ou changez le port dans `server.js`

### Les scores ne se sauvegardent pas
- Vérifiez que le serveur a les droits d'écriture dans le dossier
- Regardez les logs dans le terminal pour voir les erreurs

## 🎮 Contrôles

- ⬅️ ➡️ Flèches : Déplacer
- ⬆️ Espace : Sauter
- Sur mobile : Boutons tactiles automatiques

Bon jeu ! 🎉

# 🎮 Super Dario Brosse

Jeu de plateforme inspiré de Super Mario Bros avec système de scoring et classements multi-joueurs.

## ✨ Fonctionnalités

- 🎯 4 niveaux avec différents biomes (Plaines, Désert, Glace, Lave)
- ❤️ Système de santé configurable (1-10 PV)
- 🏆 Système de classement par difficulté
- 💰 Collection de pièces
- ⏱️ Chronomètre de performance
- 📱 Contrôles tactiles pour mobile
- 🎨 Design responsive

## 🚀 Versions disponibles

Ce jeu est disponible en **3 versions** selon vos besoins :

### 🌐 Version 1 : Hébergement Statique (localStorage)
- **Fichiers** : 4 fichiers (HTML, CSS, JS)
- **Scores** : Stockés localement dans le navigateur
- **Classement** : Local uniquement
- **Installation** : Upload FTP et c'est tout
- **Idéal pour** : Tests rapides, usage personnel

📦 **Archive** : `super-dario-brosse-hebergement.zip`  
📖 **Guide** : `DEPLOIEMENT-FTP.txt` | `README-HEBERGEMENT.md`

### 🐘 Version 2 : PHP + SQLite (⭐ RECOMMANDÉ)
- **Fichiers** : 6 fichiers (HTML, CSS, JS, PHP, .htaccess)
- **Scores** : Base SQLite (fichier unique)
- **Classement** : Global partagé entre tous les joueurs
- **Installation** : Upload FTP (aucune config DB)
- **Idéal pour** : Jeu public, vrai classement compétitif

📦 **Archive** : `super-dario-brosse-php-sqlite.zip`  
📖 **Guide** : `DEPLOIEMENT-PHP.txt` | `README-PHP.md`

### 🖥️ Version 3 : Serveur Node.js
- **Fichiers** : Fichiers racine (server.js, package.json, etc.)
- **Scores** : Fichier JSON
- **Classement** : Global partagé entre tous les joueurs
- **Installation** : `npm install` + `node server.js`
- **Idéal pour** : Développeurs, VPS, tests locaux

🚀 **Démarrage** : `./start.sh` ou `start.bat`  
📖 **Guide** : `LANCEMENT-RAPIDE.txt` | `README-STANDALONE.md`

## 📊 Tableau comparatif

| Critère | Statique | PHP+SQLite | Node.js |
|---------|----------|------------|---------|
| Installation | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Classement global | ❌ | ✅ | ✅ |
| Hébergement requis | Basique | PHP mutualisé | VPS |
| Configuration | Aucune | Aucune | Node.js |
| Prix mensuel | 2-5€ | 2-5€ | 5-15€ |

## 💡 Quelle version choisir ?

- **Vous voulez tester rapidement** → Version Statique
- **Vous voulez un classement global** → Version PHP+SQLite ⭐
- **Vous êtes développeur** → Version Node.js

📖 Pour un guide détaillé : consultez `README-CHOIX-VERSION.txt`

## 🚀 Démarrage rapide

### Version PHP+SQLite (recommandé)
```bash
# 1. Dézipper l'archive
unzip super-dario-brosse-php-sqlite.zip

# 2. Uploader les 6 fichiers via FTP dans public_html/

# 3. Accéder au jeu
https://votredomaine.com/
```

### Version Statique
```bash
# 1. Dézipper l'archive
unzip super-dario-brosse-hebergement.zip

# 2. Uploader les 4 fichiers via FTP

# 3. Accéder au jeu
https://votredomaine.com/
```

### Version Node.js
```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur
node server.js

# 3. Ouvrir le navigateur
http://localhost:3000
```

## 🎮 Contrôles

- **⬅️ ➡️** Flèches : Déplacer Dario
- **⬆️ Espace** : Sauter
- **Mobile** : Boutons tactiles automatiques

## 📁 Structure du projet

```
super-dario-brosse/
├── version-hebergement/          # Version statique
│   ├── index.html
│   ├── game.js
│   ├── scoring-static.js
│   └── styles.css
│
├── version-php-sqlite/           # Version PHP (recommandé)
│   ├── index.html
│   ├── game.js
│   ├── scoring.js
│   ├── styles.css
│   ├── api.php
│   └── .htaccess
│
├── server.js                     # Serveur Node.js
├── package.json                  # Dépendances Node.js
├── start.sh / start.bat          # Scripts de démarrage
│
└── Documentation/
    ├── README-CHOIX-VERSION.txt
    ├── DEPLOIEMENT-FTP.txt
    ├── DEPLOIEMENT-PHP.txt
    ├── README-HEBERGEMENT.md
    ├── README-PHP.md
    └── README-STANDALONE.md
```

## 🛠️ Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (Canvas API)
- **Backend (optionnel)** :
  - Version PHP : PHP 7+, SQLite
  - Version Node.js : Express.js, Node.js

## 🔒 Sécurité

### Version PHP+SQLite
- ✅ Requêtes préparées PDO (protection SQL injection)
- ✅ Validation des données côté serveur
- ✅ Protection .htaccess du fichier scores.db
- ✅ Limitation de la longueur des pseudos

### Version Node.js
- ✅ Validation des entrées
- ✅ Fichier JSON protégé (pas d'accès direct)

## 📱 Compatibilité

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile (iOS Safari, Chrome Android)

## 🎯 Système de difficulté

Le jeu propose 4 niveaux de difficulté basés sur les points de vie :

- 💀 **Hardcore** : 1 PV
- ⚔️ **Normal** : 2-3 PV
- 😊 **Facile** : 4-6 PV
- 🌈 **Très Facile** : 7-10 PV

Chaque catégorie a son propre classement !

## 📊 Système de scoring

Le score est calculé selon :
- **Niveau atteint** : 1000 pts par niveau
- **Victoire totale** : Bonus de 5000 pts
- **Pièces collectées** : 100 pts par pièce
- **Temps** : Bonus selon rapidité

## 🐛 Résolution de problèmes

### Le jeu ne se charge pas
- Vérifiez que tous les fichiers sont bien uploadés
- Ouvrez la console développeur (F12)
- Vérifiez les noms de fichiers (sensible à la casse)

### Les scores ne se sauvent pas (PHP)
- Vérifiez les permissions du dossier (755 ou 775)
- Testez l'API : `https://votredomaine.com/api/scores`
- Vérifiez que SQLite est activé (phpinfo)

### Erreur 404 sur l'API (PHP)
- Vérifiez que .htaccess a été uploadé
- Vérifiez que mod_rewrite est activé

## 📄 Licence

Ce projet est fourni à des fins éducatives.

## 🤝 Contribution

Pour toute amélioration ou bug :
1. Ouvrez la console développeur (F12)
2. Notez l'erreur exacte
3. Vérifiez la documentation correspondante

## 📧 Support

Consultez les fichiers README spécifiques à chaque version :
- `README-HEBERGEMENT.md` pour la version statique
- `README-PHP.md` pour la version PHP+SQLite
- `README-STANDALONE.md` pour la version Node.js

---

🎮 **Bon jeu !** 🎮

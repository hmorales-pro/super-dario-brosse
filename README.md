# 🎮 Super Dario Brosse

Un jeu de plateforme inspiré de Super Mario Bros, avec système de scoring global et classement multi-joueurs.

## 🚀 Déploiement avec Docker

### Prérequis
- Docker et Docker Compose installés
- Un VPS avec Dokploy (ou Docker Compose)

### Lancement en local

1. **Cloner le projet**
```bash
git clone <repo-url>
cd super-dario-brosse
```

2. **Copier le fichier d'environnement**
```bash
cp backend/.env.example backend/.env
```

3. **Lancer avec Docker Compose**
```bash
docker-compose up -d
```

4. **Accéder au jeu**
- Frontend: http://localhost
- API Backend: http://localhost:3000
- Health check: http://localhost:3000/health

### Architecture

```
├── frontend/           # Fichiers HTML/CSS/JS statiques (Nginx)
├── backend/            # API Node.js + Express
│   ├── server.js       # Serveur API
│   ├── Dockerfile      # Image Docker backend
│   └── package.json    # Dépendances Node.js
├── docker-compose.yml  # Configuration Docker multi-services
└── nginx.conf          # Configuration Nginx (proxy vers API)
```

### Services Docker

- **db**: PostgreSQL 15 avec volume persistant
- **backend**: API Node.js (port 3000)
- **frontend**: Nginx servant les fichiers statiques et proxy API (port 80)

### Base de données

La base de données PostgreSQL stocke les scores avec la structure suivante:

```sql
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(20) NOT NULL,
  points INTEGER NOT NULL,
  level INTEGER NOT NULL,
  coins INTEGER NOT NULL,
  time INTEGER NOT NULL,
  health INTEGER NOT NULL,
  won BOOLEAN NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

- `GET /api/scores` - Récupérer tous les scores (top 10 par difficulté)
- `GET /api/scores/:difficulty` - Récupérer le top 10 d'une difficulté
- `POST /api/scores` - Ajouter un nouveau score
- `GET /health` - Health check

### Déploiement sur Dokploy

1. Créer un nouveau projet dans Dokploy
2. Connecter votre repository Git
3. Sélectionner "Docker Compose"
4. Dokploy détectera automatiquement le `docker-compose.yml`
5. Configurer les variables d'environnement si nécessaire
6. Déployer !

### Volumes persistants

Les données de la base de données sont stockées dans un volume Docker nommé `postgres_data`, garantissant la persistance des scores même après redémarrage des containers.

## 🎯 Fonctionnalités

- ✅ 4 niveaux avec différents biomes (Plaines, Désert, Glace, Lave)
- ✅ Système de santé configurable (1-10 PV)
- ✅ Ennemis avec différents patterns (patrouille, vol)
- ✅ Pièges mortels (pics)
- ✅ Système de scoring avec 4 catégories de difficulté
- ✅ Classement global multi-joueurs
- ✅ Design responsive (mobile, tablette, desktop)
- ✅ Contrôles tactiles pour mobile

## 🎮 Contrôles

- **Desktop**: Flèches ← → pour se déplacer, ↑ ou Espace pour sauter
- **Mobile**: Boutons tactiles à l'écran

## 📊 Système de scoring

- Points par niveau: 1000 × niveau atteint
- Bonus victoire: 5000 points
- Points par pièce: 100 × pièces collectées
- Bonus temps: max 2000 points (diminue avec le temps)

### Catégories de difficulté

- 💀 **Hardcore**: 1 PV
- ⚔️ **Normal**: 2-3 PV
- 😊 **Facile**: 4-6 PV
- 🌈 **Très Facile**: 7-10 PV

## 🛠️ Technologies

- **Frontend**: HTML5 Canvas, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Base de données**: PostgreSQL 15
- **Containerisation**: Docker, Docker Compose
- **Serveur web**: Nginx

## 📝 License

MIT

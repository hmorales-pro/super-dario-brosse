# 🎮 Super Dario Brosse - Version PHP + SQLite

Version avec classement global multi-joueurs utilisant PHP + SQLite. Parfaite pour un hébergement mutualisé avec PHP (OVH, O2switch, Hostinger, etc.).

## 🎯 Avantages de cette version

- ✅ **Classement global** partagé entre tous les joueurs
- ✅ **Base de données SQLite** (fichier unique, pas de serveur DB requis)
- ✅ **Compatible hébergement mutualisé** (PHP inclus par défaut)
- ✅ **Pas de configuration** de base de données nécessaire
- ✅ **Déploiement simple** via FTP
- ✅ **Persistance des données** même après redémarrage

## 📁 Fichiers à uploader

Uploadez ces **6 fichiers** à la racine de votre hébergement :

```
index.html
game.js
scoring.js
styles.css
api.php
.htaccess
```

## 📋 Prérequis

Votre hébergement doit avoir :
- ✅ PHP 7.0 ou supérieur (généralement inclus)
- ✅ Extension SQLite activée (généralement incluse par défaut)
- ✅ mod_rewrite Apache activé (pour .htaccess)

> 💡 La plupart des hébergements mutualisés ont déjà tout ça !

## 🚀 Installation sur hébergement mutualisé

### Via FTP (FileZilla, Cyberduck, etc.)

1. Connectez-vous à votre FTP
2. Allez dans le dossier `public_html` ou `www`
3. Uploadez les 6 fichiers listés ci-dessus
4. **Important** : Assurez-vous que le dossier a les permissions d'écriture (chmod 755 ou 775)
5. C'est tout ! 🎉

### Via cPanel

1. Connectez-vous à votre cPanel
2. Ouvrez le "Gestionnaire de fichiers"
3. Allez dans `public_html`
4. Uploadez les 6 fichiers
5. Vérifiez les permissions du dossier (clic droit > Permissions)

## 🌐 Accès au jeu

```
https://votredomaine.com/
```

## 💾 Base de données

### Création automatique

La base de données SQLite `scores.db` est **créée automatiquement** lors de la première utilisation de l'API.

### Structure

```sql
CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    points INTEGER NOT NULL,
    level INTEGER NOT NULL,
    coins INTEGER NOT NULL,
    time INTEGER NOT NULL,
    health INTEGER NOT NULL,
    won BOOLEAN NOT NULL,
    difficulty TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Sécurité

Le fichier `.htaccess` **empêche l'accès direct** au fichier `scores.db` :
- Les joueurs ne peuvent pas télécharger la base de données
- Seule l'API PHP peut y accéder

## 🔧 Configuration avancée

### Changer l'emplacement de la base de données

Éditez [api.php](api.php) ligne 19 :
```php
$db_file = __DIR__ . '/scores.db';
```

### Limiter le nombre de scores

Éditez [api.php](api.php) ligne 73 :
```php
LIMIT 100  // Changer ce nombre
```

## 📊 Gestion des scores

### Voir les scores

Les scores sont visibles directement dans le jeu via le bouton "🏆 Voir les scores".

### Réinitialiser les scores

Pour supprimer tous les scores :
1. Connectez-vous en FTP
2. Supprimez le fichier `scores.db`
3. Il sera recréé automatiquement (vide)

### Exporter les scores

1. Téléchargez le fichier `scores.db` via FTP
2. Ouvrez-le avec un outil comme [DB Browser for SQLite](https://sqlitebrowser.org/)
3. Exportez en CSV, JSON, etc.

## 🛡️ Sécurité

### Protection contre les injections SQL

L'API utilise des **requêtes préparées** PDO (100% sécurisé).

### Validation des données

- ✅ Tous les champs sont validés côté serveur
- ✅ Pseudo limité à 20 caractères
- ✅ Difficulté validée contre une liste blanche

### Protection CORS

L'API accepte les requêtes de n'importe quel domaine (`Access-Control-Allow-Origin: *`).

Pour restreindre à votre domaine uniquement, éditez [api.php](api.php) ligne 8 :
```php
header('Access-Control-Allow-Origin: https://votredomaine.com');
```

## 🐛 Débogage

### Vérifier si SQLite est activé

Créez un fichier `test.php` :
```php
<?php
phpinfo();
```

Cherchez "sqlite" dans la page. Si présent = activé ✅

### Erreur 500

1. Vérifiez les permissions du dossier (755 ou 775)
2. Vérifiez que PHP a les droits d'écriture
3. Activez les logs d'erreur PHP

### Les scores ne se sauvegardent pas

1. Vérifiez les permissions (le serveur doit pouvoir créer `scores.db`)
2. Ouvrez la console navigateur (F12) pour voir les erreurs
3. Testez l'API directement : `https://votredomaine.com/api/scores`

## 📱 Version mobile

Le jeu inclut des contrôles tactiles automatiques sur mobile/tablette.

## 🔄 Migration depuis localStorage

Pour migrer les scores localStorage vers SQLite :

1. Les joueurs doivent ressaisir leur pseudo
2. Pas de migration automatique possible (données locales vs serveur)

## ⚙️ Comparaison des versions

| Critère | localStorage | SQLite (PHP) |
|---------|-------------|--------------|
| Classement global | ❌ Non | ✅ Oui |
| Installation | Très simple | Simple |
| Hébergement | Statique | PHP mutualisé |
| Configuration | Aucune | Aucune |
| Persistance | Par navigateur | Serveur global |
| Sauvegardes | Non | Oui (fichier DB) |

## 🎮 Fonctionnalités

- ✅ 4 niveaux avec différents biomes
- ✅ Système de santé configurable (1-10 PV)
- ✅ **Classement global multi-joueurs**
- ✅ 4 catégories de difficulté
- ✅ Contrôles tactiles mobile
- ✅ Sauvegarde permanente des scores
- ✅ Tableau des 100 meilleurs scores par catégorie

## 📊 API REST

### GET /api/scores

Récupère tous les scores groupés par difficulté.

**Réponse :**
```json
{
  "hardcore": [...],
  "normal": [...],
  "easy": [...],
  "veryEasy": [...]
}
```

### POST /api/scores

Ajoute un nouveau score.

**Requête :**
```json
{
  "player_name": "Joueur",
  "points": 5000,
  "level": 4,
  "coins": 14,
  "time": 120,
  "health": 3,
  "won": true,
  "difficulty": "normal"
}
```

**Réponse :**
```json
{
  "success": true,
  "score": { ... },
  "rank": 1
}
```

## ❓ Questions fréquentes

### Mon hébergeur a-t-il SQLite ?

Oui, pratiquement tous les hébergeurs incluent SQLite avec PHP par défaut.

### Faut-il créer la base de données manuellement ?

Non, elle est créée automatiquement au premier appel de l'API.

### Combien de joueurs peuvent jouer simultanément ?

SQLite supporte facilement 100-1000 joueurs simultanés pour ce type d'usage.

### Peut-on avoir plusieurs jeux sur le même hébergement ?

Oui ! Créez un sous-dossier pour chaque jeu :
- `/jeu1/` → sa propre base `scores.db`
- `/jeu2/` → sa propre base `scores.db`

## 🎉 C'est prêt !

Votre jeu est maintenant déployé avec un système de classement global !

Les joueurs du monde entier peuvent s'affronter sur votre serveur 🏆

# 🎮 Super Dario Brosse - Version Hébergement Mutualisé

Version 100% statique (HTML/CSS/JS) qui fonctionne directement sans serveur backend. Parfaite pour un hébergement mutualisé (OVH, O2switch, Hostinger, etc.).

## 📁 Fichiers à uploader

Uploadez **uniquement** ces 4 fichiers à la racine de votre hébergement :

```
index.html
game.js
scoring-static.js
styles.css
```

## 🚀 Installation sur hébergement mutualisé

### Via FTP (FileZilla, Cyberduck, etc.)

1. Connectez-vous à votre FTP
2. Allez dans le dossier `public_html` ou `www`
3. Uploadez les 4 fichiers listés ci-dessus
4. C'est tout ! Votre jeu est en ligne 🎉

### Via cPanel (interface web)

1. Connectez-vous à votre cPanel
2. Ouvrez le "Gestionnaire de fichiers"
3. Allez dans `public_html`
4. Cliquez sur "Upload"
5. Uploadez les 4 fichiers
6. Voilà, c'est en ligne !

## 🌐 Accès au jeu

Une fois uploadé, accédez au jeu via :
```
https://votredomaine.com/index.html
```

Ou simplement :
```
https://votredomaine.com/
```
(si index.html est le seul fichier index à la racine)

## 💾 Système de scoring

Les scores sont **sauvegardés localement** dans le navigateur de chaque joueur via `localStorage`.

### Important à savoir :

- ✅ Les scores persistent même après fermeture du navigateur
- ⚠️ Les scores sont **locaux** à chaque navigateur/appareil
- ⚠️ Si l'utilisateur vide ses données de navigation, les scores sont perdus
- ⚠️ Pas de classement global entre différents joueurs (chaque joueur a son propre classement)

### Pour un classement global partagé :

Si vous voulez un vrai classement multi-joueurs, vous aurez besoin de :
- Un serveur backend (Node.js avec `server.js`)
- Une base de données ou fichier JSON partagé
- Un hébergement VPS ou cloud (pas mutualisé)

## 🎯 Fonctionnalités

- ✅ 4 niveaux avec différents biomes
- ✅ Système de santé configurable (1-10 PV)
- ✅ Classement personnel par difficulté
- ✅ Sauvegarde automatique des scores
- ✅ 4 catégories de difficulté
- ✅ Contrôles tactiles pour mobile
- ✅ Fonctionne sans serveur
- ✅ Compatible tous navigateurs modernes

## 📊 Réinitialiser les scores

Les joueurs peuvent réinitialiser leurs scores depuis le tableau des scores (bouton "Réinitialiser les scores").

## 🔧 Personnalisation

### Changer le titre du jeu

Éditez [index.html](index.html) ligne 6 :
```html
<title>Votre Titre</title>
```

### Changer les couleurs

Éditez [styles.css](styles.css) pour personnaliser les couleurs.

### Modifier la difficulté

Éditez [game.js](game.js) pour ajuster :
- Vitesse des ennemis
- Nombre de vies
- Taille des plateformes
- etc.

## ⚙️ Configuration requise

### Côté serveur :
- Hébergement web simple (mutualisé OK)
- Support HTML/CSS/JS (tous les hébergeurs)
- Pas besoin de PHP, Node.js, MySQL, etc.

### Côté client :
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- JavaScript activé
- localStorage disponible

## 🌍 Compatibilité navigateurs

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile (iOS Safari, Chrome Android)

## 📱 Version mobile

Le jeu inclut des contrôles tactiles qui s'affichent automatiquement sur mobile/tablette.

## ❓ Problèmes fréquents

### Le jeu ne se charge pas
- Vérifiez que tous les fichiers sont bien uploadés
- Vérifiez que les noms de fichiers sont exacts (sensible à la casse)
- Ouvrez la console développeur (F12) pour voir les erreurs

### Les scores ne se sauvent pas
- Vérifiez que JavaScript est activé
- Vérifiez que localStorage n'est pas bloqué
- Mode navigation privée = pas de localStorage persistant

### Le jeu est lent
- Normal sur mobile ancien
- Fermez les autres onglets
- Rafraîchissez la page

## 📦 Structure minimale

```
votresite.com/
├── index.html           (Page principale)
├── game.js             (Logique du jeu)
├── scoring-static.js   (Système de scoring localStorage)
└── styles.css          (Design)
```

C'est tout ! Aucun autre fichier n'est nécessaire.

## 🎮 Bon jeu !

Le jeu est maintenant prêt à être déployé sur n'importe quel hébergement mutualisé !

Pour toute question ou problème, consultez la console développeur du navigateur (F12).

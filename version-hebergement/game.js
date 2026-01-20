// Initialiser le gestionnaire de scores
const scoreManager = new ScoreManager();

// Charger les scores au démarrage
scoreManager.loadScores();

// Fonction pour afficher le tableau des scores
function showScoreBoard() {
    // Recharger les scores depuis localStorage
    scoreManager.loadScores();
    document.getElementById('menu').style.display = 'none';
    displayScoreBoard(scoreManager, 'normal');
}

// Initialisation du canvas et du contexte
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables de contrôle du jeu
let gameRunning = false;
let gameStarted = false;
const keys = {};
let gameTime = 0;
let gameTimeInterval;

// Score et vies
let lives = 3;
let maxHealth = 3; // Points de vie par vie (configurable)
let currentHealth = 3; // Santé actuelle
let coinsCollected = 0;
let totalCoins = 0;
let currentLevel = 1;
const MAX_LEVELS = 4;

// Camera offset pour le scrolling
let cameraX = 0;
const WORLD_WIDTH = 2500; // Largeur de chaque niveau

// Animation de mort
let deathAnimation = false;
let deathAnimationTime = 0;
let deathReason = "";

// Configuration du joueur (Dario)
const player = {
    x: 50,
    y: 400,
    width: 30,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    speed: 6,
    jumpPower: 13,
    grounded: false,
    color: '#FF6B6B',
    invincible: false,
    invincibleTime: 0
};

// Gravité et friction
const gravity = 0.6;
const friction = 0.75; // Réduit pour plus de contrôle
const groundFriction = 0.25; // Friction au sol pour arrêt plus rapide
const airControl = 0.8; // Contrôle réduit dans les airs

// Variables pour les éléments du niveau
let grounds = [];
let platforms = [];
let coins = [];
let enemies = [];
let spikes = [];
let castle = {};
let biome = {};

// Définition des biomes
const biomes = {
    plains: {
        name: "Plaines Vertes",
        skyColor: "#87CEEB",
        groundColor: "#8B4513",
        grassColor: "#228B22",
        platformColor: "#228B22",
        cloudColor: "rgba(255, 255, 255, 0.7)"
    },
    desert: {
        name: "Désert Brûlant",
        skyColor: "#FFD39B",
        groundColor: "#DEB887",
        grassColor: "#F4A460",
        platformColor: "#CD853F",
        cloudColor: "rgba(255, 255, 255, 0.4)"
    },
    ice: {
        name: "Terres Gelées",
        skyColor: "#B0E0E6",
        groundColor: "#E0FFFF",
        grassColor: "#ADD8E6",
        platformColor: "#87CEEB",
        cloudColor: "rgba(255, 255, 255, 0.9)"
    },
    lava: {
        name: "Monde de Lave",
        skyColor: "#8B0000",
        groundColor: "#2F4F4F",
        grassColor: "#FF4500",
        platformColor: "#696969",
        cloudColor: "rgba(128, 0, 0, 0.5)"
    }
};

// Fonction pour générer un niveau
function generateLevel(levelNum) {
    // Choisir le biome en fonction du niveau
    let biomeName;
    if (levelNum === 1) biomeName = 'plains';
    else if (levelNum === 2) biomeName = 'desert';
    else if (levelNum === 3) biomeName = 'ice';
    else biomeName = 'lava';

    biome = biomes[biomeName];

    // Générer le sol avec des trous (différents par niveau)
    if (levelNum === 1) {
        // Niveau 1: Trous faciles
        grounds = [
            { x: 0, y: 550, width: 500, height: 50 },
            { x: 650, y: 550, width: 450, height: 50 },
            { x: 1250, y: 550, width: 400, height: 50 },
            { x: 1800, y: 550, width: 700, height: 50 }
        ];
    } else if (levelNum === 2) {
        // Niveau 2: Plus de trous
        grounds = [
            { x: 0, y: 550, width: 400, height: 50 },
            { x: 550, y: 550, width: 350, height: 50 },
            { x: 1050, y: 550, width: 300, height: 50 },
            { x: 1500, y: 550, width: 350, height: 50 },
            { x: 2000, y: 550, width: 500, height: 50 }
        ];
    } else if (levelNum === 3) {
        // Niveau 3: Trous plus larges
        grounds = [
            { x: 0, y: 550, width: 350, height: 50 },
            { x: 600, y: 550, width: 300, height: 50 },
            { x: 1100, y: 550, width: 250, height: 50 },
            { x: 1550, y: 550, width: 300, height: 50 },
            { x: 2050, y: 550, width: 450, height: 50 }
        ];
    } else {
        // Niveau 4: Le plus difficile
        grounds = [
            { x: 0, y: 550, width: 300, height: 50 },
            { x: 500, y: 550, width: 250, height: 50 },
            { x: 950, y: 550, width: 200, height: 50 },
            { x: 1350, y: 550, width: 250, height: 50 },
            { x: 1800, y: 550, width: 300, height: 50 },
            { x: 2300, y: 550, width: 200, height: 50 }
        ];
    }

    // Générer les plateformes (layout unique par niveau)
    if (levelNum === 1) {
        // Niveau 1: Escalier facile
        platforms = [
            { x: 200, y: 480, width: 120, height: 20 },
            { x: 380, y: 420, width: 120, height: 20 },
            { x: 560, y: 360, width: 120, height: 20 },
            { x: 750, y: 480, width: 100, height: 20 },
            { x: 900, y: 420, width: 100, height: 20 },
            { x: 1050, y: 480, width: 120, height: 20 },
            { x: 1250, y: 400, width: 100, height: 20 },
            { x: 1450, y: 480, width: 100, height: 20 },
            { x: 1650, y: 420, width: 120, height: 20 },
            { x: 1900, y: 480, width: 100, height: 20 },
            { x: 2100, y: 420, width: 120, height: 20 }
        ];
    } else if (levelNum === 2) {
        // Niveau 2: Zigzag
        platforms = [
            { x: 200, y: 450, width: 100, height: 20 },
            { x: 400, y: 350, width: 90, height: 20 },
            { x: 600, y: 450, width: 100, height: 20 },
            { x: 800, y: 350, width: 90, height: 20 },
            { x: 950, y: 480, width: 80, height: 20 },
            { x: 1100, y: 400, width: 100, height: 20 },
            { x: 1300, y: 300, width: 90, height: 20 },
            { x: 1500, y: 420, width: 100, height: 20 },
            { x: 1700, y: 340, width: 90, height: 20 },
            { x: 1900, y: 460, width: 100, height: 20 },
            { x: 2100, y: 380, width: 90, height: 20 }
        ];
    } else if (levelNum === 3) {
        // Niveau 3: Plateformes hautes et sauts précis
        platforms = [
            { x: 200, y: 420, width: 80, height: 20 },
            { x: 350, y: 320, width: 80, height: 20 },
            { x: 500, y: 220, width: 80, height: 20 },
            { x: 650, y: 360, width: 90, height: 20 },
            { x: 850, y: 280, width: 80, height: 20 },
            { x: 1000, y: 400, width: 70, height: 20 },
            { x: 1150, y: 300, width: 80, height: 20 },
            { x: 1350, y: 240, width: 80, height: 20 },
            { x: 1550, y: 380, width: 90, height: 20 },
            { x: 1750, y: 300, width: 80, height: 20 },
            { x: 1950, y: 420, width: 90, height: 20 }
        ];
    } else {
        // Niveau 4: Enfer - petites plateformes, très espacées
        platforms = [
            { x: 180, y: 450, width: 70, height: 20 },
            { x: 320, y: 350, width: 60, height: 20 },
            { x: 450, y: 280, width: 70, height: 20 },
            { x: 600, y: 400, width: 60, height: 20 },
            { x: 730, y: 320, width: 65, height: 20 },
            { x: 900, y: 240, width: 70, height: 20 },
            { x: 1050, y: 380, width: 60, height: 20 },
            { x: 1200, y: 280, width: 65, height: 20 },
            { x: 1350, y: 200, width: 70, height: 20 },
            { x: 1550, y: 340, width: 60, height: 20 },
            { x: 1700, y: 260, width: 70, height: 20 },
            { x: 1900, y: 400, width: 65, height: 20 },
            { x: 2100, y: 320, width: 70, height: 20 }
        ];
    }

    // Générer les pièces (adaptées par niveau)
    coins = [
        { x: 250, y: 420, width: 20, height: 20, collected: false },
        { x: 400, y: 350, width: 20, height: 20, collected: false },
        { x: 650, y: 390, width: 20, height: 20, collected: false },
        { x: 780, y: 320, width: 20, height: 20, collected: false },
        { x: 950, y: 420 - (levelNum * 20), width: 20, height: 20, collected: false },
        { x: 1050, y: 350, width: 20, height: 20, collected: false },
        { x: 1180, y: 270, width: 20, height: 20, collected: false },
        { x: 1350, y: 350, width: 20, height: 20, collected: false },
        { x: 1480, y: 420, width: 20, height: 20, collected: false },
        { x: 1620, y: 390 - (levelNum * 15), width: 20, height: 20, collected: false },
        { x: 1780, y: 320, width: 20, height: 20, collected: false },
        { x: 1950, y: 270 - (levelNum * 10), width: 20, height: 20, collected: false },
        { x: 2180, y: 420, width: 20, height: 20, collected: false },
        { x: 2330, y: 370, width: 20, height: 20, collected: false }
    ];

    totalCoins = coins.length;
    document.getElementById('totalCoins').textContent = totalCoins;

    // Générer les ennemis (vitesse réduite et mieux placés)
    enemies = [];

    if (levelNum === 1) {
        // Niveau 1: 3 ennemis lents
        enemies = [
            { x: 300, y: 510, width: 30, height: 30, velocityX: 1.2, minX: 200, maxX: 450, type: 'patrol' },
            { x: 800, y: 510, width: 30, height: 30, velocityX: 1.0, minX: 750, maxX: 950, type: 'patrol' },
            { x: 1400, y: 510, width: 30, height: 30, velocityX: 1.3, minX: 1250, maxX: 1600, type: 'patrol' }
        ];
    } else if (levelNum === 2) {
        // Niveau 2: 4 ennemis + 1 volant
        enemies = [
            { x: 300, y: 510, width: 30, height: 30, velocityX: 1.4, minX: 200, maxX: 500, type: 'patrol' },
            { x: 700, y: 510, width: 30, height: 30, velocityX: 1.2, minX: 550, maxX: 850, type: 'patrol' },
            { x: 1200, y: 510, width: 30, height: 30, velocityX: 1.5, minX: 1050, maxX: 1400, type: 'patrol' },
            { x: 1700, y: 510, width: 30, height: 30, velocityX: 1.3, minX: 1500, maxX: 1900, type: 'patrol' },
            { x: 1000, y: 300, width: 25, height: 25, velocityX: 0, velocityY: 1.5, minY: 250, maxY: 450, type: 'flying' }
        ];
    } else if (levelNum === 3) {
        // Niveau 3: 4 ennemis + 2 volants
        enemies = [
            { x: 300, y: 510, width: 30, height: 30, velocityX: 1.6, minX: 150, maxX: 500, type: 'patrol' },
            { x: 800, y: 510, width: 30, height: 30, velocityX: 1.4, minX: 600, maxX: 1000, type: 'patrol' },
            { x: 1300, y: 510, width: 30, height: 30, velocityX: 1.5, minX: 1100, maxX: 1500, type: 'patrol' },
            { x: 1800, y: 510, width: 30, height: 30, velocityX: 1.7, minX: 1550, maxX: 2000, type: 'patrol' },
            { x: 700, y: 300, width: 25, height: 25, velocityX: 0, velocityY: 1.6, minY: 200, maxY: 450, type: 'flying' },
            { x: 1500, y: 250, width: 25, height: 25, velocityX: 0, velocityY: 1.7, minY: 200, maxY: 450, type: 'flying' }
        ];
    } else {
        // Niveau 4: 5 ennemis + 3 volants (mais pas trop rapides)
        enemies = [
            { x: 250, y: 510, width: 30, height: 30, velocityX: 1.7, minX: 100, maxX: 450, type: 'patrol' },
            { x: 650, y: 510, width: 30, height: 30, velocityX: 1.5, minX: 500, maxX: 900, type: 'patrol' },
            { x: 1100, y: 510, width: 30, height: 30, velocityX: 1.8, minX: 950, maxX: 1300, type: 'patrol' },
            { x: 1550, y: 510, width: 30, height: 30, velocityX: 1.6, minX: 1350, maxX: 1750, type: 'patrol' },
            { x: 2000, y: 510, width: 30, height: 30, velocityX: 1.9, minX: 1800, maxX: 2200, type: 'patrol' },
            { x: 600, y: 300, width: 25, height: 25, velocityX: 0, velocityY: 1.8, minY: 200, maxY: 450, type: 'flying' },
            { x: 1200, y: 250, width: 25, height: 25, velocityX: 0, velocityY: 1.9, minY: 150, maxY: 400, type: 'flying' },
            { x: 1800, y: 280, width: 25, height: 25, velocityX: 0, velocityY: 1.7, minY: 200, maxY: 450, type: 'flying' }
        ];
    }

    // Couleurs des ennemis selon le biome
    const enemyColor = biomeName === 'desert' ? '#FF8C00' :
                      biomeName === 'ice' ? '#4169E1' :
                      biomeName === 'lava' ? '#DC143C' : '#8B00FF';
    const flyingColor = biomeName === 'desert' ? '#FF4500' :
                       biomeName === 'ice' ? '#1E90FF' :
                       biomeName === 'lava' ? '#FF0000' : '#FF1493';

    enemies.forEach(enemy => {
        enemy.color = enemy.type === 'patrol' ? enemyColor : flyingColor;
    });

    // Générer les pièges
    spikes = [
        { x: 850, y: 530, width: 40, height: 20 },
        { x: 1050, y: 530, width: 60, height: 20 }
    ];
    if (levelNum >= 2) spikes.push({ x: 2000, y: 530, width: 80, height: 20 });
    if (levelNum >= 3) spikes.push({ x: 1600, y: 530, width: 50, height: 20 });

    // Château à la fin
    castle = {
        x: 2200,
        y: 380,
        width: 120,
        height: 170,
        doorX: 2240,
        doorY: 480,
        doorWidth: 40,
        doorHeight: 70
    };
}

// Initialiser le premier niveau
generateLevel(1);

// Gestion des événements clavier
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Gestion des contrôles tactiles pour mobile
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const btnJump = document.getElementById('btnJump');

// Bouton gauche
btnLeft.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['ArrowLeft'] = true;
});
btnLeft.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys['ArrowLeft'] = false;
});

// Bouton droite
btnRight.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['ArrowRight'] = true;
});
btnRight.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys['ArrowRight'] = false;
});

// Bouton saut
btnJump.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['ArrowUp'] = true;
});
btnJump.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys['ArrowUp'] = false;
});

// Éviter le scroll sur mobile quand on touche les boutons
document.getElementById('mobileControls').addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// Fonction de détection de collision rectangulaire
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Mise à jour de la caméra
function updateCamera() {
    const playerScreenX = player.x - cameraX;

    // La caméra suit le joueur quand il dépasse le milieu de l'écran
    if (playerScreenX > canvas.width / 2) {
        cameraX = player.x - canvas.width / 2;
    }

    // Limiter la caméra aux bords du monde
    if (cameraX < 0) cameraX = 0;
    if (cameraX > WORLD_WIDTH - canvas.width) cameraX = WORLD_WIDTH - canvas.width;
}

// Fonction pour prendre un coup
function takeDamage(reason) {
    if (deathAnimation || player.invincible) return; // Éviter les dégâts multiples

    currentHealth--;
    document.getElementById('health').textContent = currentHealth;

    // Vérifier si la santé est à 0
    if (currentHealth <= 0) {
        loseLife(reason);
    } else {
        // Donner invincibilité temporaire (1 seconde)
        player.invincible = true;
        setTimeout(() => {
            player.invincible = false;
        }, 1000);
    }
}

// Fonction pour perdre une vie
function loseLife(reason) {
    if (deathAnimation) return; // Éviter les morts multiples

    deathAnimation = true;
    deathAnimationTime = 0;
    deathReason = reason;

    // Arrêter le mouvement du joueur
    player.velocityX = 0;

    // Animation de saut vers le haut puis chute
    player.velocityY = -15;
}

// Fonction appelée après l'animation de mort
function finishDeath() {
    lives--;
    document.getElementById('lives').textContent = lives;

    deathAnimation = false;
    player.rotation = 0; // Réinitialiser la rotation

    if (lives <= 0) {
        endGame(false, deathReason);
    } else {
        // Réinitialiser la position et régénérer la santé
        player.x = 50;
        player.y = 400;
        player.velocityX = 0;
        player.velocityY = 0;
        player.invincible = true;
        player.invincibleTime = 2000; // 2 secondes d'invincibilité
        cameraX = 0;

        // Régénérer la santé complète
        currentHealth = maxHealth;
        document.getElementById('health').textContent = currentHealth;

        // Démarrer le décompte d'invincibilité
        setTimeout(() => {
            player.invincible = false;
            player.invincibleTime = 0;
        }, 2000);
    }
}

// Mise à jour de la physique du joueur
function updatePlayer() {
    // Si en animation de mort, gérer l'animation
    if (deathAnimation) {
        deathAnimationTime += 16; // ~16ms par frame

        // Appliquer la gravité
        player.velocityY += gravity;
        player.y += player.velocityY;

        // Rotation du joueur pendant la mort
        player.rotation = (player.rotation || 0) + 0.15;

        // Quand le joueur est tombé assez bas, finir l'animation
        if (player.y > canvas.height + 50) {
            finishDeath();
        }
        return;
    }

    // Déplacement horizontal avec meilleure réactivité
    if (keys['ArrowLeft']) {
        // Contrôle direct : vitesse immédiate
        if (player.grounded) {
            player.velocityX = -player.speed;
        } else {
            // Contrôle réduit dans les airs
            player.velocityX = Math.max(player.velocityX - player.speed * (1 - airControl), -player.speed);
        }
    } else if (keys['ArrowRight']) {
        if (player.grounded) {
            player.velocityX = player.speed;
        } else {
            player.velocityX = Math.min(player.velocityX + player.speed * (1 - airControl), player.speed);
        }
    } else {
        // Freinage rapide au sol, plus lent dans les airs
        if (player.grounded) {
            player.velocityX *= groundFriction;
            // Arrêt complet si très lent
            if (Math.abs(player.velocityX) < 0.3) {
                player.velocityX = 0;
            }
        } else {
            player.velocityX *= friction;
        }
    }

    // Saut
    if ((keys[' '] || keys['ArrowUp']) && player.grounded) {
        player.velocityY = -player.jumpPower;
        player.grounded = false;
    }

    // Appliquer la gravité
    player.velocityY += gravity;

    // Mettre à jour la position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Limiter le déplacement horizontal aux bords du monde
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > WORLD_WIDTH) player.x = WORLD_WIDTH - player.width;

    // Vérifier si le joueur tombe dans le vide (mort immédiate, pas de dégâts)
    if (player.y > canvas.height) {
        currentHealth = 0;
        document.getElementById('health').textContent = currentHealth;
        loseLife("Dario est tombé dans le vide!");
        return;
    }

    // Réinitialiser l'état au sol
    player.grounded = false;

    // Collision avec les sols
    grounds.forEach(ground => {
        if (checkCollision(player, ground)) {
            player.y = ground.y - player.height;
            player.velocityY = 0;
            player.grounded = true;
        }
    });

    // Collision avec les plateformes
    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            // Collision par le dessus
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.grounded = true;
            }
        }
    });

    // Collision avec les pièces
    coins.forEach(coin => {
        if (!coin.collected && checkCollision(player, coin)) {
            coin.collected = true;
            coinsCollected++;
            document.getElementById('coins').textContent = coinsCollected;
        }
    });

    // Collision avec les ennemis (si pas invincible)
    if (!player.invincible && !deathAnimation) {
        enemies.forEach(enemy => {
            if (checkCollision(player, enemy)) {
                takeDamage("Dario a touché un ennemi!");
            }
        });

        // Collision avec les pièges
        spikes.forEach(spike => {
            if (checkCollision(player, spike)) {
                takeDamage("Dario a touché des pics!");
            }
        });
    }


    // Collision avec la porte du château (victoire ou niveau suivant)
    const castleDoor = {
        x: castle.doorX,
        y: castle.doorY,
        width: castle.doorWidth,
        height: castle.doorHeight
    };

    if (checkCollision(player, castleDoor)) {
        if (currentLevel < MAX_LEVELS) {
            nextLevel();
        } else {
            endGame(true);
        }
    }

    // Mettre à jour la caméra
    updateCamera();
}

// Mise à jour des ennemis
function updateEnemies() {
    enemies.forEach(enemy => {
        if (enemy.type === 'patrol') {
            enemy.x += enemy.velocityX;

            // Faire rebondir l'ennemi entre minX et maxX
            if (enemy.x <= enemy.minX || enemy.x + enemy.width >= enemy.maxX) {
                enemy.velocityX *= -1;
            }
        } else if (enemy.type === 'flying') {
            enemy.y += enemy.velocityY;

            // Faire rebondir l'ennemi entre minY et maxY
            if (enemy.y <= enemy.minY || enemy.y + enemy.height >= enemy.maxY) {
                enemy.velocityY *= -1;
            }
        }
    });
}

// Dessin du joueur (Dario avec chapeau et moustache)
function drawPlayer() {
    const screenX = player.x - cameraX;

    ctx.save();

    // Si en animation de mort, appliquer la rotation
    if (deathAnimation) {
        ctx.translate(screenX + player.width / 2, player.y + player.height / 2);
        ctx.rotate(player.rotation || 0);
        ctx.translate(-(screenX + player.width / 2), -(player.y + player.height / 2));
    }

    // Effet de clignotement si invincible
    if (player.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }

    // Corps
    ctx.fillStyle = player.color;
    ctx.fillRect(screenX, player.y + 15, player.width, player.height - 15);

    // Tête
    ctx.fillStyle = '#FFD4A3';
    ctx.fillRect(screenX + 5, player.y + 10, 20, 15);

    // Chapeau
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(screenX + 3, player.y, 24, 12);
    ctx.fillRect(screenX + 8, player.y - 5, 14, 8);

    // Moustache
    ctx.fillStyle = '#000';
    ctx.fillRect(screenX + 10, player.y + 20, 10, 3);

    ctx.globalAlpha = 1;
    ctx.restore();
}

// Dessin des ennemis
function drawEnemies() {
    enemies.forEach(enemy => {
        const screenX = enemy.x - cameraX;

        if (enemy.type === 'patrol') {
            ctx.fillStyle = enemy.color;
            ctx.beginPath();
            ctx.arc(screenX + enemy.width/2, enemy.y + enemy.height/2, enemy.width/2, 0, Math.PI * 2);
            ctx.fill();

            // Yeux méchants
            ctx.fillStyle = '#FFF';
            ctx.fillRect(screenX + 8, enemy.y + 8, 6, 6);
            ctx.fillRect(screenX + 16, enemy.y + 8, 6, 6);
            ctx.fillStyle = '#000';
            ctx.fillRect(screenX + 10, enemy.y + 10, 3, 3);
            ctx.fillRect(screenX + 18, enemy.y + 10, 3, 3);
        } else if (enemy.type === 'flying') {
            // Chauve-souris volante
            ctx.fillStyle = enemy.color;
            ctx.beginPath();
            ctx.arc(screenX + enemy.width/2, enemy.y + enemy.height/2, enemy.width/2, 0, Math.PI * 2);
            ctx.fill();

            // Ailes
            ctx.fillStyle = enemy.color;
            ctx.beginPath();
            ctx.ellipse(screenX, enemy.y + enemy.height/2, 8, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(screenX + enemy.width, enemy.y + enemy.height/2, 8, 5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Dessin du sol
function drawGround() {
    grounds.forEach(ground => {
        const screenX = ground.x - cameraX;
        ctx.fillStyle = biome.groundColor;
        ctx.fillRect(screenX, ground.y, ground.width, ground.height);

        // Texture herbe
        ctx.fillStyle = biome.grassColor;
        ctx.fillRect(screenX, ground.y, ground.width, 5);
    });
}

// Dessin des plateformes
function drawPlatforms() {
    platforms.forEach(platform => {
        const screenX = platform.x - cameraX;
        ctx.fillStyle = biome.platformColor;
        ctx.fillRect(screenX, platform.y, platform.width, platform.height);

        // Bordure pour effet 3D
        ctx.strokeStyle = biome.grassColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, platform.y, platform.width, platform.height);
    });
}

// Dessin des pièces
function drawCoins() {
    coins.forEach(coin => {
        if (!coin.collected) {
            const screenX = coin.x - cameraX;
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(screenX + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
            ctx.fill();

            // Bordure brillante
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

// Dessin des pièges
function drawSpikes() {
    spikes.forEach(spike => {
        const screenX = spike.x - cameraX;
        ctx.fillStyle = '#696969';

        // Dessiner des triangles pour les pics
        const numSpikes = spike.width / 10;
        for (let i = 0; i < numSpikes; i++) {
            ctx.beginPath();
            ctx.moveTo(screenX + i * 10, spike.y + spike.height);
            ctx.lineTo(screenX + i * 10 + 5, spike.y);
            ctx.lineTo(screenX + i * 10 + 10, spike.y + spike.height);
            ctx.closePath();
            ctx.fill();
        }
    });
}

// Dessin du château
function drawCastle() {
    const screenX = castle.x - cameraX;

    // Murs du château
    ctx.fillStyle = '#808080';
    ctx.fillRect(screenX, castle.y, castle.width, castle.height);

    // Tours
    ctx.fillRect(screenX - 20, castle.y + 40, 20, 130);
    ctx.fillRect(screenX + castle.width, castle.y + 40, 20, 130);

    // Toits des tours (triangles)
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.moveTo(screenX - 25, castle.y + 40);
    ctx.lineTo(screenX - 10, castle.y + 10);
    ctx.lineTo(screenX + 5, castle.y + 40);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(screenX + castle.width - 5, castle.y + 40);
    ctx.lineTo(screenX + castle.width + 10, castle.y + 10);
    ctx.lineTo(screenX + castle.width + 25, castle.y + 40);
    ctx.closePath();
    ctx.fill();

    // Toit principal
    ctx.beginPath();
    ctx.moveTo(screenX - 10, castle.y);
    ctx.lineTo(screenX + castle.width / 2, castle.y - 30);
    ctx.lineTo(screenX + castle.width + 10, castle.y);
    ctx.closePath();
    ctx.fill();

    // Porte
    ctx.fillStyle = '#654321';
    ctx.fillRect(castle.doorX - cameraX, castle.doorY, castle.doorWidth, castle.doorHeight);

    // Fenêtres
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(screenX + 20, castle.y + 50, 25, 30);
    ctx.fillRect(screenX + castle.width - 45, castle.y + 50, 25, 30);

    // Détails de la porte
    ctx.fillStyle = '#000';
    ctx.fillRect(castle.doorX - cameraX + 17, castle.doorY + 40, 6, 6);
}

// Dessin du ciel avec nuages qui bougent
function drawBackground() {
    // Couleur du ciel selon le biome
    canvas.style.background = biome.skyColor;

    // Nuages qui suivent la caméra avec parallax
    const parallaxOffset = cameraX * 0.3;

    ctx.fillStyle = biome.cloudColor;
    ctx.beginPath();
    ctx.arc(100 - parallaxOffset, 80, 30, 0, Math.PI * 2);
    ctx.arc(130 - parallaxOffset, 80, 35, 0, Math.PI * 2);
    ctx.arc(160 - parallaxOffset, 80, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(500 - parallaxOffset, 120, 25, 0, Math.PI * 2);
    ctx.arc(525 - parallaxOffset, 120, 30, 0, Math.PI * 2);
    ctx.arc(550 - parallaxOffset, 120, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(900 - parallaxOffset, 100, 28, 0, Math.PI * 2);
    ctx.arc(930 - parallaxOffset, 100, 32, 0, Math.PI * 2);
    ctx.arc(960 - parallaxOffset, 100, 28, 0, Math.PI * 2);
    ctx.fill();

    // Nom du biome en haut à gauche (sous le HUD)
    const levelText = 'Niveau ' + currentLevel + ': ' + biome.name;
    ctx.font = 'bold 18px Arial';
    const textWidth = ctx.measureText(levelText).width;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, 60, textWidth + 20, 40); // Déplacé à 60px (sous le HUD)
    ctx.fillStyle = '#FFD700';
    ctx.fillText(levelText, 20, 85);
}

// Fonction pour passer au niveau suivant
function nextLevel() {
    currentLevel++;
    coinsCollected = 0;
    cameraX = 0;

    // Réinitialiser le joueur
    player.x = 50;
    player.y = 400;
    player.velocityX = 0;
    player.velocityY = 0;
    player.grounded = false;
    player.rotation = 0;

    // Générer le nouveau niveau
    generateLevel(currentLevel);

    // Afficher un message de transition
    showLevelTransition();
}

// Message de transition entre les niveaux
function showLevelTransition() {
    gameRunning = false;

    // Afficher le message
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Niveau ' + currentLevel, canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = 'bold 32px Arial';
    ctx.fillText(biome.name, canvas.width / 2, canvas.height / 2 + 20);
    ctx.font = '24px Arial';
    ctx.fillStyle = '#FFF';
    ctx.fillText('Prépare-toi...', canvas.width / 2, canvas.height / 2 + 80);

    // Reprendre après 2 secondes
    setTimeout(() => {
        ctx.textAlign = 'left';
        gameRunning = true;
        gameLoop();
    }, 2000);
}

// Fonction de fin de jeu
function endGame(victory, reason = "") {
    gameRunning = false;
    clearInterval(gameTimeInterval);

    if (victory) {
        document.getElementById('victoryCoins').textContent = coinsCollected;
        document.getElementById('victoryTotalCoins').textContent = totalCoins;
        document.getElementById('victoryTime').textContent = gameTime;
        document.getElementById('victory').style.display = 'block';

        // Ajouter le formulaire de score
        setTimeout(() => {
            showScoreForm(true, currentLevel, coinsCollected, gameTime, maxHealth);
        }, 100);
    } else {
        document.getElementById('deathReason').textContent = reason;
        document.getElementById('finalCoins').textContent = coinsCollected;
        document.getElementById('finalTime').textContent = gameTime;
        document.getElementById('gameOver').style.display = 'block';

        // Ajouter le formulaire de score
        setTimeout(() => {
            showScoreForm(false, currentLevel, coinsCollected, gameTime, maxHealth);
        }, 100);
    }
}

// Fonction de redémarrage
function restartGame() {
    const gameOverDiv = document.getElementById('gameOver');
    const victoryDiv = document.getElementById('victory');
    const customPopup = document.getElementById('customPopup');

    // Forcer le masquage avec la classe hidden (!important)
    gameOverDiv.classList.add('hidden');
    victoryDiv.classList.add('hidden');
    customPopup.classList.add('hidden');

    // Réinitialiser le HTML
    gameOverDiv.innerHTML = `
        <h2>Game Over!</h2>
        <p id="deathReason"></p>
        <p>Pièces collectées: <span id="finalCoins">0</span></p>
        <p>Temps: <span id="finalTime">0</span>s</p>
        <button onclick="restartGame()">Recommencer</button>
    `;

    victoryDiv.innerHTML = `
        <h2>🎉 Victoire! 🎉</h2>
        <p>Dario a terminé tous les niveaux!</p>
        <p>Pièces: <span id="victoryCoins">0</span>/<span id="victoryTotalCoins">0</span></p>
        <p>Temps: <span id="victoryTime">0</span>s</p>
        <button onclick="restartGame()">Rejouer</button>
    `;

    // Réinitialiser le joueur
    player.x = 50;
    player.y = 400;
    player.velocityX = 0;
    player.velocityY = 0;
    player.grounded = false;
    player.invincible = false;
    player.invincibleTime = 0;

    // Réinitialiser les stats
    lives = 3;
    currentHealth = maxHealth;
    coinsCollected = 0;
    gameTime = 0;
    cameraX = 0;
    deathAnimation = false;
    deathAnimationTime = 0;
    player.rotation = 0;
    currentLevel = 1;

    document.getElementById('lives').textContent = lives;
    document.getElementById('health').textContent = currentHealth;
    document.getElementById('coins').textContent = coinsCollected;
    document.getElementById('timer').textContent = gameTime;

    // Régénérer le niveau 1
    generateLevel(1);

    // Réinitialiser les pièces
    coins.forEach(coin => coin.collected = false);

    // Réinitialiser les ennemis
    enemies.forEach(enemy => {
        if (enemy.type === 'patrol') {
            enemy.x = enemy.minX + 50;
            enemy.velocityX = Math.abs(enemy.velocityX);
        } else if (enemy.type === 'flying') {
            enemy.y = (enemy.minY + enemy.maxY) / 2;
            enemy.velocityY = Math.abs(enemy.velocityY);
        }
    });

    // Relancer le jeu
    gameRunning = true;
    startTimer();
    gameLoop();
}

// Timer du jeu
function startTimer() {
    gameTimeInterval = setInterval(() => {
        if (gameRunning) {
            gameTime++;
            document.getElementById('timer').textContent = gameTime;
        }
    }, 1000);
}

// Fonction pour démarrer le jeu depuis le menu
function startGame() {
    const gameOverDiv = document.getElementById('gameOver');
    const victoryDiv = document.getElementById('victory');
    const customPopup = document.getElementById('customPopup');

    // Supprimer l'attribut style inline et forcer le display none
    gameOverDiv.removeAttribute('style');
    gameOverDiv.style.display = 'none';
    victoryDiv.removeAttribute('style');
    victoryDiv.style.display = 'none';
    customPopup.removeAttribute('style');
    customPopup.style.display = 'none';

    // Puis réinitialiser complètement les modals à leur état d'origine
    gameOverDiv.innerHTML = `
        <h2>Game Over!</h2>
        <p id="deathReason"></p>
        <p>Pièces collectées: <span id="finalCoins">0</span></p>
        <p>Temps: <span id="finalTime">0</span>s</p>
        <button onclick="restartGame()">Recommencer</button>
    `;

    victoryDiv.innerHTML = `
        <h2>🎉 Victoire! 🎉</h2>
        <p>Dario a terminé tous les niveaux!</p>
        <p>Pièces: <span id="victoryCoins">0</span>/<span id="victoryTotalCoins">0</span></p>
        <p>Temps: <span id="victoryTime">0</span>s</p>
        <button onclick="restartGame()">Rejouer</button>
    `;

    // Récupérer la difficulté choisie
    maxHealth = parseInt(document.getElementById('healthSetting').value);
    currentHealth = maxHealth;

    // Mettre à jour l'affichage
    document.getElementById('maxHealth').textContent = maxHealth;
    document.getElementById('health').textContent = currentHealth;

    document.getElementById('menu').style.display = 'none';
    document.getElementById('ui').style.display = 'flex';
    gameRunning = true;
    gameStarted = true;
    startTimer();
    gameLoop();
}

// Boucle principale du jeu
function gameLoop() {
    if (!gameRunning) return;

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le fond
    drawBackground();

    // Mettre à jour
    updatePlayer();
    updateEnemies();

    // Dessiner tous les éléments
    drawGround();
    drawPlatforms();
    drawSpikes();
    drawCoins();
    drawCastle();
    drawEnemies();
    drawPlayer();

    // Continuer la boucle
    requestAnimationFrame(gameLoop);
}

// Initialiser le canvas au démarrage (sans commencer le jeu)
function init() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawGround();
    drawPlatforms();
    drawCastle();
}

init();

// Système de scoring avec API backend

const API_URL = '/api';

class ScoreManager {
    constructor() {
        this.scores = {
            hardcore: [],
            normal: [],
            easy: [],
            veryEasy: []
        };
    }

    // Charger les scores depuis l'API
    async loadScores() {
        try {
            const response = await fetch(`${API_URL}/scores`);
            if (response.ok) {
                this.scores = await response.json();
            }
        } catch (error) {
            console.error('Erreur chargement scores:', error);
        }
        return this.scores;
    }

    // Déterminer la catégorie de difficulté
    getDifficultyCategory(health) {
        if (health === 1) return 'hardcore';
        if (health >= 2 && health <= 3) return 'normal';
        if (health >= 4 && health <= 6) return 'easy';
        return 'veryEasy';
    }

    // Obtenir le nom de la difficulté
    getDifficultyName(category) {
        const names = {
            hardcore: '💀 Hardcore (1 PV)',
            normal: '⚔️ Normal (2-3 PV)',
            easy: '😊 Facile (4-6 PV)',
            veryEasy: '🌈 Très Facile (7-10 PV)'
        };
        return names[category] || category;
    }

    // Ajouter un score via l'API
    async addScore(playerName, level, coins, time, health, won) {
        const category = this.getDifficultyCategory(health);
        const points = this.calculatePoints(level, coins, time, won);

        const scoreData = {
            player_name: playerName.substring(0, 20),
            points: points,
            level: level,
            coins: coins,
            time: time,
            health: health,
            won: won,
            difficulty: category
        };

        try {
            const response = await fetch(`${API_URL}/scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scoreData)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde du score');
            }

            const result = await response.json();

            // Recharger les scores pour avoir les données à jour
            await this.loadScores();

            // Retourner le score avec les infos de l'API
            return {
                name: scoreData.player_name,
                level: level,
                coins: coins,
                time: time,
                health: health,
                won: won,
                points: points,
                created_at: result.score.created_at,
                rank: result.rank
            };
        } catch (error) {
            console.error('Erreur ajout score:', error);
            throw error;
        }
    }

    // Calculer les points
    calculatePoints(level, coins, time, won) {
        let points = 0;

        // Points par niveau atteint
        points += level * 1000;

        // Bonus si victoire totale
        if (won) {
            points += 5000;
        }

        // Points par pièce
        points += coins * 100;

        // Bonus de temps (moins de temps = plus de points)
        const timeBonus = Math.max(0, 2000 - (time * 10));
        points += timeBonus;

        return Math.floor(points);
    }

    // Obtenir les scores d'une catégorie
    getScores(category) {
        return this.scores[category] || [];
    }

    // Obtenir tous les scores
    getAllScores() {
        return this.scores;
    }
}

// Variable globale pour stocker le dernier joueur sauvegardé
let lastSavedPlayer = null;

// Afficher le tableau des scores
function displayScoreBoard(scoreManager, category = 'normal', highlightPlayer = null) {
    const scoreBoard = document.getElementById('scoreBoard');
    const scores = scoreManager.getScores(category);

    let html = `
        <h1>🏆 Tableau des Scores 🏆</h1>

        <div class="difficulty-tabs">
            <div class="difficulty-tab ${category === 'hardcore' ? 'active' : ''}"
                 onclick="displayScoreBoard(scoreManager, 'hardcore', ${highlightPlayer ? 'lastSavedPlayer' : 'null'})">
                💀 Hardcore
            </div>
            <div class="difficulty-tab ${category === 'normal' ? 'active' : ''}"
                 onclick="displayScoreBoard(scoreManager, 'normal', ${highlightPlayer ? 'lastSavedPlayer' : 'null'})">
                ⚔️ Normal
            </div>
            <div class="difficulty-tab ${category === 'easy' ? 'active' : ''}"
                 onclick="displayScoreBoard(scoreManager, 'easy', ${highlightPlayer ? 'lastSavedPlayer' : 'null'})">
                😊 Facile
            </div>
            <div class="difficulty-tab ${category === 'veryEasy' ? 'active' : ''}"
                 onclick="displayScoreBoard(scoreManager, 'veryEasy', ${highlightPlayer ? 'lastSavedPlayer' : 'null'})">
                🌈 Très Facile
            </div>
        </div>

        <h2 style="color: #FFD700; margin: 20px 0;">${scoreManager.getDifficultyName(category)}</h2>
    `;

    if (scores.length === 0) {
        html += '<p style="color: #AAA; margin: 30px 0;">Aucun score enregistré pour cette difficulté.</p>';
    } else {
        html += `
            <table class="score-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Joueur</th>
                        <th>Points</th>
                        <th>Niveau</th>
                        <th>Pièces</th>
                        <th>Temps</th>
                        <th>Statut</th>
                    </tr>
                </thead>
                <tbody>
        `;

        scores.forEach((score, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1);
            const status = score.won ? '✅ Victoire' : '❌ Défaite';

            // Vérifier si c'est le joueur à mettre en surbrillance
            const isHighlighted = highlightPlayer &&
                                 score.player_name === highlightPlayer.name &&
                                 score.points === highlightPlayer.points &&
                                 Math.abs(new Date(score.created_at).getTime() - new Date(highlightPlayer.created_at).getTime()) < 2000;

            const rowClass = isHighlighted ? 'highlight-row' : '';

            html += `
                <tr class="${rowClass}">
                    <td>${medal}</td>
                    <td>${score.player_name}</td>
                    <td><strong>${score.points}</strong></td>
                    <td>${score.level}/4</td>
                    <td>💰 ${score.coins}</td>
                    <td>⏱️ ${score.time}s</td>
                    <td>${status}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;
    }

    html += `
        <button onclick="closeScoreBoard()">Retour</button>
    `;

    scoreBoard.innerHTML = html;
    scoreBoard.style.display = 'block';
}

// Fermer le tableau des scores
function closeScoreBoard() {
    document.getElementById('scoreBoard').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
}

// Afficher le formulaire de sauvegarde de score
function showScoreForm(isVictory, currentLevel, coinsCollected, gameTime, maxHealth) {
    const container = isVictory ? document.getElementById('victory') : document.getElementById('gameOver');

    // Vérifier si le formulaire existe déjà pour éviter les doublons
    const existingForm = container.querySelector('.score-form');
    if (existingForm) {
        // Réinitialiser le formulaire existant
        const nameInput = existingForm.querySelector('#playerNameInput');
        nameInput.disabled = false;
        nameInput.value = '';
        return;
    }

    const formHtml = `
        <div class="score-form">
            <p style="margin-bottom: 15px;">Entrez votre pseudo pour sauvegarder votre score :</p>
            <input type="text" id="playerNameInput" placeholder="Votre pseudo" maxlength="20" />
            <br>
            <button onclick="savePlayerScore(${isVictory}, ${currentLevel}, ${coinsCollected}, ${gameTime}, ${maxHealth})">
                💾 Sauvegarder mon score
            </button>
        </div>
    `;

    // Insérer le formulaire avant les boutons
    const buttons = container.querySelectorAll('button');
    if (buttons.length > 0) {
        buttons[0].insertAdjacentHTML('beforebegin', formHtml);
    }
}

// Sauvegarder le score du joueur
async function savePlayerScore(isVictory, currentLevel, coinsCollected, gameTime, maxHealth) {
    const nameInput = document.getElementById('playerNameInput');
    const playerName = nameInput.value.trim();

    // Vérifier si le score a déjà été sauvegardé
    if (nameInput.disabled) {
        return;
    }

    if (!playerName) {
        // Popup custom pour demander un pseudo
        showCustomAlert('Veuillez entrer un pseudo !');
        return;
    }

    // Désactiver le bouton pendant la sauvegarde
    nameInput.disabled = true;
    const button = nameInput.nextElementSibling.nextElementSibling;
    button.disabled = true;
    button.textContent = '⏳ Sauvegarde...';

    try {
        const score = await scoreManager.addScore(
            playerName,
            currentLevel,
            coinsCollected,
            gameTime,
            maxHealth,
            isVictory
        );

        // Sauvegarder le joueur pour le mettre en surbrillance
        lastSavedPlayer = score;

        // Trouver le rang du joueur
        const category = scoreManager.getDifficultyCategory(maxHealth);
        const rank = score.rank;

        // Afficher la popup custom
        showScoreSavedPopup(score, category, rank);

        // Mettre à jour l'affichage
        nameInput.value = '✅ Score sauvegardé !';
        button.textContent = '✅ Sauvegardé !';
    } catch (error) {
        console.error('Erreur sauvegarde:', error);
        showCustomAlert('❌ Erreur lors de la sauvegarde du score. Veuillez réessayer.');
        nameInput.disabled = false;
        button.disabled = false;
        button.textContent = '💾 Sauvegarder mon score';
    }
}

// Afficher une alerte custom
function showCustomAlert(message) {
    const popup = document.getElementById('customPopup');
    popup.querySelector('.popup-content').innerHTML = `
        <h2>⚠️ Attention</h2>
        <div class="score-details">
            <p style="color: white; font-size: 18px;">${message}</p>
        </div>
        <button onclick="closeCustomPopup()">OK</button>
    `;
    popup.style.display = 'flex';
}

// Afficher la popup de score sauvegardé
function showScoreSavedPopup(score, category, rank) {
    const popup = document.getElementById('customPopup');

    const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏅';
    const rankText = rank <= 10 ? `${rankEmoji} ${rank}${rank === 1 ? 'er' : 'ème'} du classement !` : `Classé ${rank}ème`;

    document.getElementById('popupPlayerName').textContent = `Joueur : ${score.name}`;
    document.getElementById('popupPoints').textContent = `${score.points} points`;
    document.getElementById('popupCategory').textContent = scoreManager.getDifficultyName(category);
    document.getElementById('popupRank').textContent = rankText;

    popup.style.display = 'flex';
}

// Fermer la popup custom
function closeCustomPopup() {
    document.getElementById('customPopup').style.display = 'none';
}

// Fermer la popup et afficher les scores
function closePopupAndShowScores() {
    closeCustomPopup();

    // Cacher les écrans de fin de jeu
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('victory').style.display = 'none';

    // Afficher le tableau des scores avec le joueur mis en surbrillance
    const category = scoreManager.getDifficultyCategory(lastSavedPlayer.health);
    displayScoreBoard(scoreManager, category, lastSavedPlayer);
}

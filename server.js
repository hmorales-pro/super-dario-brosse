const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Fichier de stockage des scores
const SCORES_FILE = path.join(__dirname, 'scores.json');

// Initialiser le fichier scores.json s'il n'existe pas
async function initScoresFile() {
    try {
        await fs.access(SCORES_FILE);
    } catch {
        const initialData = {
            hardcore: [],
            normal: [],
            easy: [],
            veryEasy: []
        };
        await fs.writeFile(SCORES_FILE, JSON.stringify(initialData, null, 2));
        console.log('✅ Fichier scores.json créé');
    }
}

// Charger les scores depuis le fichier JSON
async function loadScores() {
    try {
        const data = await fs.readFile(SCORES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lecture scores:', error);
        return {
            hardcore: [],
            normal: [],
            easy: [],
            veryEasy: []
        };
    }
}

// Sauvegarder les scores dans le fichier JSON
async function saveScores(scores) {
    try {
        await fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2));
    } catch (error) {
        console.error('Erreur sauvegarde scores:', error);
        throw error;
    }
}

// Route GET /api/scores - Récupérer tous les scores
app.get('/api/scores', async (req, res) => {
    try {
        const scores = await loadScores();
        res.json(scores);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des scores' });
    }
});

// Route POST /api/scores - Ajouter un nouveau score
app.post('/api/scores', async (req, res) => {
    try {
        const { player_name, points, level, coins, time, health, won, difficulty } = req.body;

        // Validation
        if (!player_name || points === undefined || !difficulty) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        // Charger les scores existants
        const scores = await loadScores();

        // Créer le nouveau score
        const newScore = {
            player_name: player_name.substring(0, 20),
            points: parseInt(points),
            level: parseInt(level),
            coins: parseInt(coins),
            time: parseInt(time),
            health: parseInt(health),
            won: Boolean(won),
            created_at: new Date().toISOString()
        };

        // Ajouter le score à la catégorie appropriée
        if (!scores[difficulty]) {
            scores[difficulty] = [];
        }
        scores[difficulty].push(newScore);

        // Trier par points décroissants
        scores[difficulty].sort((a, b) => b.points - a.points);

        // Sauvegarder dans le fichier
        await saveScores(scores);

        // Trouver le rang du joueur
        const rank = scores[difficulty].findIndex(s =>
            s.player_name === newScore.player_name &&
            s.points === newScore.points &&
            s.created_at === newScore.created_at
        ) + 1;

        res.json({
            success: true,
            score: newScore,
            rank: rank
        });

        console.log(`✅ Nouveau score: ${player_name} - ${points} pts (${difficulty})`);
    } catch (error) {
        console.error('Erreur ajout score:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du score' });
    }
});

// Route par défaut - Servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur
async function startServer() {
    await initScoresFile();
    app.listen(PORT, () => {
        console.log('🎮 ========================================');
        console.log('🎮  Super Dario Brosse - Serveur démarré');
        console.log('🎮 ========================================');
        console.log(`🌐 Ouvrez votre navigateur sur: http://localhost:${PORT}`);
        console.log(`📁 Scores sauvegardés dans: ${SCORES_FILE}`);
        console.log('🎮 ========================================');
    });
}

startServer();

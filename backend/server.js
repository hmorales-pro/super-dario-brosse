require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialiser la base de données
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scores (
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

      CREATE INDEX IF NOT EXISTS idx_difficulty_points
        ON scores(difficulty, points DESC);
    `);
    console.log('✅ Base de données initialisée');
  } catch (error) {
    console.error('❌ Erreur initialisation DB:', error);
  }
}

// Routes API

// GET /api/scores/:difficulty - Récupérer le top 10 d'une difficulté
app.get('/api/scores/:difficulty', async (req, res) => {
  try {
    const { difficulty } = req.params;
    const validDifficulties = ['hardcore', 'normal', 'easy', 'veryEasy'];

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ error: 'Difficulté invalide' });
    }

    const result = await pool.query(
      `SELECT player_name, points, level, coins, time, health, won, created_at
       FROM scores
       WHERE difficulty = $1
       ORDER BY points DESC, created_at ASC
       LIMIT 10`,
      [difficulty]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erreur récupération scores:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/scores - Récupérer tous les scores (top 10 par difficulté)
app.get('/api/scores', async (req, res) => {
  try {
    const difficulties = ['hardcore', 'normal', 'easy', 'veryEasy'];
    const allScores = {};

    for (const difficulty of difficulties) {
      const result = await pool.query(
        `SELECT player_name, points, level, coins, time, health, won, created_at
         FROM scores
         WHERE difficulty = $1
         ORDER BY points DESC, created_at ASC
         LIMIT 10`,
        [difficulty]
      );
      allScores[difficulty] = result.rows;
    }

    res.json(allScores);
  } catch (error) {
    console.error('Erreur récupération scores:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/scores - Ajouter un nouveau score
app.post('/api/scores', async (req, res) => {
  try {
    const { player_name, points, level, coins, time, health, won, difficulty } = req.body;

    // Validation
    if (!player_name || typeof points !== 'number' || !difficulty) {
      return res.status(400).json({ error: 'Données manquantes ou invalides' });
    }

    const validDifficulties = ['hardcore', 'normal', 'easy', 'veryEasy'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ error: 'Difficulté invalide' });
    }

    // Insérer le score
    const result = await pool.query(
      `INSERT INTO scores (player_name, points, level, coins, time, health, won, difficulty)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [player_name, points, level, coins, time, health, won, difficulty]
    );

    // Récupérer le rang du joueur
    const rankResult = await pool.query(
      `SELECT COUNT(*) + 1 as rank
       FROM scores
       WHERE difficulty = $1 AND points > $2`,
      [difficulty, points]
    );

    const rank = parseInt(rankResult.rows[0].rank);

    res.status(201).json({
      score: result.rows[0],
      rank: rank
    });
  } catch (error) {
    console.error('Erreur ajout score:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Démarrer le serveur
async function start() {
  await initDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });
}

start();

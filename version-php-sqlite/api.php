<?php
/**
 * API REST pour Super Dario Brosse
 * Utilise SQLite pour stocker les scores (fichier unique, pas de serveur DB requis)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration de la base de données SQLite
$db_file = __DIR__ . '/scores.db';

// Créer la connexion SQLite
try {
    $db = new PDO('sqlite:' . $db_file);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Créer la table si elle n'existe pas
    $db->exec("
        CREATE TABLE IF NOT EXISTS scores (
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
    ");

    // Créer un index sur la difficulté et les points pour des requêtes plus rapides
    $db->exec("CREATE INDEX IF NOT EXISTS idx_difficulty_points ON scores(difficulty, points DESC)");

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion à la base de données: ' . $e->getMessage()]);
    exit();
}

// Router les requêtes
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($method === 'GET' && strpos($path, '/api/scores') !== false) {
    // GET /api/scores - Récupérer tous les scores
    getScores($db);
} elseif ($method === 'POST' && strpos($path, '/api/scores') !== false) {
    // POST /api/scores - Ajouter un nouveau score
    addScore($db);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint non trouvé']);
}

/**
 * Récupérer tous les scores groupés par difficulté
 */
function getScores($db) {
    try {
        $difficulties = ['hardcore', 'normal', 'easy', 'veryEasy'];
        $result = [];

        foreach ($difficulties as $difficulty) {
            $stmt = $db->prepare("
                SELECT player_name, points, level, coins, time, health, won, created_at
                FROM scores
                WHERE difficulty = :difficulty
                ORDER BY points DESC
                LIMIT 100
            ");
            $stmt->execute(['difficulty' => $difficulty]);
            $result[$difficulty] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Convertir won en boolean
            foreach ($result[$difficulty] as &$score) {
                $score['won'] = (bool)$score['won'];
            }
        }

        echo json_encode($result);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de la récupération des scores: ' . $e->getMessage()]);
    }
}

/**
 * Ajouter un nouveau score
 */
function addScore($db) {
    try {
        // Récupérer les données JSON
        $input = json_decode(file_get_contents('php://input'), true);

        // Valider les données
        $required_fields = ['player_name', 'points', 'level', 'coins', 'time', 'health', 'won', 'difficulty'];
        foreach ($required_fields as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Champ manquant: $field"]);
                return;
            }
        }

        // Nettoyer et valider les données
        $player_name = substr(trim($input['player_name']), 0, 20);
        $points = (int)$input['points'];
        $level = (int)$input['level'];
        $coins = (int)$input['coins'];
        $time = (int)$input['time'];
        $health = (int)$input['health'];
        $won = (bool)$input['won'];
        $difficulty = $input['difficulty'];

        // Valider la difficulté
        $valid_difficulties = ['hardcore', 'normal', 'easy', 'veryEasy'];
        if (!in_array($difficulty, $valid_difficulties)) {
            http_response_code(400);
            echo json_encode(['error' => 'Difficulté invalide']);
            return;
        }

        // Insérer le score
        $stmt = $db->prepare("
            INSERT INTO scores (player_name, points, level, coins, time, health, won, difficulty)
            VALUES (:player_name, :points, :level, :coins, :time, :health, :won, :difficulty)
        ");

        $stmt->execute([
            'player_name' => $player_name,
            'points' => $points,
            'level' => $level,
            'coins' => $coins,
            'time' => $time,
            'health' => $health,
            'won' => $won ? 1 : 0,
            'difficulty' => $difficulty
        ]);

        $score_id = $db->lastInsertId();

        // Récupérer le score inséré
        $stmt = $db->prepare("SELECT * FROM scores WHERE id = :id");
        $stmt->execute(['id' => $score_id]);
        $score = $stmt->fetch(PDO::FETCH_ASSOC);
        $score['won'] = (bool)$score['won'];

        // Calculer le rang
        $stmt = $db->prepare("
            SELECT COUNT(*) + 1 as rank
            FROM scores
            WHERE difficulty = :difficulty AND points > :points
        ");
        $stmt->execute([
            'difficulty' => $difficulty,
            'points' => $points
        ]);
        $rank = $stmt->fetch(PDO::FETCH_ASSOC)['rank'];

        // Répondre avec le score et le rang
        echo json_encode([
            'success' => true,
            'score' => $score,
            'rank' => $rank
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de l\'ajout du score: ' . $e->getMessage()]);
    }
}
?>

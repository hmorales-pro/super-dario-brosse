@echo off
echo ========================================
echo   Super Dario Brosse - Version Standalone
echo ========================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé !
    echo 📥 Téléchargez-le sur: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js installé
echo.

REM Vérifier si les dépendances sont installées
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    call npm install --no-package-lock express
    echo.
)

REM Démarrer le serveur
echo 🚀 Démarrage du serveur...
echo.
node server.js

pause

#!/bin/bash

# PixelPump - Script de démarrage pour présentation
# Utilisation: ./start_demo.sh

echo "⚡ PixelPump - Démarrage de la démo"
echo "=================================="
echo

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ d'abord."
    exit 1
fi

# Vérifier si PostgreSQL fonctionne
if ! pg_isready &> /dev/null; then
    echo "⚠️  PostgreSQL ne semble pas accessible. Assurez-vous que PostgreSQL est démarré."
    echo
fi

echo "🔧 Préparation de l'environnement..."

# Aller dans le dossier du projet
cd "$(dirname "$0")/PixelPump" || exit 1

# Installer les dépendances backend si nécessaire
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installation des dépendances backend..."
    cd backend && npm install && cd ..
fi

# Installer les dépendances frontend si nécessaire  
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installation des dépendances frontend..."
    cd frontend && npm install && cd ..
fi

echo
echo "🚀 Démarrage des services..."
echo

# Fonction pour arrêter les processus en arrière-plan
cleanup() {
    echo
    echo "🛑 Arrêt des services..."
    jobs -p | xargs -r kill
    exit 0
}

# Capturer Ctrl+C pour un arrêt propre
trap cleanup SIGINT SIGTERM

# Démarrer le backend en arrière-plan
echo "🔧 Démarrage du backend (port 3001)..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Attendre que le backend démarre
echo "⏳ Attente du démarrage du backend..."
for i in {1..30}; do
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend démarré avec succès !"
        break
    fi
    sleep 1
    echo -n "."
done

echo

# Démarrer le frontend en arrière-plan
echo "🎨 Démarrage du frontend (port 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Attendre que le frontend démarre
echo "⏳ Attente du démarrage du frontend..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend démarré avec succès !"
        break
    fi
    sleep 1
    echo -n "."
done

echo
echo "🎉 PixelPump est prêt pour la démo !"
echo "=================================="
echo
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3001"
echo "🏥 Health:   http://localhost:3001/health"
echo
echo "🎮 COMPTE DE DÉMO:"
echo "   Email:    test@example.com"
echo "   Password: password123"
echo
echo "🌟 OU cliquez sur 'Essayer la démo' sur la page de connexion"
echo
echo "▶️  Appuyez sur Ctrl+C pour arrêter les services"
echo

# Attendre que l'utilisateur arrête les services
wait

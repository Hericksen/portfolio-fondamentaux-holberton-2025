#!/bin/bash

echo "🔧 Script de Réparation PixelPump"
echo "================================="

# Arrêter tous les processus existants
echo "🛑 Arrêt des processus existants..."
pkill -f "vite" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true

# Attendre que les processus se terminent
sleep 2

echo "🧹 Nettoyage des ports..."
# Les ports utilisés par défaut
FRONTEND_PORT=5173
BACKEND_PORT=3000

# Fonction pour libérer un port
free_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "  Libération du port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null || true
    fi
}

# Libérer les ports
free_port $FRONTEND_PORT
free_port $BACKEND_PORT
free_port 3001
free_port 3002
free_port 3003
free_port 3004
free_port 3005
free_port 3006

echo "🚀 Démarrage du backend..."
cd /root/porfolio-fondamentaux-holberton-2025/PixelPump/backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!

echo "⏳ Attente du démarrage du backend..."
sleep 3

echo "🎨 Démarrage du frontend..."
cd /root/porfolio-fondamentaux-holberton-2025/PixelPump/frontend

# Supprimer les anciens logs
rm -f frontend.log

# Démarrer le frontend avec un port spécifique
export VITE_PORT=5173
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!

echo "⏳ Attente du démarrage du frontend..."
sleep 5

# Vérifier les statuts
echo "📊 Vérification des services..."

# Vérifier le backend
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend OK sur http://localhost:3000"
else
    echo "❌ Backend non accessible"
    echo "  Logs backend:"
    tail -5 /root/porfolio-fondamentaux-holberton-2025/PixelPump/backend.log
fi

# Vérifier le frontend
sleep 2
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend OK sur http://localhost:5173"
elif curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Frontend OK sur http://localhost:3001"
elif curl -s http://localhost:3002 > /dev/null 2>&1; then
    echo "✅ Frontend OK sur http://localhost:3002"
else
    echo "❌ Frontend non accessible"
    echo "  Logs frontend:"
    tail -5 /root/porfolio-fondamentaux-holberton-2025/PixelPump/frontend.log
fi

echo ""
echo "🎯 Applications démarrées!"
echo "  Backend:  http://localhost:3000"
echo "  Frontend: http://localhost:5173 (ou port alternatif affiché ci-dessus)"
echo ""
echo "💡 Si page blanche, vérifiez:"
echo "  1. Les logs: tail -f backend.log frontend.log"
echo "  2. La console du navigateur (F12)"
echo "  3. Essayez: http://localhost:3001 ou http://localhost:3002"

# Optionnel: ouvrir le navigateur
if command -v xdg-open > /dev/null; then
    echo "🌐 Ouverture du navigateur..."
    xdg-open http://localhost:5173 2>/dev/null || xdg-open http://localhost:3001 2>/dev/null || true
fi

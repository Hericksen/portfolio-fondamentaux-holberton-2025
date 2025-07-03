#!/bin/bash

# PixelPump - Script de Démarrage Complet
# Usage: ./start.sh

echo "🎮 PixelPump - Démarrage Complet"
echo "================================"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Fonction pour afficher avec couleur
print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_header() {
    echo -e "\n${PURPLE}🚀 $1${NC}"
    echo "----------------------------------------"
}

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "backend/package.json" ] || [ ! -f "frontend/package.json" ]; then
    echo -e "${RED}❌ Erreur: Veuillez exécuter ce script depuis le répertoire racine PixelPump${NC}"
    exit 1
fi

print_header "Installation des dépendances"

# Installation Backend
print_info "Installation des dépendances backend..."
cd backend
if npm install > /dev/null 2>&1; then
    print_success "Dépendances backend installées"
else
    print_warning "Problème lors de l'installation backend"
fi

# Installation Frontend
cd ../frontend
print_info "Installation des dépendances frontend..."
if npm install > /dev/null 2>&1; then
    print_success "Dépendances frontend installées"
else
    print_warning "Problème lors de l'installation frontend"
fi

cd ..

print_header "Vérification de l'environnement"

# Vérifier PostgreSQL
if command -v psql &> /dev/null; then
    print_success "PostgreSQL détecté"
else
    print_warning "PostgreSQL non détecté. Assurez-vous qu'il est installé et démarré."
fi

# Vérifier les fichiers de configuration
if [ -f "backend/.env" ]; then
    print_success "Fichier .env backend présent"
else
    print_warning "Fichier .env backend manquant. Copiez .env.example vers .env"
fi

if [ -f "frontend/.env" ]; then
    print_success "Fichier .env frontend présent"
else
    print_info "Fichier .env frontend optionnel"
fi

print_header "Démarrage des serveurs"

# Fonction pour tuer les processus existants
cleanup() {
    echo -e "\n${YELLOW}🛑 Arrêt des serveurs...${NC}"
    pkill -f "node app.js" 2>/dev/null || true
    pkill -f "nodemon" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    sleep 2
    echo -e "${GREEN}✅ Serveurs arrêtés${NC}"
    exit 0
}

# Capture Ctrl+C pour arrêter proprement
trap cleanup SIGINT SIGTERM

# Démarrer le backend
print_info "Démarrage du backend..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 3

# Vérifier si le backend fonctionne
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    print_success "Backend démarré avec succès (http://localhost:3001)"
else
    print_warning "Problème de démarrage du backend. Vérifiez backend.log"
fi

# Démarrer le frontend
cd ../frontend
print_info "Démarrage du frontend..."
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!

# Attendre que le frontend démarre
sleep 5

# Detecter le port du frontend
FRONTEND_PORT=$(ss -tlnp | grep node | grep -o ":[0-9]*" | grep -v ":3001" | head -1 | cut -d: -f2)

if [ ! -z "$FRONTEND_PORT" ]; then
    print_success "Frontend démarré avec succès (http://localhost:$FRONTEND_PORT)"
else
    print_warning "Problème de démarrage du frontend. Vérifiez frontend.log"
    FRONTEND_PORT="5173"
fi

cd ..

print_header "PixelPump est prêt !"

echo -e "${GREEN}🎉 Démarrage réussi !${NC}"
echo ""
echo -e "${BLUE}📡 URLs d'accès :${NC}"
echo -e "   🔧 Backend API:    ${GREEN}http://localhost:3001${NC}"
echo -e "   🖥️  Frontend App:   ${GREEN}http://localhost:$FRONTEND_PORT${NC}"
echo -e "   📖 Documentation:  ${GREEN}http://localhost:3001/${NC}"
echo -e "   🏥 Health Check:   ${GREEN}http://localhost:3001/health${NC}"
echo ""
echo -e "${YELLOW}📋 Commandes utiles :${NC}"
echo -e "   - Ctrl+C : Arrêter les serveurs"
echo -e "   - tail -f backend.log : Voir les logs backend"
echo -e "   - tail -f frontend.log : Voir les logs frontend"
echo ""
echo -e "${PURPLE}🎮 Bon développement avec PixelPump !${NC}"

# Attendre et surveiller les processus
wait $BACKEND_PID $FRONTEND_PID

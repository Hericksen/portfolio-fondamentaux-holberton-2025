#!/bin/bash

# 🏥 Script de vérification de santé PixelPump

echo "🏥 Vérification de l'état de PixelPump..."
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
BACKEND_PORT=3001
FRONTEND_PORT=3000
BACKEND_URL="http://localhost:$BACKEND_PORT"
FRONTEND_URL="http://localhost:$FRONTEND_PORT"

# Fonction pour vérifier si un port est utilisé
check_port() {
    local port=$1
    local service=$2

    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service ($port)${NC} - ACTIF"
        return 0
    else
        echo -e "${RED}❌ $service ($port)${NC} - INACTIF"
        return 1
    fi
}

# Fonction pour vérifier une URL
check_url() {
    local url=$1
    local service=$2

    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service${NC} - ACCESSIBLE"
        return 0
    else
        echo -e "${RED}❌ $service${NC} - INACCESSIBLE"
        return 1
    fi
}

# Vérification des prérequis système
echo -e "${BLUE}🔍 Vérification des prérequis système:${NC}"

command -v node >/dev/null 2>&1 && echo -e "${GREEN}✅ Node.js${NC} - INSTALLÉ" || echo -e "${RED}❌ Node.js${NC} - NON INSTALLÉ"
command -v npm >/dev/null 2>&1 && echo -e "${GREEN}✅ npm${NC} - INSTALLÉ" || echo -e "${RED}❌ npm${NC} - NON INSTALLÉ"
command -v psql >/dev/null 2>&1 && echo -e "${GREEN}✅ PostgreSQL${NC} - INSTALLÉ" || echo -e "${YELLOW}⚠️  PostgreSQL${NC} - NON DÉTECTÉ"

echo ""

# Vérification des services
echo -e "${BLUE}🚀 Vérification des services:${NC}"

check_port $BACKEND_PORT "Backend API"
check_port $FRONTEND_PORT "Frontend App"

echo ""

# Vérification des endpoints
echo -e "${BLUE}🌐 Vérification des endpoints:${NC}"

check_url "$BACKEND_URL/health" "Backend Health"
check_url "$BACKEND_URL/" "Backend API Info"
check_url "$FRONTEND_URL" "Frontend App"

echo ""

# Vérification des fichiers de configuration
echo -e "${BLUE}📁 Vérification des fichiers:${NC}"

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ backend/.env${NC} - PRÉSENT"
else
    echo -e "${YELLOW}⚠️  backend/.env${NC} - MANQUANT (copiez .env.example)"
fi

if [ -f "backend/package.json" ]; then
    echo -e "${GREEN}✅ backend/package.json${NC} - PRÉSENT"
else
    echo -e "${RED}❌ backend/package.json${NC} - MANQUANT"
fi

if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}✅ frontend/package.json${NC} - PRÉSENT"
else
    echo -e "${RED}❌ frontend/package.json${NC} - MANQUANT"
fi

# Vérification des dépendances
echo ""
echo -e "${BLUE}📦 Vérification des dépendances:${NC}"

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Backend node_modules${NC} - INSTALLÉES"
else
    echo -e "${YELLOW}⚠️  Backend node_modules${NC} - MANQUANTES (run: cd backend && npm install)"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Frontend node_modules${NC} - INSTALLÉES"
else
    echo -e "${YELLOW}⚠️  Frontend node_modules${NC} - MANQUANTES (run: cd frontend && npm install)"
fi

echo ""
echo -e "${BLUE}📊 Résumé:${NC}"
echo "🏥 Vérification terminée"
echo ""
echo -e "${YELLOW}Pour démarrer les services:${NC}"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: cd frontend && npm run dev"

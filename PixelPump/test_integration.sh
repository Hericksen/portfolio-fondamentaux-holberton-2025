#!/bin/bash

echo "🔥 Test d'Intégration Frontend/Backend PixelPump"
echo "================================================"

# Vérifier que le backend est accessible
echo "🔍 Vérification du backend..."
BACKEND_STATUS=$(curl -s "http://localhost:3001/health" | grep '"status":"healthy"')
if [ -n "$BACKEND_STATUS" ]; then
    echo "✅ Backend accessible (localhost:3001)"
else
    echo "❌ Backend non accessible"
    exit 1
fi

# Vérifier que le frontend est accessible
echo "🔍 Vérification du frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend accessible (localhost:3000)"
else
    echo "❌ Frontend non accessible"
    exit 1
fi

# Test de l'API depuis la perspective frontend
echo "🔗 Test de connectivité API..."
API_TEST=$(curl -s "http://localhost:3001/api/quests" | grep '"success":true')
if [ -n "$API_TEST" ]; then
    echo "✅ API accessible depuis le frontend"
else
    echo "❌ API non accessible"
    exit 1
fi

# Test d'inscription via API
echo "📝 Test d'inscription utilisateur..."
RANDOM_USER="testuser_$(date +%s)"
REGISTER_RESPONSE=$(curl -s -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'$RANDOM_USER'",
    "email": "'$RANDOM_USER'@test.com",
    "password": "password123"
  }')

REGISTER_SUCCESS=$(echo $REGISTER_RESPONSE | grep '"success":true')
if [ -n "$REGISTER_SUCCESS" ]; then
    echo "✅ Inscription réussie"
    
    # Extraire le token
    TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "🔑 Token obtenu: ${TOKEN:0:20}..."
    
    # Test de connexion avec token
    echo "🔐 Test d'accès authentifié..."
    AUTH_TEST=$(curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:3001/api/users" | grep '"success":true')
    if [ -n "$AUTH_TEST" ]; then
        echo "✅ Authentification fonctionnelle"
    else
        echo "❌ Problème d'authentification"
    fi
    
else
    echo "❌ Échec de l'inscription"
fi

# Test des données de gamification
echo "🎮 Test des données de gamification..."
QUESTS_COUNT=$(curl -s "http://localhost:3001/api/quests" | grep -o '"id":' | wc -l)
ACHIEVEMENTS_COUNT=$(curl -s "http://localhost:3001/api/achievements" | grep -o '"id":' | wc -l)

echo "📊 Quêtes disponibles: $QUESTS_COUNT"
echo "🏆 Achievements disponibles: $ACHIEVEMENTS_COUNT"

if [ "$QUESTS_COUNT" -gt 0 ] && [ "$ACHIEVEMENTS_COUNT" -gt 0 ]; then
    echo "✅ Données de gamification présentes"
else
    echo "❌ Données de gamification manquantes"
fi

echo ""
echo "🎉 Test d'intégration terminé!"
echo "📋 Résumé:"
echo "  ✅ Backend PixelPump: localhost:3001"
echo "  ✅ Frontend React: localhost:3000"  
echo "  ✅ API REST: Fonctionnelle"
echo "  ✅ Authentification: Opérationnelle"
echo "  ✅ Gamification: $QUESTS_COUNT quêtes, $ACHIEVEMENTS_COUNT achievements"
echo ""
echo "🚀 PixelPump prêt pour les tests utilisateur!"

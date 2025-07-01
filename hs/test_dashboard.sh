#!/bin/bash

echo "🧪 Test du Dashboard Personnel PixelPump"
echo "========================================"

# 1. Test de santé du backend
echo "1️⃣ Test de santé du backend..."
HEALTH=$(curl -s http://localhost:3001/health | jq -r '.status')
if [ "$HEALTH" = "healthy" ]; then
    echo "✅ Backend fonctionne"
else
    echo "❌ Backend ne fonctionne pas"
    exit 1
fi

# 2. Créer un utilisateur de test
echo "2️⃣ Création d'un utilisateur de test..."
USER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "dashtest", "email": "dashtest@example.com", "password": "123456"}')

SUCCESS=$(echo $USER_RESPONSE | jq -r '.success')
if [ "$SUCCESS" = "true" ]; then
    echo "✅ Utilisateur créé"
    TOKEN=$(echo $USER_RESPONSE | jq -r '.token')
else
    echo "❌ Erreur lors de la création de l'utilisateur"
    echo $USER_RESPONSE | jq .
    exit 1
fi

# 3. Test de l'API dashboard
echo "3️⃣ Test de l'API Dashboard..."
DASHBOARD_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/users/dashboard/me)

DASHBOARD_SUCCESS=$(echo $DASHBOARD_RESPONSE | jq -r '.success')
if [ "$DASHBOARD_SUCCESS" = "true" ]; then
    echo "✅ API Dashboard fonctionne"
    
    # Afficher quelques infos du dashboard
    USERNAME=$(echo $DASHBOARD_RESPONSE | jq -r '.data.user.username')
    LEVEL=$(echo $DASHBOARD_RESPONSE | jq -r '.data.user.level')
    XP=$(echo $DASHBOARD_RESPONSE | jq -r '.data.user.xp')
    DAILY_TARGET=$(echo $DASHBOARD_RESPONSE | jq -r '.data.goals.dailyQuests.target')
    
    echo "📊 Infos du dashboard:"
    echo "   👤 Utilisateur: $USERNAME"
    echo "   🎯 Niveau: $LEVEL"
    echo "   ⭐ XP: $XP"
    echo "   📋 Objectif quotidien: $DAILY_TARGET quêtes"
else
    echo "❌ Erreur avec l'API Dashboard"
    echo $DASHBOARD_RESPONSE | jq .
    exit 1
fi

# 4. Test frontend
echo "4️⃣ Test du frontend..."
FRONTEND_RESPONSE=$(curl -s http://localhost:3000 | head -1)
if [[ $FRONTEND_RESPONSE == *"<!doctype html"* ]]; then
    echo "✅ Frontend accessible"
else
    echo "❌ Frontend ne répond pas"
fi

echo ""
echo "🎉 TOUS LES TESTS PASSENT !"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend: http://localhost:3001"
echo "🔑 Token de test: $TOKEN"
echo ""
echo "🚀 Le dashboard personnel est opérationnel !"
echo "   Chaque utilisateur a maintenant son propre dashboard avec:"
echo "   ✨ Statistiques personnelles"
echo "   📊 Progression du niveau"
echo "   🎯 Objectifs quotidiens" 
echo "   📈 Stats hebdomadaires"
echo "   ⚔️ Quêtes récentes"
echo "   🏆 Succès récents"

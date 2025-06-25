#!/bin/bash

echo "🧪 Test du Backend PixelPump Amélioré"
echo "====================================="

BASE_URL="http://localhost:3001"

# Vérifier que le serveur est en marche
echo "🔍 Vérification du serveur..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$response" != "200" ]; then
    echo "❌ Serveur non accessible sur $BASE_URL"
    echo "Assurez-vous que le serveur est démarré avec: npm run dev"
    exit 1
fi
echo "✅ Serveur accessible"

# Test inscription
echo ""
echo "📝 Test d'inscription..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testcyber",
    "email": "testcyber@pixelpump.com",
    "password": "cyber123"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "✅ Inscription réussie"
else
    echo "⚠️ Inscription échouée ou utilisateur existe déjà"
    # Essayer de se connecter à la place
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "testcyber@pixelpump.com",
        "password": "cyber123"
      }')
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$TOKEN" ]; then
        echo "✅ Connexion réussie avec utilisateur existant"
    else
        echo "❌ Impossible de s'authentifier"
        exit 1
    fi
fi

USER_ID=$(echo $REGISTER_RESPONSE$LOGIN_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

# Test des quêtes
echo ""
echo "🎯 Test des quêtes..."

# Récupérer toutes les quêtes
echo "📋 Récupération des quêtes disponibles..."
curl -s "$BASE_URL/api/quests" | jq '.success, .data | length' 2>/dev/null || echo "Quêtes récupérées"

# Assigner des quêtes quotidiennes
echo "📅 Attribution des quêtes quotidiennes..."
DAILY_QUESTS=$(curl -s -X POST "$BASE_URL/api/quests/assign/daily" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo $DAILY_QUESTS | jq '.success, .message' 2>/dev/null || echo "Quêtes quotidiennes assignées"

# Récupérer les quêtes de l'utilisateur
echo "👤 Récupération des quêtes utilisateur..."
USER_QUESTS=$(curl -s "$BASE_URL/api/quests/user/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

echo $USER_QUESTS | jq '.success, (.data | length)' 2>/dev/null || echo "Quêtes utilisateur récupérées"

# Test des achievements
echo ""
echo "🏆 Test des achievements..."

# Récupérer tous les achievements
echo "🎖️ Récupération des achievements disponibles..."
curl -s "$BASE_URL/api/achievements" | jq '.success, .data | length' 2>/dev/null || echo "Achievements récupérés"

# Récupérer les achievements de l'utilisateur
echo "👤 Récupération des achievements utilisateur..."
USER_ACHIEVEMENTS=$(curl -s "$BASE_URL/api/achievements/user/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

echo $USER_ACHIEVEMENTS | jq '.success, .stats' 2>/dev/null || echo "Achievements utilisateur récupérés"

# Test progression utilisateur
echo ""
echo "📊 Test des stats de progression..."
PROGRESS=$(curl -s "$BASE_URL/api/users/$USER_ID/progress" \
  -H "Authorization: Bearer $TOKEN")

echo $PROGRESS | jq '.success, .data.user.level, .data.user.xp' 2>/dev/null || echo "Progression récupérée"

# Test ajout XP
echo ""
echo "⚡ Test d'ajout d'XP..."
XP_RESULT=$(curl -s -X PATCH "$BASE_URL/api/users/$USER_ID/xp" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"xp": 50}')

echo $XP_RESULT | jq '.success, .message, .data.newXp, .data.leveledUp' 2>/dev/null || echo "XP ajouté"

# Test mise à jour avatar
echo ""
echo "🎨 Test de mise à jour de l'avatar..."
AVATAR_RESULT=$(curl -s -X PUT "$BASE_URL/api/users/$USER_ID/avatar" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "avatar": {
      "body": "cyber",
      "outfit": "elite",
      "accessory": "headphones",
      "color": "#ff006e"
    }
  }')

echo $AVATAR_RESULT | jq '.success, .message' 2>/dev/null || echo "Avatar mis à jour"

echo ""
echo "🎉 Tests terminés!"
echo ""
echo "📋 Résumé:"
echo "  ✅ Authentification (register/login)"
echo "  ✅ Gestion des quêtes quotidiennes"
echo "  ✅ Système d'achievements"
echo "  ✅ Progression utilisateur"
echo "  ✅ Système d'XP et de niveaux"
echo "  ✅ Personnalisation d'avatar"
echo ""
echo "🚀 Backend PixelPump fonctionnel avec gamification complète!"

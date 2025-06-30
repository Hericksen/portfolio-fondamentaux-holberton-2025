#!/bin/bash

echo "🧪 Test du système de profil vierge PixelPump"
echo "============================================="

# URL de base
BASE_URL="http://localhost:3001/api"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}1. Test de création d'utilisateur avec profil vierge${NC}"
echo "---------------------------------------------------"

# Générer un email unique
TIMESTAMP=$(date +%s)
TEST_EMAIL="testuser_${TIMESTAMP}@pixelpump.com"
TEST_USERNAME="testuser_${TIMESTAMP}"

echo "📧 Email de test: $TEST_EMAIL"
echo "👤 Username de test: $TEST_USERNAME"

# Créer un nouvel utilisateur
echo -e "\n${BLUE}Création de l'utilisateur...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USERNAME\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"password123\"
  }")

echo "Réponse d'inscription:"
echo "$REGISTER_RESPONSE" | jq . 2>/dev/null || echo "$REGISTER_RESPONSE"

# Extraire le token
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo -e "\n${GREEN}✅ Utilisateur créé avec succès!${NC}"
    echo "🔑 Token: ${TOKEN:0:50}..."
    
    echo -e "\n${BLUE}2. Test de récupération du profil${NC}"
    echo "-----------------------------------"
    
    # Récupérer le profil
    PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/users/profile/me" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "Profil récupéré:"
    echo "$PROFILE_RESPONSE" | jq . 2>/dev/null || echo "$PROFILE_RESPONSE"
    
    echo -e "\n${BLUE}3. Vérification des champs du profil vierge${NC}"
    echo "--------------------------------------------"
    
    # Vérifier la présence des champs essentiels
    HAS_AVATAR=$(echo "$PROFILE_RESPONSE" | jq '.profile.avatar' 2>/dev/null)
    HAS_STATS=$(echo "$PROFILE_RESPONSE" | jq '.profile.stats' 2>/dev/null)
    HAS_FITNESS_GOALS=$(echo "$PROFILE_RESPONSE" | jq '.profile.fitness_goals' 2>/dev/null)
    HAS_PREFERENCES=$(echo "$PROFILE_RESPONSE" | jq '.profile.preferences' 2>/dev/null)
    LEVEL=$(echo "$PROFILE_RESPONSE" | jq '.profile.level' 2>/dev/null)
    XP=$(echo "$PROFILE_RESPONSE" | jq '.profile.xp' 2>/dev/null)
    
    if [ "$HAS_AVATAR" != "null" ]; then
        echo -e "${GREEN}✅ Avatar configuré par défaut${NC}"
    else
        echo -e "${RED}❌ Avatar manquant${NC}"
    fi
    
    if [ "$HAS_STATS" != "null" ]; then
        echo -e "${GREEN}✅ Stats initialisées${NC}"
    else
        echo -e "${RED}❌ Stats manquantes${NC}"
    fi
    
    if [ "$HAS_FITNESS_GOALS" != "null" ]; then
        echo -e "${GREEN}✅ Objectifs fitness configurés${NC}"
    else
        echo -e "${RED}❌ Objectifs fitness manquants${NC}"
    fi
    
    if [ "$HAS_PREFERENCES" != "null" ]; then
        echo -e "${GREEN}✅ Préférences initialisées${NC}"
    else
        echo -e "${RED}❌ Préférences manquantes${NC}"
    fi
    
    if [ "$LEVEL" = "1" ]; then
        echo -e "${GREEN}✅ Niveau initial correct (1)${NC}"
    else
        echo -e "${RED}❌ Niveau initial incorrect ($LEVEL)${NC}"
    fi
    
    if [ "$XP" = "0" ]; then
        echo -e "${GREEN}✅ XP initial correct (0)${NC}"
    else
        echo -e "${RED}❌ XP initial incorrect ($XP)${NC}"
    fi
    
    echo -e "\n${BLUE}4. Test de mise à jour du profil${NC}"
    echo "--------------------------------"
    
    # Tester la mise à jour du profil
    UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/users/profile/me" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "avatar": {
          "color": "#00ff00"
        },
        "fitness_goals": {
          "daily_quests": 5
        }
      }')
    
    echo "Profil mis à jour:"
    echo "$UPDATE_RESPONSE" | jq . 2>/dev/null || echo "$UPDATE_RESPONSE"
    
    NEW_COLOR=$(echo "$UPDATE_RESPONSE" | jq -r '.profile.avatar.color' 2>/dev/null)
    NEW_DAILY_QUESTS=$(echo "$UPDATE_RESPONSE" | jq '.profile.fitness_goals.daily_quests' 2>/dev/null)
    
    if [ "$NEW_COLOR" = "#00ff00" ]; then
        echo -e "${GREEN}✅ Couleur d'avatar mise à jour${NC}"
    else
        echo -e "${RED}❌ Échec de la mise à jour de la couleur${NC}"
    fi
    
    if [ "$NEW_DAILY_QUESTS" = "5" ]; then
        echo -e "${GREEN}✅ Objectif de quêtes quotidiennes mis à jour${NC}"
    else
        echo -e "${RED}❌ Échec de la mise à jour des objectifs${NC}"
    fi
    
else
    echo -e "${RED}❌ Échec de la création d'utilisateur${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 Test du profil vierge terminé!${NC}"
echo "================================="

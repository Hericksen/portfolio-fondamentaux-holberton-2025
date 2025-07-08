#!/bin/bash

echo "🧪 Script de test PixelPump Frontend/Backend"
echo "============================================="

# Test 1: Health check
echo ""
echo "1️⃣ Test health check backend..."
curl -s http://localhost:3001/health | jq '.'

# Test 2: Login et récupération du token
echo ""
echo "2️⃣ Test de connexion..."
LOGIN_RESPONSE=$(curl -s http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pixelpump.com","password":"admin123"}')

echo "Réponse login:"
echo $LOGIN_RESPONSE | jq '.'

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo ""
echo "Token obtenu: ${TOKEN:0:50}..."

# Test 3: Dashboard avec token
echo ""
echo "3️⃣ Test dashboard avec authentification..."
curl -s http://localhost:3001/api/users/dashboard/me \
  -H "Authorization: Bearer $TOKEN" | jq '.success, .message, .data.user.username, .data.user.email'

# Test 4: Test frontend accessibility
echo ""
echo "4️⃣ Test accessibilité frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002)
echo "Status code frontend: $FRONTEND_STATUS"

if [ "$FRONTEND_STATUS" = "200" ]; then
  echo "✅ Frontend accessible"
else
  echo "❌ Frontend non accessible"
fi

echo ""
echo "🎉 Tests terminés !"

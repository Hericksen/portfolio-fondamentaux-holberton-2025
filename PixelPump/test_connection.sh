#!/bin/bash

echo "🔄 Test complet Backend/Frontend..."
echo

# Test 1: Backend Health
echo "1. Test Backend Health:"
curl -s http://localhost:3001/health | jq '.status // .'
echo

# Test 2: Créer utilisateur
echo "2. Test Création utilisateur:"
USER_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username":"testbash","email":"testbash@example.com","password":"password123"}' http://localhost:3001/api/users)
echo $USER_RESPONSE | jq '.success // .' 2>/dev/null || echo "$USER_RESPONSE"
echo

# Test 3: Login
echo "3. Test Login:"
LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"testbash@example.com","password":"password123"}' http://localhost:3001/api/auth/login)
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // empty' 2>/dev/null)
echo $LOGIN_RESPONSE | jq '.success // .' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo

# Test 4: Dashboard
if [ -n "$TOKEN" ]; then
    echo "4. Test Dashboard avec token:"
    DASHBOARD_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/users/dashboard/me)
    echo $DASHBOARD_RESPONSE | jq '.success // .' 2>/dev/null || echo "$DASHBOARD_RESPONSE"
else
    echo "4. ❌ Pas de token, impossible de tester le dashboard"
fi
echo

# Test 5: Test direct depuis frontend (simulation)
echo "5. Test URL que le frontend utilise:"
echo "Base URL API: http://localhost:3001/api"
echo "URL Dashboard: http://localhost:3001/api/users/dashboard/me"
echo

# Test 6: Vérifier CORS
echo "6. Test CORS depuis un autre port:"
curl -s -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: authorization" -X OPTIONS http://localhost:3001/api/users/dashboard/me
echo

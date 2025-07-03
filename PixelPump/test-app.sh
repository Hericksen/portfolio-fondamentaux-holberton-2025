#!/bin/bash

echo "🧪 PixelPump - Tests Complets"
echo "============================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

success=0
failed=0

test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="$3"

    echo -n "Testing $name... "

    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $status)"
        ((success++))
    else
        echo -e "${RED}❌ FAIL${NC} (Expected $expected_status, got $status)"
        ((failed++))
    fi
}

test_json_endpoint() {
    local name="$1"
    local url="$2"
    local expected_field="$3"

    echo -n "Testing $name... "

    response=$(curl -s "$url")

    if echo "$response" | grep -q "$expected_field"; then
        echo -e "${GREEN}✅ PASS${NC} (Contains '$expected_field')"
        ((success++))
    else
        echo -e "${RED}❌ FAIL${NC} (Missing '$expected_field')"
        echo "Response: $response"
        ((failed++))
    fi
}

echo -e "${BLUE}🏥 Health Checks${NC}"
echo "----------------"
test_json_endpoint "Backend Health" "http://localhost:3001/health" "healthy"
test_endpoint "Frontend Access" "http://localhost:3000" "200"

echo -e "\n${BLUE}📡 API Endpoints${NC}"
echo "----------------"
test_json_endpoint "API Root" "http://localhost:3001/" "PixelPump Backend API"
test_json_endpoint "Auth Endpoint (no auth)" "http://localhost:3001/api/users" "Token manquant"

echo -e "\n${BLUE}🌐 Frontend Routes${NC}"
echo "-------------------"
test_endpoint "Main App" "http://localhost:3000" "200"
test_endpoint "Assets" "http://localhost:3000/vite.svg" "200"

echo -e "\n${BLUE}📊 Résultats${NC}"
echo "============"
echo -e "${GREEN}✅ Tests réussis: $success${NC}"
echo -e "${RED}❌ Tests échoués: $failed${NC}"

if [ $failed -eq 0 ]; then
    echo -e "\n${GREEN}🎉 Tous les tests sont passés ! PixelPump fonctionne correctement.${NC}"
    exit 0
else
    echo -e "\n${YELLOW}⚠️  Certains tests ont échoué. Vérifiez la configuration.${NC}"
    exit 1
fi

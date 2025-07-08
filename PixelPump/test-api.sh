#!/bin/bash

# Colors for better visibility
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API URL
API_URL="http://localhost:3001"

# Variable to store JWT token
TOKEN=""

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}     PixelPump API Testing Tool         ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Function to test an API endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local description=$3
  local data=$4
  local auth_header=""

  echo -e "\n${YELLOW}Testing: $description${NC}"
  echo -e "${BLUE}$method $API_URL$endpoint${NC}"
  
  if [ ! -z "$TOKEN" ] && [ "$5" != "no-auth" ]; then
    auth_header="-H \"Authorization: Bearer $TOKEN\""
  fi
  
  if [ "$method" == "GET" ]; then
    if [ ! -z "$TOKEN" ] && [ "$5" != "no-auth" ]; then
      response=$(curl -s -X $method "$API_URL$endpoint" -H "Authorization: Bearer $TOKEN")
    else
      response=$(curl -s -X $method "$API_URL$endpoint")
    fi
  else
    if [ ! -z "$TOKEN" ] && [ "$5" != "no-auth" ]; then
      response=$(curl -s -X $method "$API_URL$endpoint" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "$data")
    else
      response=$(curl -s -X $method "$API_URL$endpoint" -H "Content-Type: application/json" -d "$data")
    fi
  fi
  
  # Check if response is valid JSON
  if jq -e . >/dev/null 2>&1 <<<"$response"; then
    # Print formatted JSON
    echo -e "${GREEN}Response:${NC}"
    echo "$response" | jq '.'
    
    # If this is a login request, extract the token
    if [[ "$endpoint" == "/api/auth/login" && "$response" == *"token"* ]]; then
      TOKEN=$(echo "$response" | jq -r '.token')
      echo -e "${GREEN}Token received and stored for future requests.${NC}"
    fi
    
    return 0
  else
    echo -e "${RED}Invalid response:${NC}"
    echo "$response"
    return 1
  fi
}

# Run a sequence of API tests
run_tests() {
  # Health check
  test_endpoint "GET" "/" "Health Check" "" "no-auth"
  
  # 1. Register a test user
  test_endpoint "POST" "/api/auth/register" "Register User" '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123!"
  }' "no-auth"
  
  # 2. Login with test user
  test_endpoint "POST" "/api/auth/login" "Login User" '{
    "username": "testuser",
    "password": "Password123!"
  }' "no-auth"
  
  # 3. Get user profile
  test_endpoint "GET" "/api/users/me" "Get User Profile"
  
  # 4. Get available quests
  test_endpoint "GET" "/api/quests" "Get Available Quests"
  
  # 5. Get user quests
  test_endpoint "GET" "/api/quests/user/me" "Get User Quests"
  
  # 6. Get achievements
  test_endpoint "GET" "/api/achievements" "Get Achievements"
  
  # 7. Get user achievements
  test_endpoint "GET" "/api/achievements/user/me" "Get User Achievements"
  
  echo -e "\n${GREEN}=========================================${NC}"
  echo -e "${GREEN}  API Testing Complete! 🎉${NC}"
  echo -e "${GREEN}=========================================${NC}"
}

# Run the tests
run_tests

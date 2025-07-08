#!/bin/bash

# Colors for better visibility
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}     PixelPump Testing Utility          ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Function to check if a container is running
check_container() {
  local container_name=$1
  if [ "$(docker ps -q -f name=$container_name)" ]; then
    echo -e "${GREEN}✓ $container_name is running${NC}"
    return 0
  else
    echo -e "${RED}✗ $container_name is not running${NC}"
    return 1
  fi
}

# Function to check API health
check_api_health() {
  echo -e "\n${YELLOW}Checking API health...${NC}"
  local response=$(curl -s http://localhost:3001/)
  
  if [ $? -eq 0 ] && [[ "$response" == *"PixelPump Backend API"* ]]; then
    echo -e "${GREEN}✓ Backend API is operational${NC}"
    echo -e "${BLUE}API Response:${NC}"
    echo "$response" | grep -o '"status":"[^"]*"' | cut -d':' -f2 | tr -d '"'
    return 0
  else
    echo -e "${RED}✗ Backend API is not responding properly${NC}"
    return 1
  fi
}

# Function to check frontend availability
check_frontend() {
  echo -e "\n${YELLOW}Checking Frontend availability...${NC}"
  local response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/)
  
  if [ "$response" == "200" ]; then
    echo -e "${GREEN}✓ Frontend is accessible (Status code: $response)${NC}"
    echo -e "${BLUE}Frontend URL: http://localhost:5173/${NC}"
    return 0
  else
    echo -e "${RED}✗ Frontend is not accessible (Status code: $response)${NC}"
    return 1
  fi
}

# Start services
start_services() {
  echo -e "\n${YELLOW}Starting PixelPump services with Docker Compose...${NC}"
  docker-compose up -d
  
  echo -e "\n${YELLOW}Waiting for services to be ready...${NC}"
  sleep 5
  
  # Check containers
  check_container "pixelpump-db" && \
  check_container "pixelpump-backend" && \
  check_container "pixelpump-frontend"
  
  # Check services
  check_api_health && \
  check_frontend
  
  if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}=========================================${NC}"
    echo -e "${GREEN}  All services are up and running! 🚀${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${BLUE}Backend API: http://localhost:3001/${NC}"
    echo -e "${BLUE}Frontend: http://localhost:5173/${NC}"
    echo -e "${BLUE}Database: localhost:5433${NC}"
  else
    echo -e "\n${RED}Some services failed to start properly.${NC}"
  fi
}

# Stop services
stop_services() {
  echo -e "\n${YELLOW}Stopping PixelPump services...${NC}"
  docker-compose down
  echo -e "${GREEN}Services stopped.${NC}"
}

# Display usage
display_usage() {
  echo -e "\n${YELLOW}Usage:${NC}"
  echo -e "  ./test-pixelpump.sh start   - Start and test all services"
  echo -e "  ./test-pixelpump.sh stop    - Stop all services"
  echo -e "  ./test-pixelpump.sh status  - Check status of all services"
  echo -e "  ./test-pixelpump.sh logs    - View logs from all services"
  echo -e "  ./test-pixelpump.sh help    - Display this help message"
}

# Main logic
case "$1" in
  start)
    start_services
    ;;
  stop)
    stop_services
    ;;
  status)
    check_container "pixelpump-db" 
    check_container "pixelpump-backend"
    check_container "pixelpump-frontend"
    check_api_health
    check_frontend
    ;;
  logs)
    echo -e "\n${YELLOW}Showing logs from all services...${NC}"
    docker-compose logs -f
    ;;
  help|*)
    display_usage
    ;;
esac

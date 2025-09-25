#!/bin/bash

# Frontend-only deployment script for Pesabu Application
set -e

echo "🚀 Starting Pesabu Frontend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans

# Remove old images (optional)
if [ "$1" = "--clean" ]; then
    print_warning "Cleaning up old images..."
    docker system prune -f
    docker image prune -f
fi

# Build and start frontend service
print_status "Building and starting frontend service..."
docker-compose up --build -d frontend

# Wait for service to be ready
print_status "Waiting for frontend to be ready..."
sleep 30

# Check service health
print_status "Checking frontend health..."

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "✅ Frontend is running on http://localhost:3000"
else
    print_warning "⚠️  Frontend might not be ready yet. Check logs with: docker-compose logs frontend"
fi

print_status "🎉 Frontend deployment completed!"
print_status "📱 Frontend: http://localhost:3000"
print_status "🔧 Backend API: http://localhost:8000 (external)"

echo ""
print_status "Useful commands:"
echo "  View logs: docker-compose logs -f frontend"
echo "  Stop service: docker-compose down"
echo "  Restart service: docker-compose restart frontend"
echo "  View running containers: docker-compose ps"
echo "  Access container shell: docker-compose exec frontend sh"
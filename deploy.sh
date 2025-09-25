#!/bin/bash

# Deployment script for Pesabu Application
set -e

echo "🚀 Starting Pesabu Application Deployment..."

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

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p ssl
mkdir -p logs

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans

# Remove old images (optional)
if [ "$1" = "--clean" ]; then
    print_warning "Cleaning up old images..."
    docker system prune -f
    docker image prune -f
fi

# Build and start services
print_status "Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "✅ Frontend is running on http://localhost:3000"
else
    print_warning "⚠️  Frontend might not be ready yet"
fi

# Check backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    print_status "✅ Backend is running on http://localhost:8000"
else
    print_warning "⚠️  Backend might not be ready yet"
fi

# Check nginx
if curl -f http://localhost:80/health > /dev/null 2>&1; then
    print_status "✅ Nginx is running on http://localhost:80"
else
    print_warning "⚠️  Nginx might not be ready yet"
fi

print_status "🎉 Deployment completed!"
print_status "📱 Frontend: http://localhost:3000"
print_status "🔧 Backend API: http://localhost:8000"
print_status "🌐 Nginx Proxy: http://localhost:80"

echo ""
print_status "Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart"
echo "  View running containers: docker-compose ps"

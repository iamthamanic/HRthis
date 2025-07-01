#!/bin/bash

# HRthis Deployment Script für Hetzner Server
set -e

echo "🚀 Starting HRthis deployment..."

# Check if running on server
if [ "$HOSTNAME" != "your-hetzner-hostname" ]; then
    echo "⚠️  Warning: Not running on production server!"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production not found!"
    echo "Please create it from .env.production.template"
    exit 1
fi

# Load production environment
cp .env.production .env
export $(cat .env | grep -v '^#' | xargs)

# Check if Traefik network exists
if ! docker network ls | grep -q traefik; then
    echo "📡 Creating Traefik network..."
    docker network create traefik
fi

# Build images
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.production.yml build

# Stop old containers
echo "🛑 Stopping old containers..."
docker-compose -f docker-compose.production.yml down

# Start new containers
echo "🚀 Starting new containers..."
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo "📊 Checking service status..."
docker-compose -f docker-compose.production.yml ps

# Show logs
echo "📜 Recent logs:"
docker-compose -f docker-compose.production.yml logs --tail=50

echo "✅ Deployment complete!"
echo ""
echo "🌐 Services available at:"
echo "   Frontend: https://hrthis.kibubot.com"
echo "   API: https://hrthis-api.kibubot.com"
echo ""
echo "📋 Useful commands:"
echo "   Logs: docker-compose -f docker-compose.production.yml logs -f"
echo "   Status: docker-compose -f docker-compose.production.yml ps"
echo "   Restart: docker-compose -f docker-compose.production.yml restart"
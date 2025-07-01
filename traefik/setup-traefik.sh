#!/bin/bash

echo "🚀 Setting up Traefik..."

# Create acme.json with correct permissions
touch acme.json
chmod 600 acme.json

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create it with your email and password"
    exit 1
fi

# Generate password for Traefik dashboard
echo ""
echo "📝 Generate Traefik dashboard password:"
echo "Run: htpasswd -nb admin YOUR_PASSWORD"
echo "Then add it to .env file as TRAEFIK_PASSWORD"
echo ""

# Start Traefik
docker-compose up -d

echo "✅ Traefik setup complete!"
echo "🌐 Dashboard will be available at: https://traefik.kibubot.com"
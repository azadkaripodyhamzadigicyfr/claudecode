#!/bin/bash
# Start Odoo 19 services

set -e

echo "🚀 Starting Odoo 19..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update if needed."
    echo ""
fi

# Start services
echo "Starting Docker containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "odoo19_app.*Up"; then
    echo ""
    echo "✅ Odoo is starting up!"
    echo ""
    echo "📋 Access Information:"
    echo "   Odoo Web:    http://localhost:${ODOO_PORT:-8069}"
    echo "   Odoo Chat:   http://localhost:${ODOO_CHAT_PORT:-8072}"
    echo ""
    echo "📝 Useful commands:"
    echo "   View logs:   docker-compose logs -f odoo"
    echo "   Stop Odoo:   docker-compose down"
    echo "   Restart:     docker-compose restart odoo"
    echo ""
    echo "⏳ Please wait 30-60 seconds for Odoo to fully initialize..."
else
    echo ""
    echo "❌ Failed to start Odoo. Check logs with: docker-compose logs"
    exit 1
fi

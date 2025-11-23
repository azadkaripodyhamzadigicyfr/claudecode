#!/bin/bash
# Stop Odoo 19 services

set -e

echo "🛑 Stopping Odoo 19..."
echo ""

docker-compose down

echo ""
echo "✅ Odoo has been stopped."
echo ""
echo "💡 To start again, run: ./scripts/start.sh"
echo "💡 To remove all data, run: docker-compose down -v"

#!/bin/bash
# Restart Odoo 19 service

set -e

echo "🔄 Restarting Odoo 19..."
echo ""

docker-compose restart odoo

echo ""
echo "⏳ Waiting for Odoo to restart..."
sleep 5

echo "✅ Odoo has been restarted."
echo ""
echo "📋 Access at: http://localhost:${ODOO_PORT:-8069}"
echo "📝 View logs: docker-compose logs -f odoo"

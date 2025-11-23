#!/bin/bash
# View Odoo logs

set -e

SERVICE=${1:-odoo}

echo "📋 Viewing logs for: $SERVICE"
echo "Press Ctrl+C to exit"
echo ""

docker-compose logs -f "$SERVICE"

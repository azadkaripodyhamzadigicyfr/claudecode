#!/bin/bash
# Open Odoo shell for debugging

set -e

DB_NAME=${1:-odoo}

echo "🐚 Opening Odoo shell for database: $DB_NAME"
echo ""
echo "💡 Tips:"
echo "   - Access models: self.env['model.name']"
echo "   - Search records: self.env['res.partner'].search([])"
echo "   - Create record: self.env['res.partner'].create({'name': 'Test'})"
echo ""
echo "Press Ctrl+D or type 'exit()' to quit"
echo ""

docker-compose exec odoo odoo shell -d "$DB_NAME"

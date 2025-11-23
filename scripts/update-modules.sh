#!/bin/bash
# Update specified Odoo modules

set -e

DB_NAME=${1:-odoo}
shift
MODULES=$@

if [ -z "$MODULES" ]; then
    echo "❌ Error: Module name(s) required"
    echo ""
    echo "Usage: ./scripts/update-modules.sh [database] <module1> [module2] [module3] ..."
    echo ""
    echo "Example: ./scripts/update-modules.sh odoo example_module"
    exit 1
fi

echo "🔄 Updating modules in database: $DB_NAME"
echo "📦 Modules: $MODULES"
echo ""

for MODULE in $MODULES; do
    echo "Updating module: $MODULE"
    docker-compose exec odoo odoo -d "$DB_NAME" -u "$MODULE" --stop-after-init
done

echo ""
echo "✅ Modules updated successfully!"
echo ""
echo "🔄 Restarting Odoo..."
docker-compose restart odoo

echo ""
echo "✅ Done!"

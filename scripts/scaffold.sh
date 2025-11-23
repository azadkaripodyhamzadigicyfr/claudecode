#!/bin/bash
# Create a new Odoo module using scaffold

set -e

MODULE_NAME=$1

if [ -z "$MODULE_NAME" ]; then
    echo "❌ Error: Module name is required"
    echo ""
    echo "Usage: ./scripts/scaffold.sh <module_name>"
    echo ""
    echo "Example: ./scripts/scaffold.sh my_custom_module"
    exit 1
fi

echo "🏗️  Creating new Odoo module: $MODULE_NAME"
echo ""

# Check if module already exists
if [ -d "addons/$MODULE_NAME" ]; then
    echo "❌ Error: Module 'addons/$MODULE_NAME' already exists"
    exit 1
fi

# Create module using Odoo scaffold
docker-compose exec odoo odoo scaffold "$MODULE_NAME" /mnt/extra-addons

echo ""
echo "✅ Module created successfully!"
echo ""
echo "📁 Module location: addons/$MODULE_NAME"
echo ""
echo "📝 Next steps:"
echo "   1. Edit addons/$MODULE_NAME/__manifest__.py"
echo "   2. Add your models in addons/$MODULE_NAME/models/"
echo "   3. Add your views in addons/$MODULE_NAME/views/"
echo "   4. Restart Odoo: ./scripts/restart.sh"
echo "   5. Install the module from Odoo Apps menu"

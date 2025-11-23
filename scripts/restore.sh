#!/bin/bash
# Restore Odoo database from backup

set -e

BACKUP_FILE=$1
DB_NAME=${2:-odoo}

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file is required"
    echo ""
    echo "Usage: ./scripts/restore.sh <backup_file> [database_name]"
    echo ""
    echo "Example: ./scripts/restore.sh backups/odoo_20250123.sql.gz"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will replace the '$DB_NAME' database!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Restore cancelled"
    exit 1
fi

echo ""
echo "🔄 Restoring database: $DB_NAME"
echo "📁 From backup: $BACKUP_FILE"
echo ""

# Drop existing database
echo "Dropping existing database..."
docker-compose exec db dropdb -U odoo --if-exists "$DB_NAME"

# Create new database
echo "Creating new database..."
docker-compose exec db createdb -U odoo "$DB_NAME"

# Restore from backup
echo "Restoring from backup..."
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | docker-compose exec -T db psql -U odoo "$DB_NAME"
else
    cat "$BACKUP_FILE" | docker-compose exec -T db psql -U odoo "$DB_NAME"
fi

echo ""
echo "✅ Database restored successfully!"
echo ""
echo "🔄 Restarting Odoo..."
docker-compose restart odoo

echo ""
echo "✅ Done! Access Odoo at: http://localhost:${ODOO_PORT:-8069}"

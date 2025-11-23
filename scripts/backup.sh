#!/bin/bash
# Backup Odoo database

set -e

BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME=${1:-odoo}
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql"

echo "💾 Backing up database: $DB_NAME"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Perform backup
docker-compose exec -T db pg_dump -U odoo "$DB_NAME" > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

echo "✅ Backup completed successfully!"
echo ""
echo "📁 Backup file: $BACKUP_FILE"
echo "📊 File size: $(du -h "$BACKUP_FILE" | cut -f1)"
echo ""
echo "💡 To restore: gunzip -c $BACKUP_FILE | docker-compose exec -T db psql -U odoo $DB_NAME"

#!/bin/bash

# Shikkhok AI Platform - VPS Backup Script
# This script creates backups of the application and database

# Configuration
BACKUP_DIR="/var/backups/shikkhok-ai"
APP_DIR="/var/www/shikkhok-ai"
DB_NAME="shikkhok_ai"
DB_USER="shikkhok_user"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup the database
echo "Creating database backup..."
sudo -u postgres pg_dump $DB_NAME > "$BACKUP_FILE.sql"

# Backup the application files (excluding node_modules and .next)
echo "Creating application backup..."
tar --exclude="$APP_DIR/node_modules" --exclude="$APP_DIR/.next" -czf "$BACKUP_FILE.tar.gz" $APP_DIR

# Backup environment variables
if [ -f "$APP_DIR/.env.local" ]; then
  cp "$APP_DIR/.env.local" "$BACKUP_FILE.env"
fi

# Clean up old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*" -type f -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.sql and $BACKUP_FILE.tar.gz"

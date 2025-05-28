#!/bin/bash

# Shikkhok AI Platform - Monitoring Script
# This script checks the health of the application and services

# Check if Node.js is running
if ! pgrep node > /dev/null; then
  echo "ERROR: Node.js process is not running!"
  
  # Attempt to restart the application
  echo "Attempting to restart the application..."
  cd /var/www/shikkhok-ai
  pm2 restart shikkhok-ai
else
  echo "Node.js process is running."
fi

# Check if Nginx is running
if ! systemctl is-active --quiet nginx; then
  echo "ERROR: Nginx is not running!"
  
  # Attempt to restart Nginx
  echo "Attempting to restart Nginx..."
  systemctl restart nginx
else
  echo "Nginx is running."
fi

# Check if PostgreSQL is running
if ! systemctl is-active --quiet postgresql; then
  echo "ERROR: PostgreSQL is not running!"
  
  # Attempt to restart PostgreSQL
  echo "Attempting to restart PostgreSQL..."
  systemctl restart postgresql
else
  echo "PostgreSQL is running."
fi

# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
  echo "WARNING: Disk space is critically low! ($DISK_USAGE%)"
else
  echo "Disk space usage: $DISK_USAGE%"
fi

# Check memory usage
MEM_USAGE=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
if [ "$MEM_USAGE" -gt 90 ]; then
  echo "WARNING: Memory usage is critically high! ($MEM_USAGE%)"
else
  echo "Memory usage: $MEM_USAGE%"
fi

# Check application health
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)
if [ "$HTTP_STATUS" != "200" ]; then
  echo "ERROR: Application health check failed! Status: $HTTP_STATUS"
else
  echo "Application health check: OK"
fi

echo "Monitoring completed at $(date)"

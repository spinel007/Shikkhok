#!/bin/bash

# Shikkhok AI Platform - VPS Deployment Script
# This script handles the deployment process on a VPS server

# Text formatting
BOLD="\e[1m"
RED="\e[31m"
GREEN="\e[32m"
YELLOW="\e[33m"
BLUE="\e[34m"
RESET="\e[0m"

# Log functions
log_info() {
  echo -e "${BLUE}[INFO]${RESET} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${RESET} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${RESET} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${RESET} $1"
}

# Check if running as root or with sudo
if [ "$(id -u)" -ne 0 ]; then
  log_error "This script must be run as root or with sudo"
  exit 1
fi

# Welcome message
echo -e "${BOLD}===============================================${RESET}"
echo -e "${BOLD}   Shikkhok AI Platform - VPS Deployment      ${RESET}"
echo -e "${BOLD}===============================================${RESET}"
echo ""

# Configuration
APP_DIR="/var/www/shikkhok-ai"
NGINX_CONF="/etc/nginx/sites-available/shikkhok-ai"
DOMAIN="your-domain.com" # Default domain, can be changed via parameter

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --domain)
      DOMAIN="$2"
      shift 2
      ;;
    --help)
      echo "Usage: $0 [--domain yourdomain.com]"
      exit 0
      ;;
    *)
      log_error "Unknown parameter: $1"
      echo "Usage: $0 [--domain yourdomain.com]"
      exit 1
      ;;
  esac
done

log_info "Deploying Shikkhok AI Platform to VPS"
log_info "Domain: $DOMAIN"

# 1. Install required packages
log_info "Installing required packages..."
apt update
apt install -y nginx certbot python3-certbot-nginx postgresql postgresql-contrib build-essential

# 2. Install Node.js if not already installed
if ! command -v node &> /dev/null; then
  log_info "Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt install -y nodejs
fi

# 3. Install PM2 globally
log_info "Installing PM2 process manager..."
npm install -g pm2

# 4. Create application directory
log_info "Setting up application directory..."
mkdir -p $APP_DIR
chown -R $SUDO_USER:$SUDO_USER $APP_DIR

# 5. Configure Nginx
log_info "Configuring Nginx..."
cat > $NGINX_CONF << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Increase max upload size for image uploads
    client_max_body_size 10M;
    
    # Add security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    
    # Enable gzip compression
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
        application/javascript
        application/json
        application/x-javascript
        application/xml
        text/css
        text/javascript
        text/plain
        text/xml;
}
EOF

# Create symbolic link to enable the site
ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# 6. Set up SSL with Certbot
log_info "Setting up SSL certificate..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# 7. Create deployment script for the application
log_info "Creating application deployment script..."
cat > $APP_DIR/deploy.sh << EOF
#!/bin/bash

# Shikkhok AI Platform - Application Deployment Script
# This script updates the application code and restarts the service

# Pull latest changes
git pull

# Install dependencies
npm ci

# Build the application
npm run build

# Restart the application
pm2 restart shikkhok-ai || pm2 start npm --name "shikkhok-ai" -- start
EOF

chmod +x $APP_DIR/deploy.sh
chown $SUDO_USER:$SUDO_USER $APP_DIR/deploy.sh

# 8. Create PM2 ecosystem file
log_info "Creating PM2 ecosystem file..."
cat > $APP_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'shikkhok-ai',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 'max',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

chown $SUDO_USER:$SUDO_USER $APP_DIR/ecosystem.config.js

# 9. Set up PM2 to start on boot
log_info "Configuring PM2 to start on system boot..."
pm2 startup
env PATH=$PATH:/usr/bin pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER

# 10. Restart Nginx
log_info "Restarting Nginx..."
systemctl restart nginx

# 11. Final instructions
echo ""
echo -e "${BOLD}===============================================${RESET}"
echo -e "${BOLD}   Deployment Setup Complete!                 ${RESET}"
echo -e "${BOLD}===============================================${RESET}"
echo ""
log_success "VPS deployment setup completed successfully!"
echo ""
log_info "Next steps:"
echo "1. Clone your repository to $APP_DIR:"
echo "   git clone https://github.com/yourusername/shikkhok-ai.git $APP_DIR"
echo ""
echo "2. Set up your environment variables in $APP_DIR/.env.local"
echo ""
echo "3. Deploy your application:"
echo "   cd $APP_DIR && ./deploy.sh"
echo ""
echo "4. Your application will be available at: https://$DOMAIN"
echo ""
log_info "To update your application in the future, simply run:"
echo "   cd $APP_DIR && ./deploy.sh"
echo ""

exit 0

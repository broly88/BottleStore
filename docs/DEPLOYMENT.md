# Deployment Guide

This guide provides instructions for deploying the Alcohol E-Commerce Platform to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Docker Deployment](#docker-deployment)
4. [Manual Deployment](#manual-deployment)
5. [Database Setup](#database-setup)
6. [Production Checklist](#production-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

### Required Services
- **PostgreSQL 14+** - Database
- **Node.js 18+** - Backend runtime
- **Stripe Account** - Payment processing
- **Email Service** - Gmail, SendGrid, or similar
- **Cloudinary Account** (Optional) - Image hosting
- **Domain Name** - For production
- **SSL Certificate** - For HTTPS (Let's Encrypt recommended)

### Required Software
- Docker & Docker Compose (for Docker deployment)
- Git
- PM2 (for manual deployment)

## Environment Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd alcohol-ecommerce
```

### 2. Configure Environment Variables

#### Root Directory `.env`
```bash
cp .env.example .env
```

Edit `.env` with your production values:
```env
# Database
DB_USER=liquorshop_prod
DB_PASSWORD=<strong-random-password>
DB_NAME=liquorshop_production

# JWT (Generate strong random keys)
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>

# Stripe
STRIPE_SECRET_KEY=sk_live_<your-live-key>
STRIPE_WEBHOOK_SECRET=whsec_<your-webhook-secret>

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<app-password>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Company Information
COMPANY_LIQUOR_LICENSE=<your-liquor-license>
COMPANY_VAT_NUMBER=<your-vat-number>
```

#### Backend `.env`
```bash
cd backend
cp .env.example .env
```

Edit with production values (similar to root .env).

#### Frontend `.env`
```bash
cd frontend
cp .env.example .env
```

Edit with production API URL:
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_<your-live-key>
```

### 3. Generate Strong Secrets

Use these commands to generate secure secrets:
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# JWT Refresh Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Docker Deployment

### 1. Production Deployment with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 2. Run Database Migrations

```bash
# Connect to backend container
docker exec -it liquorshop-api sh

# Run migrations
cd /app
node database/migrate.js

# Seed initial data (optional)
node database/seed.js

# Exit container
exit
```

### 3. Verify Deployment

```bash
# Check backend health
curl http://localhost:5000/health

# Check frontend
curl http://localhost:80
```

### 4. Production Services

The Docker Compose setup includes:
- **PostgreSQL** - Port 5432
- **Backend API** - Port 5000
- **Frontend (Nginx)** - Port 80

### 5. SSL/HTTPS Setup

For production with SSL, use a reverse proxy like Nginx or Traefik:

**Example Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Manual Deployment

### 1. Database Setup

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql

CREATE DATABASE liquorshop_production;
CREATE USER liquorshop_prod WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE liquorshop_production TO liquorshop_prod;
\q
```

### 2. Backend Deployment

```bash
cd backend

# Install dependencies
npm ci --only=production

# Run migrations
node ../database/migrate.js

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name liquorshop-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 3. Frontend Deployment

```bash
cd frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Serve with Nginx
sudo apt install nginx

# Copy build files
sudo cp -r dist/* /var/www/liquorshop

# Configure Nginx
sudo nano /etc/nginx/sites-available/liquorshop
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/liquorshop;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/liquorshop /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Database Setup

### Running Migrations

```bash
cd database
node migrate.js
```

### Seeding Data

```bash
cd database
node seed.js
```

This creates:
- Admin user: admin@liquorshop.co.za / Admin123!@#
- Sample customer: john@example.com / Customer123!@#
- Sample products in all categories

### Backup Strategy

```bash
# Create backup
pg_dump -U liquorshop_prod liquorshop_production > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U liquorshop_prod liquorshop_production < backup_20231215.sql

# Automated daily backups (cron)
0 2 * * * pg_dump -U liquorshop_prod liquorshop_production > /backups/backup_$(date +\%Y\%m\%d).sql
```

## Production Checklist

### Security
- [ ] Change all default passwords
- [ ] Generate strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable Helmet.js security headers
- [ ] Configure Stripe webhooks
- [ ] Set secure cookie settings
- [ ] Review file upload restrictions
- [ ] Enable database backups

### Stripe Configuration
- [ ] Switch to live Stripe keys
- [ ] Configure webhook endpoint: `https://api.yourdomain.com/api/payment/webhook`
- [ ] Test payment flow with live keys
- [ ] Verify ZAR currency is enabled
- [ ] Set up Stripe dashboard alerts

### Email Configuration
- [ ] Configure production email service
- [ ] Test email delivery
- [ ] Set up email templates
- [ ] Configure SPF/DKIM records
- [ ] Monitor email deliverability

### Monitoring
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Enable database monitoring
- [ ] Configure alerting

### Compliance
- [ ] Display liquor license number
- [ ] Display VAT registration number
- [ ] Add terms of service page
- [ ] Add privacy policy (POPIA compliant)
- [ ] Add responsible drinking message
- [ ] Verify age verification flow
- [ ] Test delivery restrictions

### Performance
- [ ] Enable CDN for static assets
- [ ] Configure caching headers
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Enable database connection pooling
- [ ] Set up Redis for sessions (optional)

## Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl https://api.yourdomain.com/health

# Database connection
psql -U liquorshop_prod -h localhost -d liquorshop_production -c "SELECT 1;"

# PM2 status
pm2 status

# Docker services
docker-compose ps
```

### Logs

**PM2 Logs:**
```bash
pm2 logs liquorshop-api
pm2 logs liquorshop-api --lines 100
```

**Docker Logs:**
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

**Nginx Logs:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Updates

```bash
# Pull latest code
git pull origin main

# Backend update
cd backend
npm ci --only=production
pm2 restart liquorshop-api

# Frontend update
cd frontend
npm ci
npm run build
sudo cp -r dist/* /var/www/liquorshop
```

### Database Maintenance

```bash
# Vacuum database
psql -U liquorshop_prod -d liquorshop_production -c "VACUUM ANALYZE;"

# Check database size
psql -U liquorshop_prod -d liquorshop_production -c "SELECT pg_size_pretty(pg_database_size('liquorshop_production'));"

# Check table sizes
psql -U liquorshop_prod -d liquorshop_production -c "SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

## Troubleshooting

### Common Issues

**Database Connection Failed:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

**Backend Not Starting:**
```bash
# Check logs
pm2 logs liquorshop-api --err

# Check environment variables
pm2 env liquorshop-api

# Restart
pm2 restart liquorshop-api
```

**Payment Failures:**
```bash
# Verify Stripe keys
# Check webhook is configured
# Review Stripe dashboard logs
# Test with Stripe CLI: stripe listen
```

## Scaling

### Horizontal Scaling

For high traffic, consider:
- Load balancer (Nginx, HAProxy)
- Multiple backend instances
- Redis for session management
- CDN for static assets
- Database read replicas

### Vertical Scaling

Increase resources:
- Database: Increase PostgreSQL memory/CPU
- Backend: Increase Node.js instances
- Caching: Add Redis caching layer

---

**Need Help?**
- Check logs first
- Review environment variables
- Test each service independently
- Consult the API documentation

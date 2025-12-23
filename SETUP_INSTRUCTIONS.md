# 🚀 Setup Instructions for Alcohol E-Commerce Platform

This guide will help you set up and run the Alcohol E-Commerce Platform on your local machine or server.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Docker & Docker Compose** (Optional but recommended) - [Download](https://www.docker.com/)
- **Git** - [Download](https://git-scm.com/)

## 🔧 Quick Start with Docker (Recommended)

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd alcohol-ecommerce
```

### Step 2: Configure Environment Variables

```bash
# Copy environment example file
cp .env.example .env

# Edit .env with your configuration
# Update these values:
# - DB_PASSWORD (choose a strong password)
# - JWT_SECRET (generate a random secret)
# - JWT_REFRESH_SECRET (generate another random secret)
# - STRIPE_SECRET_KEY (get from Stripe dashboard)
# - EMAIL credentials (your email service)
```

**Generate secrets:**
```bash
# For JWT_SECRET and JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3: Start All Services with Docker

```bash
# Build and start all containers
docker-compose up -d

# Check if all services are running
docker-compose ps
```

### Step 4: Run Database Migrations

```bash
# Method 1: From host machine
cd database
npm install
export DATABASE_URL="postgresql://liquorshop:liquorshop123@localhost:5432/liquorshop_db"
node migrate.js

# Method 2: Copy migration to container
docker cp database/migrations liquorshop-api:/app/migrations
```

### Step 5: Access the Application

- **Frontend**: http://localhost
- **Admin Dashboard**: http://localhost/admin
- **Backend API**: http://localhost:5000/api

**Done! 🎉** Your application is now running.

---

## 🛠️ Manual Setup (Without Docker)

### Step 1: Clone and Install

```bash
# Clone repository
git clone <your-repository-url>
cd alcohol-ecommerce
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your settings
# Update DATABASE_URL, JWT secrets, Stripe keys, etc.
```

### Step 3: Database Setup

```bash
# Create PostgreSQL database
createdb liquorshop_db

# OR using psql
psql -U postgres
CREATE DATABASE liquorshop_db;
\q

# Run migrations
cd ../database
npm install
export DATABASE_URL="postgresql://username:password@localhost:5432/liquorshop_db"
node migrate.js
```

### Step 4: Start Backend

```bash
cd ../backend

# Development mode
npm run dev

# Production mode
npm start
```

Backend will run on http://localhost:5000

### Step 5: Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env
# Update VITE_API_URL and VITE_STRIPE_PUBLISHABLE_KEY
```

### Step 6: Start Frontend

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

Frontend will run on http://localhost:3000 (dev) or http://localhost:4173 (preview)

---

## 🔑 Environment Variables Guide

### Root `.env` (for Docker Compose)

```env
# Database
DB_USER=liquorshop
DB_PASSWORD=your_secure_password_here
DB_NAME=liquorshop_db

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# URLs
FRONTEND_URL=http://localhost:3000

# Company Information (South Africa)
COMPANY_LIQUOR_LICENSE=LC12345/2024
COMPANY_VAT_NUMBER=4123456789
```

### Backend `.env`

Same as above, plus:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://liquorshop:password@localhost:5432/liquorshop_db
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

---

## 🗄️ Database Seeding (Optional)

To populate the database with sample data:

### Option 1: Manual SQL Insert

```sql
-- Connect to database
psql -U liquorshop liquorshop_db

-- Insert admin user (password: Admin123!@#)
INSERT INTO users (email, password_hash, first_name, last_name, date_of_birth, role, age_verified, email_verified)
VALUES ('admin@liquorshop.co.za', '$2a$12$...(bcrypt hash)', 'Admin', 'User', '1990-01-01', 'admin', true, true);

-- Insert sample products
-- (See database/seed.sql for complete examples)
```

### Option 2: Using Seed Script

```bash
cd database
node seed.js
```

**Default Credentials after seeding:**
- **Admin**: admin@liquorshop.co.za / Admin123!@#
- **Customer**: john@example.com / Customer123!@#

---

## 🐳 Docker Commands Reference

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker logs liquorshop-api -f
docker logs liquorshop-web -f
docker logs liquorshop-db -f

# Restart a service
docker-compose restart backend

# Rebuild a service
docker-compose up -d --build backend

# Execute command in container
docker exec -it liquorshop-api sh

# Remove all (including volumes)
docker-compose down -v
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
netstat -ano | findstr :5000   # Windows
lsof -i :5000                   # Mac/Linux

# Kill the process or change port in .env
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql   # Linux
brew services list                  # Mac

# Check connection string in .env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Docker Issues

```bash
# Check Docker is running
docker --version
docker compose version

# Reset Docker
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

### Frontend Not Loading

```bash
# Clear cache and rebuild
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

---

## 📚 Additional Resources

- **Full API Documentation**: See `docs/API.md`
- **Deployment Guide**: See `docs/DEPLOYMENT.md`
- **Project Structure**: See `README.md`

---

## 🤝 Support

If you encounter any issues:

1. Check this guide thoroughly
2. Review the error logs: `docker logs <container-name>`
3. Check environment variables are set correctly
4. Ensure all prerequisites are installed
5. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)

---

## 🎯 Next Steps

After successful setup:

1. ✅ Access the frontend at http://localhost
2. ✅ Test user registration and login
3. ✅ Browse products (if seeded)
4. ✅ Test admin dashboard at http://localhost/admin
5. ✅ Configure Stripe test mode for payments
6. ✅ Review and customize for your needs

---

**Happy Coding! 🍷**

# Setup Guide

This guide will help you set up the Alcohol E-Commerce Platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager
- **Git** (optional)

## Required Accounts

You'll need accounts for these services:

1. **Stripe** - For payment processing
   - Sign up at [stripe.com](https://stripe.com)
   - Get your API keys from the Dashboard

2. **Cloudinary** (Optional) - For image uploads
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get your cloud name, API key, and secret

3. **Email Service** - For sending emails
   - Gmail (with App Password) or
   - SendGrid, Mailgun, etc.

## Installation Steps

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd alcohol-ecommerce
```

Or download and extract the ZIP file.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install all required packages including:
- Express.js
- Sequelize (PostgreSQL ORM)
- JWT for authentication
- Stripe SDK
- bcryptjs for password hashing
- And many more...

### 3. Set Up PostgreSQL Database

#### Create the Database

Open PostgreSQL and create a new database:

```sql
CREATE DATABASE alcohol_shop;
```

Or use the command line:

```bash
createdb alcohol_shop
```

#### Verify Connection

Test your PostgreSQL connection:

```bash
psql -U postgres -d alcohol_shop
```

### 4. Configure Environment Variables

#### Backend Configuration

Copy the example environment file:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and update with your values:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alcohol_shop
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DATABASE_URL=postgresql://postgres:your_postgres_password@localhost:5432/alcohol_shop

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-characters
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Stripe (Get from stripe.com/dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CURRENCY=ZAR

# Email (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Company Info
COMPANY_NAME=Your Company Name
COMPANY_LIQUOR_LICENSE=LC12345/2024
COMPANY_VAT_NUMBER=4123456789

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Important Notes:

**JWT Secrets:**
Generate secure random strings for JWT secrets:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | %{Get-Random -Max 256}))
```

**Gmail App Password:**
If using Gmail, you need an App Password:
1. Enable 2-factor authentication
2. Go to Google Account → Security → App Passwords
3. Generate new app password for "Mail"
4. Use that password in EMAIL_PASSWORD

**Stripe Test Keys:**
Use test keys (starting with `sk_test_`) for development.

### 5. Initialize the Database

The application will automatically create tables on first run (in development mode).

Or manually seed the database with sample data:

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@alcoholshop.co.za` / `Admin123!`
- Customer user: `customer@example.com` / `Customer123!`
- Sample products (wines, beers, spirits)

### 6. Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:

```
╔════════════════════════════════════════╗
║                                        ║
║   🍷  Alcohol E-Commerce Platform      ║
║                                        ║
║   Server running on port 5000          ║
║   Environment: development             ║
║   API: http://localhost:5000/api       ║
║                                        ║
║   🔒 POPIA Compliant                   ║
║   🎂 Age Verification: 18+             ║
║   💳 Payment: Stripe (ZAR)             ║
║                                        ║
╚════════════════════════════════════════╝
```

Test the API:
```bash
curl http://localhost:5000/api/health
```

## Testing the Backend

### 1. Test Health Endpoint

```bash
curl http://localhost:5000/api/health
```

### 2. Test Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "dateOfBirth": "1995-01-01",
    "phone": "+27123456789"
  }'
```

### 3. Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@alcoholshop.co.za",
    "password": "Admin123!"
  }'
```

Save the token from the response for authenticated requests.

### 4. Test Products (No Auth Required)

```bash
curl http://localhost:5000/api/products
```

### 5. Test Authenticated Endpoint

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues

### Database Connection Failed

**Problem:** `Unable to connect to the database`

**Solutions:**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `createdb alcohol_shop`
- Test connection: `psql -U postgres -d alcohol_shop`

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
- Change PORT in `.env` to another port (e.g., 5001)
- Or kill the process using port 5000:
  ```bash
  # On Linux/Mac
  lsof -ti:5000 | xargs kill -9

  # On Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### Email Not Sending

**Problem:** Emails not being delivered

**Solutions:**
- Verify EMAIL_* settings in `.env`
- For Gmail, use App Password, not regular password
- Check spam folder
- View server logs for error messages

### Stripe Webhook Failed

**Problem:** Webhook signature verification failed

**Solutions:**
- Install Stripe CLI for local testing
- Use Stripe test webhook secret
- For production, set up webhook endpoint in Stripe Dashboard

## Development Workflow

### Starting the Server

```bash
cd backend
npm run dev
```

This uses `nodemon` which auto-restarts on file changes.

### Checking Logs

All requests are logged to console in development mode.

### Testing API Endpoints

Use tools like:
- **Postman** - GUI for API testing
- **cURL** - Command line
- **Thunder Client** - VS Code extension
- **Insomnia** - API client

### Database Management

View database:
```bash
psql -U postgres -d alcohol_shop
\dt  # List tables
\d users  # Describe users table
SELECT * FROM users;  # Query data
```

Reset database:
```bash
npm run seed  # Drops all tables and recreates with sample data
```

## Next Steps

Once the backend is running:

1. ✅ Backend API is ready
2. 📝 Review API documentation in `docs/API.md`
3. 🎨 Set up the frontend (React)
4. 🧪 Write tests
5. 🚀 Deploy to production

## Security Checklist

Before going to production:

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets
- [ ] Use production Stripe keys
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for your domain only
- [ ] Set up proper database backups
- [ ] Enable database SSL connection
- [ ] Review all environment variables
- [ ] Set up monitoring and logging

## Getting Help

If you encounter issues:

1. Check the logs in the terminal
2. Review this setup guide
3. Check `docs/API.md` for endpoint documentation
4. Ensure all environment variables are set correctly
5. Verify PostgreSQL is running
6. Check Node.js version: `node --version` (should be 18+)

## Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test

# Seed database
npm run seed

# Check for errors
npm run lint
```

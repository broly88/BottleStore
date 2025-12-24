# Complete Troubleshooting & Debugging Guide

## Table of Contents
1. [Quick Start Checklist](#quick-start-checklist)
2. [Prerequisites Installation](#prerequisites-installation)
3. [Launch Methods](#launch-methods)
4. [Common Issues & Solutions](#common-issues--solutions)
5. [Debugging Techniques](#debugging-techniques)
6. [Log Analysis](#log-analysis)
7. [Database Troubleshooting](#database-troubleshooting)
8. [Network & Connectivity Issues](#network--connectivity-issues)
9. [Performance Issues](#performance-issues)
10. [Development Workflow](#development-workflow)
11. [Testing Strategies](#testing-strategies)

---

## Quick Start Checklist

Before launching the application, verify you have:

- [ ] **Docker Desktop** installed and running
- [ ] **Git** installed
- [ ] **Node.js v18+** installed (for manual setup)
- [ ] **PostgreSQL 14+** installed (for manual setup)
- [ ] **Port 80 available** (frontend)
- [ ] **Port 5000 available** (backend API)
- [ ] **Port 5432 available** (PostgreSQL)
- [ ] **.env file configured** with required variables
- [ ] **Internet connection** (for npm packages, Docker images)

---

## Prerequisites Installation

### 1. Install Docker Desktop

**Windows:**
1. Download from https://www.docker.com/products/docker-desktop/
2. Run installer
3. Enable WSL 2 if prompted
4. Restart computer
5. Verify: `docker --version` should show version 20.10+

**Mac:**
1. Download from https://www.docker.com/products/docker-desktop/
2. Drag Docker.app to Applications
3. Open Docker from Applications
4. Verify: `docker --version`

**Linux:**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
docker --version
```

**Troubleshooting Docker:**
```bash
# Check Docker is running
docker ps

# If error: "Cannot connect to Docker daemon"
# Windows/Mac: Open Docker Desktop application
# Linux: sudo systemctl start docker

# Test Docker works
docker run hello-world
```

### 2. Install Node.js

**All Platforms:**
1. Visit https://nodejs.org/
2. Download LTS version (18.x or higher)
3. Run installer
4. Verify installation:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

**Troubleshooting Node:**
```bash
# Command not found error
# Add Node to PATH:
# Windows: Edit System Environment Variables → Path → Add C:\Program Files\nodejs
# Mac/Linux: Add to ~/.bashrc: export PATH="/usr/local/bin:$PATH"

# Permission errors (Mac/Linux)
sudo chown -R $(whoami) ~/.npm
```

### 3. Install PostgreSQL

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer (include pgAdmin 4)
3. Set password for postgres user
4. Verify: Open pgAdmin 4

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
psql --version
```

**Linux:**
```bash
sudo apt-get install postgresql-14
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Troubleshooting PostgreSQL:**
```bash
# Check if running
# Windows: Services → PostgreSQL
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Can't connect to PostgreSQL
# Check port: netstat -an | grep 5432
# Check password: psql -U postgres
# Reset password:
# Linux: sudo -u postgres psql
# ALTER USER postgres PASSWORD 'new_password';
```

### 4. Install Git

**All Platforms:**
1. Download from https://git-scm.com/
2. Run installer (default options)
3. Verify: `git --version`

---

## Launch Methods

### Method 1: Docker Compose (Recommended)

**Advantages:**
- One command starts everything
- Consistent environment
- No manual dependency installation
- Isolated from your system

**Steps:**

1. **Clone Repository**
```bash
git clone https://github.com/broly88/BottleStore.git
cd BottleStore
```

2. **Configure Environment**
```bash
# Copy example file
cp .env.example .env

# Edit .env file (use any text editor)
# Required variables:
# - DB_PASSWORD (set a secure password)
# - JWT_SECRET (generate random 64 characters)
# - JWT_REFRESH_SECRET (generate random 64 characters)
# - STRIPE_SECRET_KEY (get from Stripe dashboard)
```

**Generate Secrets:**
```bash
# Generate JWT secrets (Node.js)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use online tool: https://generate-secret.vercel.app/64
```

3. **Start All Services**
```bash
docker-compose up -d
```

**Expected Output:**
```
[+] Running 3/3
 ✔ Container liquorshop-db   Started
 ✔ Container liquorshop-api  Started
 ✔ Container liquorshop-web  Started
```

4. **Run Database Migrations**
```bash
cd database
npm install
export DATABASE_URL="postgresql://liquorshop:liquorshop123@localhost:5432/liquorshop_db"
node migrate.js
```

**Expected Output:**
```
Connecting to database...
Running migration: 001_initial_schema.sql
Migration completed successfully
```

5. **Verify Services**
```bash
docker-compose ps
```

**Expected Output:**
```
NAME             STATUS          PORTS
liquorshop-db    Up (healthy)    0.0.0.0:5432->5432/tcp
liquorshop-api   Up              0.0.0.0:5000->5000/tcp
liquorshop-web   Up              0.0.0.0:80->80/tcp
```

6. **Access Application**
- Frontend: http://localhost
- Admin Dashboard: http://localhost/admin
- API: http://localhost:5000/api

---

### Method 2: Manual Setup (Development)

**Advantages:**
- More control over each service
- Easier to debug individual components
- Faster code changes (no rebuilding containers)

**Backend Setup:**

1. **Navigate to Backend**
```bash
cd backend
```

2. **Install Dependencies**
```bash
npm install
```

**If errors:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Permission errors (Mac/Linux)
sudo chown -R $(whoami) ~/.npm
```

3. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Start PostgreSQL**
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Create database
createdb liquorshop_db
# Or: psql -U postgres -c "CREATE DATABASE liquorshop_db;"
```

5. **Run Migrations**
```bash
cd ../database
npm install
export DATABASE_URL="postgresql://postgres:your_password@localhost:5432/liquorshop_db"
node migrate.js
```

6. **Start Backend**
```bash
cd ../backend
npm run dev
```

**Expected Output:**
```
Server running on port 5000
Database connected successfully
```

**Frontend Setup:**

1. **Navigate to Frontend**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
```bash
cp .env.example .env
# Edit .env:
# VITE_API_URL=http://localhost:5000/api
# VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

4. **Start Development Server**
```bash
npm run dev
```

**Expected Output:**
```
VITE v5.4.21 ready in 523 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

5. **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## Common Issues & Solutions

### Issue 1: Port Already in Use

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Cause:** Another process is using the port

**Solution:**

**Find Process Using Port:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Mac/Linux
lsof -i :5000
kill -9 <process_id>
```

**Change Port (Alternative):**
```bash
# In backend/.env
PORT=5001

# In frontend/.env
VITE_API_URL=http://localhost:5001/api
```

---

### Issue 2: Database Connection Failed

**Symptom:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Cause:** PostgreSQL not running or wrong credentials

**Diagnosis Steps:**

1. **Check PostgreSQL Status**
```bash
# Docker
docker ps | grep postgres
docker logs liquorshop-db

# Manual
# Windows: Services → PostgreSQL
# Mac: brew services list
# Linux: sudo systemctl status postgresql
```

2. **Test Connection Manually**
```bash
psql -h localhost -U liquorshop -d liquorshop_db
# Enter password when prompted

# If successful, you'll see:
liquorshop_db=#
```

**Solutions:**

**A. PostgreSQL Not Running**
```bash
# Docker
docker-compose up -d postgres

# Manual
# Windows: Services → Start PostgreSQL
# Mac: brew services start postgresql@14
# Linux: sudo systemctl start postgresql
```

**B. Wrong Password**
```bash
# Reset password
# Docker: Check .env file DB_PASSWORD matches docker-compose.yml
# Manual:
sudo -u postgres psql
ALTER USER liquorshop PASSWORD 'new_password';
\q

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://liquorshop:new_password@localhost:5432/liquorshop_db
```

**C. Database Doesn't Exist**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE liquorshop_db;"
```

**D. Connection String Wrong**
```bash
# Format: postgresql://username:password@host:port/database
# Check .env:
DATABASE_URL=postgresql://liquorshop:liquorshop123@localhost:5432/liquorshop_db
#                       ↑username  ↑password    ↑host    ↑port   ↑database

# Docker: Use container name instead of localhost in backend
DATABASE_URL=postgresql://liquorshop:liquorshop123@postgres:5432/liquorshop_db
```

---

### Issue 3: Docker Container Keeps Restarting

**Symptom:**
```bash
docker ps
# STATUS shows "Restarting" or "Up 2 seconds (unhealthy)"
```

**Diagnosis:**
```bash
# Check container logs
docker logs liquorshop-api
docker logs liquorshop-api --tail 100  # last 100 lines
docker logs -f liquorshop-api          # follow (live)
```

**Common Causes:**

**A. Missing Environment Variables**
```bash
# Check .env file exists
ls -la .env

# Verify required variables
cat .env | grep -E "JWT_SECRET|DATABASE_URL|STRIPE"
```

**B. Code Errors**
```bash
# Look for errors in logs
docker logs liquorshop-api 2>&1 | grep -i error

# Common errors:
# - "Cannot find module" → npm install issue
# - "Syntax error" → Code issue
# - "ECONNREFUSED" → Can't connect to database
```

**Solutions:**
```bash
# Rebuild container
docker-compose build backend
docker-compose up -d backend

# Clear everything and start fresh
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

### Issue 4: npm install Fails

**Symptom:**
```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /app/package.json
```

**Solutions:**

**A. Clear Cache**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**B. Use Specific npm Version**
```bash
npm install -g npm@9.8.1
npm install
```

**C. Delete .npmrc**
```bash
rm .npmrc
npm install
```

**D. Check Node Version**
```bash
node --version  # Should be 18.x or higher
nvm install 18  # If using nvm
nvm use 18
```

---

### Issue 5: CORS Errors in Browser

**Symptom:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/products'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Cause:** Backend not configured to accept requests from frontend

**Solution:**

**Backend server.js:**
```javascript
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

**Or allow all origins (development only):**
```javascript
app.use(cors({ origin: '*' }));
```

---

### Issue 6: Login Returns "Network Error"

**Diagnosis:**

1. **Check API is Running**
```bash
curl http://localhost:5000/api/products
# Should return JSON response
```

2. **Check Frontend API URL**
```bash
# frontend/.env
cat frontend/.env
# VITE_API_URL should match backend URL

# With Docker: VITE_API_URL=/api (uses nginx proxy)
# Without Docker: VITE_API_URL=http://localhost:5000/api
```

3. **Check Browser Console**
```
F12 → Console tab → Look for errors
Network tab → Click failed request → Check URL
```

**Solutions:**

**A. Wrong API URL**
```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api

# Rebuild frontend
npm run build  # or restart dev server
```

**B. Backend Not Running**
```bash
# Check backend
curl http://localhost:5000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Should return JSON (even if credentials wrong)
```

---

### Issue 7: Database Migrations Fail

**Symptom:**
```
Error: relation "users" does not exist
```

**Cause:** Migrations not run or failed

**Solutions:**

**A. Run Migrations Manually**
```bash
cd database
npm install

# Set database URL
export DATABASE_URL="postgresql://liquorshop:liquorshop123@localhost:5432/liquorshop_db"

# Run migrations
node migrate.js
```

**B. Check Migration Files**
```bash
ls database/migrations/
# Should see: 001_initial_schema.sql

cat database/migrations/001_initial_schema.sql
# Verify SQL is valid
```

**C. Reset Database (CAUTION: Deletes all data)**
```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE liquorshop_db;"
psql -U postgres -c "CREATE DATABASE liquorshop_db;"

# Run migrations again
cd database
node migrate.js
```

**D. Check Migration Status**
```bash
psql -U liquorshop liquorshop_db -c "SELECT * FROM migrations;"
# Shows which migrations have run
```

---

### Issue 8: Stripe Payment Not Working

**Symptom:**
```
Error: No API key provided
```

**Solutions:**

**A. Check Stripe Keys**
```bash
# Backend .env
echo $STRIPE_SECRET_KEY
# Should start with: sk_test_... (test mode) or sk_live_... (production)

# Frontend .env
cat frontend/.env | grep STRIPE
# Should have: VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**B. Get Stripe Keys**
1. Sign up at https://stripe.com
2. Dashboard → Developers → API keys
3. Copy "Secret key" → backend .env (STRIPE_SECRET_KEY)
4. Copy "Publishable key" → frontend .env (VITE_STRIPE_PUBLISHABLE_KEY)

**C. Test Stripe Connection**
```bash
# Test API call
curl https://api.stripe.com/v1/payment_intents \
  -u sk_test_YOUR_KEY: \
  -d amount=1000 \
  -d currency=zar

# Should return JSON (not 401 Unauthorized)
```

---

## Debugging Techniques

### 1. Backend Debugging

**Console Logging:**
```javascript
// Add logs to controller
export const login = async (req, res) => {
  console.log('Login attempt:', req.body.email);

  const user = await User.findOne({ where: { email: req.body.email } });
  console.log('User found:', user ? 'Yes' : 'No');

  // ... rest of code
};
```

**VS Code Debugger:**

1. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/server.js",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

2. Set breakpoints (click left of line number)
3. Press F5 to start debugging
4. Make request → code pauses at breakpoint
5. Inspect variables in Debug panel

**Database Query Logging:**
```javascript
// config/database.js
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: console.log,  // logs all SQL queries
});
```

### 2. Frontend Debugging

**React DevTools:**

1. Install extension: https://react.dev/learn/react-developer-tools
2. F12 → Components tab
3. Click component → see props, state, hooks

**Redux DevTools:**

1. Install extension: https://github.com/reduxjs/redux-devtools
2. F12 → Redux tab
3. See all actions, state changes, time travel

**Console Logging:**
```javascript
// Log API responses
useEffect(() => {
  console.log('Products:', products);
  console.log('Loading:', isLoading);
  console.log('Error:', error);
}, [products, isLoading, error]);
```

**Network Debugging:**
```
F12 → Network tab
1. Make request (login, add to cart, etc.)
2. Click request in list
3. Check:
   - Request URL (correct endpoint?)
   - Request Headers (Authorization header present?)
   - Request Payload (data sent)
   - Response (status code, body)
```

### 3. Docker Debugging

**View Logs:**
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs -f backend  # follow

# Last 50 lines
docker-compose logs --tail 50 backend

# Since specific time
docker-compose logs --since 2024-01-01T10:00:00
```

**Execute Commands in Container:**
```bash
# Open shell in container
docker exec -it liquorshop-api sh

# Inside container:
ls -la               # list files
cat .env             # check environment
node --version       # check node version
npm list             # check installed packages
exit

# Run single command
docker exec liquorshop-api ls -la
docker exec liquorshop-api cat .env
```

**Inspect Container:**
```bash
# Get container details
docker inspect liquorshop-api

# Get IP address
docker inspect liquorshop-api | grep IPAddress

# Get environment variables
docker exec liquorshop-api env
```

**Check Resource Usage:**
```bash
# CPU, memory usage
docker stats

# Disk usage
docker system df
```

---

## Log Analysis

### Backend Logs

**Log Location:**
```bash
# Docker
docker logs liquorshop-api

# Manual
# Output in terminal where you ran npm run dev
```

**Common Log Messages:**

**Success Messages:**
```
✓ Server running on port 5000
✓ Database connected successfully
✓ Executing (default): SELECT ...
```

**Error Messages:**

**Database Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
→ PostgreSQL not running or wrong host

Error: password authentication failed for user "liquorshop"
→ Wrong database password

Error: database "liquorshop_db" does not exist
→ Database not created
```

**Code Error:**
```
Error: Cannot find module 'express'
→ npm install not run

SyntaxError: Unexpected token
→ Code syntax error (missing bracket, etc.)

ReferenceError: User is not defined
→ Missing import
```

**Request Error:**
```
POST /api/auth/login 500 23.456 ms
→ Server error (check error message above)

POST /api/auth/login 400 1.234 ms
→ Bad request (validation error)

POST /api/auth/login 401 2.345 ms
→ Authentication failed
```

### Frontend Logs

**Log Location:**
```bash
# Browser Console
F12 → Console tab

# Development server
# Terminal where you ran npm run dev
```

**Common Messages:**

**React Errors:**
```
Warning: Each child in a list should have a unique "key" prop
→ Add key prop to list items

Error: Invalid hook call
→ Hooks called outside component or wrong React version

Error: Cannot read property 'map' of undefined
→ Data not loaded yet (add null check)
```

**Network Errors:**
```
GET http://localhost:5000/api/products net::ERR_CONNECTION_REFUSED
→ Backend not running

Failed to load resource: the server responded with a status of 500
→ Backend error (check backend logs)

CORS error
→ Backend CORS not configured
```

---

## Database Troubleshooting

### View Tables

```bash
# Connect to database
psql -U liquorshop liquorshop_db

# List tables
\dt

# Expected output:
#             List of relations
#  Schema |       Name        | Type  |   Owner
# --------+-------------------+-------+-----------
#  public | users             | table | liquorshop
#  public | products          | table | liquorshop
#  public | orders            | table | liquorshop
#  ... (8 tables total)

# Describe table structure
\d users

# Quit
\q
```

### Query Data

```sql
-- Count users
SELECT COUNT(*) FROM users;

-- View all users
SELECT id, email, role, age_verified FROM users;

-- Find specific user
SELECT * FROM users WHERE email = 'admin@liquorshop.co.za';

-- Check orders
SELECT order_number, status, total_amount, created_at
FROM orders
ORDER BY created_at DESC
LIMIT 10;

-- Products by category
SELECT category, COUNT(*) as count
FROM products
GROUP BY category;
```

### Fix Common Issues

**Reset Auto-Increment:**
```sql
-- If IDs are messed up
ALTER SEQUENCE users_id_seq RESTART WITH 1;
```

**Clear Test Data:**
```sql
-- Delete all orders (cascade to order_items)
DELETE FROM orders;

-- Delete all products
DELETE FROM products;

-- Be careful with users (has foreign keys)
DELETE FROM users WHERE role = 'customer';
```

**Update Data:**
```sql
-- Make user admin
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';

-- Fix product price
UPDATE products SET price = 99.99 WHERE id = 'product-uuid';

-- Mark order as delivered
UPDATE orders SET status = 'delivered' WHERE order_number = 'ORD-123456';
```

---

## Network & Connectivity Issues

### Test API Endpoints

**Using curl:**
```bash
# Test basic endpoint
curl http://localhost:5000/api/products

# Test with JSON data
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@liquorshop.co.za","password":"Admin123456"}'

# Test with authentication
TOKEN="your-jwt-token"
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN"
```

**Using Postman/Insomnia:**
1. Download Postman: https://www.postman.com/downloads/
2. Create new request
3. Set method (GET, POST, etc.)
4. Enter URL: http://localhost:5000/api/products
5. Add headers if needed:
   - Content-Type: application/json
   - Authorization: Bearer <token>
6. Add body (JSON) for POST requests
7. Click Send

### Check Network Configuration

**Docker Network:**
```bash
# List networks
docker network ls

# Inspect network
docker network inspect example_default

# Check container IPs
docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq)
```

**Port Mapping:**
```bash
# Check if port is accessible
curl http://localhost:80      # frontend
curl http://localhost:5000    # backend
curl http://localhost:5432    # postgres (should fail - internal only)

# Check port mapping
docker port liquorshop-web
docker port liquorshop-api
```

---

## Performance Issues

### Slow API Responses

**Diagnosis:**
```bash
# Measure response time
time curl http://localhost:5000/api/products

# Check database query time
# In backend: enable query logging
logging: console.log

# Look for slow queries (> 1 second)
```

**Solutions:**

**Add Database Indexes:**
```sql
-- Products search
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category);

-- Orders by user
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);
```

**Optimize Queries:**
```javascript
// BAD: Loads all data
const products = await Product.findAll();

// GOOD: Limit and paginate
const products = await Product.findAll({
  limit: 20,
  offset: 0,
  attributes: ['id', 'name', 'price', 'imageUrl']  // only needed fields
});
```

**Enable Caching:**
```javascript
// Redis caching
import Redis from 'ioredis';
const redis = new Redis();

export const getProducts = async (req, res) => {
  const cacheKey = 'products:list';

  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Fetch from database
  const products = await Product.findAll();

  // Store in cache (5 minutes)
  await redis.set(cacheKey, JSON.stringify(products), 'EX', 300);

  res.json(products);
};
```

### Slow Frontend

**Diagnosis:**
```javascript
// React DevTools → Profiler
// Record interaction → See which components re-render

// Console
console.time('render');
// ... component render
console.timeEnd('render');
```

**Solutions:**

**Memoization:**
```javascript
import { useMemo } from 'react';

const filteredProducts = useMemo(() => {
  return products.filter(p => p.category === category);
}, [products, category]);  // only recalculate if these change
```

**Code Splitting:**
```javascript
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

<Suspense fallback={<Loading />}>
  <AdminDashboard />
</Suspense>
```

---

## Development Workflow

### Making Code Changes

**Backend Changes:**
```bash
# With nodemon (auto-restart)
npm run dev

# Manual restart
# Ctrl+C to stop
npm start

# Docker (requires rebuild)
docker-compose build backend
docker-compose up -d backend
```

**Frontend Changes:**
```bash
# Vite auto-reloads (HMR)
# Just save file → browser updates

# If not updating:
# Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

# Clear cache and restart dev server:
rm -rf node_modules/.vite
npm run dev
```

### Git Workflow

```bash
# Check status
git status

# Stage changes
git add backend/src/controllers/productController.js

# Commit
git commit -m "Fix product search filter"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# Create branch
git checkout -b feature/add-reviews
# Make changes
git add .
git commit -m "Add product reviews"
git push origin feature/add-reviews
# Create Pull Request on GitHub
```

### Database Changes

**Creating Migration:**
```bash
# Create new migration file
cd database/migrations
touch 002_add_reviews_table.sql
```

**002_add_reviews_table.sql:**
```sql
-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
```

**Run Migration:**
```bash
node migrate.js
```

**Rollback (if needed):**
```sql
DROP TABLE reviews;
```

---

## Testing Strategies

### Manual Testing Checklist

**User Registration:**
- [ ] Valid registration succeeds
- [ ] Under 18 registration fails
- [ ] Duplicate email fails
- [ ] Weak password fails
- [ ] Email validation works

**Login:**
- [ ] Valid credentials work
- [ ] Wrong password fails
- [ ] Non-existent user fails
- [ ] Token stored in localStorage
- [ ] Protected routes accessible after login

**Products:**
- [ ] Products display correctly
- [ ] Filters work (category, price)
- [ ] Search works
- [ ] Pagination works
- [ ] Product details page loads

**Shopping Cart:**
- [ ] Add to cart works
- [ ] Update quantity works
- [ ] Remove item works
- [ ] Cart total calculates correctly (with VAT)
- [ ] Cart persists after page refresh

**Checkout:**
- [ ] Address form validates
- [ ] Stripe payment form loads
- [ ] Test payment succeeds (4242 4242 4242 4242)
- [ ] Order created in database
- [ ] Order confirmation shows

**Admin:**
- [ ] Admin login works
- [ ] Dashboard shows stats
- [ ] Create product works
- [ ] Update product works
- [ ] Delete product works
- [ ] Order management works

### Automated Testing

**Backend Unit Tests:**
```bash
cd backend
npm test

# Run specific test file
npm test tests/auth.test.js

# With coverage
npm run test:coverage
```

**Frontend Tests:**
```bash
cd frontend
npm test

# Run specific test
npm test src/components/ProductCard.test.jsx
```

**Example Test (Jest):**
```javascript
// backend/tests/auth.test.js
import request from 'supertest';
import app from '../src/server.js';

describe('Auth Endpoints', () => {
  it('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        password: 'Test123!@#',
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '1990-01-01'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject underage user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'kid@test.com',
        password: 'Test123!@#',
        firstName: 'Kid',
        lastName: 'User',
        dateOfBirth: '2010-01-01'  // 14 years old
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
```

---

## Quick Reference Commands

### Docker
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild service
docker-compose build backend

# Execute command in container
docker exec -it liquorshop-api sh

# Remove everything
docker-compose down -v
docker system prune -a
```

### Database
```bash
# Connect to PostgreSQL
psql -U liquorshop liquorshop_db

# Run migrations
cd database && node migrate.js

# Backup database
pg_dump -U liquorshop liquorshop_db > backup.sql

# Restore database
psql -U liquorshop liquorshop_db < backup.sql
```

### npm
```bash
# Install dependencies
npm install

# Clear cache
npm cache clean --force

# Update packages
npm update

# Check for security issues
npm audit
npm audit fix
```

### Git
```bash
# Stage all changes
git add .

# Commit with message
git commit -m "your message"

# Push to GitHub
git push origin main

# Pull latest
git pull origin main

# View commit history
git log --oneline
```

---

## Emergency Procedures

### Complete Reset

**If everything is broken:**

```bash
# 1. Stop all containers
docker-compose down -v

# 2. Remove Docker images
docker rmi example-backend example-frontend

# 3. Clear npm caches
cd backend && rm -rf node_modules package-lock.json
cd ../frontend && rm -rf node_modules package-lock.json dist

# 4. Pull latest code
git reset --hard HEAD
git pull origin main

# 5. Rebuild everything
docker-compose build --no-cache
docker-compose up -d

# 6. Run migrations
cd database
npm install
export DATABASE_URL="postgresql://liquorshop:liquorshop123@localhost:5432/liquorshop_db"
node migrate.js

# 7. Test
curl http://localhost/api/products
```

### Get Help

1. **Check logs first** (90% of issues show in logs)
2. **Search error message** on Google/Stack Overflow
3. **Check GitHub issues**: https://github.com/broly88/BottleStore/issues
4. **Ask for help** with:
   - Error message (full stack trace)
   - What you were doing
   - Environment (OS, Node version, Docker version)
   - Steps to reproduce

---

**Remember:** Most issues are configuration-related. Check environment variables, ports, and connection strings first!


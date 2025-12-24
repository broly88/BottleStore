# Complete Development Guide: Building an Alcohol E-Commerce Platform from Scratch

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Design Philosophy](#architecture--design-philosophy)
3. [Technology Stack Decisions](#technology-stack-decisions)
4. [Development Pathway](#development-pathway)
5. [Database Design Process](#database-design-process)
6. [Backend Development Framework](#backend-development-framework)
7. [Frontend Development Framework](#frontend-development-framework)
8. [Security Implementation](#security-implementation)
9. [South African Compliance](#south-african-compliance)
10. [Best Practices & Patterns](#best-practices--patterns)

---

## Project Overview

### What Are We Building?
A full-stack e-commerce platform specifically designed for selling alcoholic beverages in South Africa, with strict age verification (18+), legal compliance (POPIA, SA liquor laws), and secure payment processing.

### Core Requirements
- **Legal Compliance**: 18+ age verification, POPIA data protection, liquor license display
- **E-Commerce Features**: Product catalog, shopping cart, checkout, order management
- **Payment Processing**: Stripe integration with ZAR (South African Rand) support
- **Admin Dashboard**: Product management, order fulfillment, user management, reporting
- **South African Specifics**: 15% VAT, delivery restrictions, SA provinces, public holidays

### Success Criteria
- Users can browse products and make purchases securely
- Age verification prevents underage access
- Admin can manage entire platform
- Compliant with SA laws and regulations
- Scalable and maintainable codebase

---

## Architecture & Design Philosophy

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  (React SPA - Browser runs JavaScript, manages UI state)    │
│                                                              │
│  Components → Redux Store → API Service → HTTP Requests     │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/HTTP
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                      NGINX (REVERSE PROXY)                   │
│  - Serves static React files                                │
│  - Proxies /api/* to backend                                │
│  - Handles SSL termination (production)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API LAYER                         │
│  (Node.js + Express - RESTful API, business logic)          │
│                                                              │
│  Routes → Middleware → Controllers → Models → Database      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│  (PostgreSQL - ACID compliant, handles transactions)        │
│                                                              │
│  Tables, Relationships, Constraints, Indexes                │
└─────────────────────────────────────────────────────────────┘

EXTERNAL SERVICES:
- Stripe API (Payment Processing)
- Email Service (SMTP for notifications)
- Cloudinary (Image hosting - optional)
```

### Why This Architecture?

**Separation of Concerns:**
- Frontend handles presentation and user interaction
- Backend handles business logic and data validation
- Database handles data persistence and integrity
- Each layer can be scaled independently

**Stateless API:**
- Backend doesn't store session state
- JWT tokens carry authentication state
- Enables horizontal scaling (multiple API servers)

**RESTful Design:**
- Predictable URL patterns (/api/products, /api/orders)
- HTTP methods match operations (GET = read, POST = create, PUT = update, DELETE = delete)
- Easy to understand and maintain

---

## Technology Stack Decisions

### Frontend: React + Vite + Tailwind CSS + Redux

**Why React?**
- Component-based architecture promotes reusability
- Virtual DOM for efficient updates
- Massive ecosystem of libraries and tools
- Easy to find developers familiar with it

**Why Vite?**
- Faster than Create React App (uses ES modules)
- Hot Module Replacement (HMR) for instant updates
- Smaller bundle sizes
- Modern tooling out of the box

**Why Tailwind CSS?**
- Utility-first approach speeds up development
- No CSS naming conflicts
- Mobile-first responsive design
- Consistent design system
- Small production bundle (unused classes removed)

**Why Redux Toolkit?**
- Centralized state management
- DevTools for debugging state changes
- Predictable state updates
- Handles async logic (thunks)
- Less boilerplate than raw Redux

### Backend: Node.js + Express + Sequelize

**Why Node.js?**
- JavaScript everywhere (same language as frontend)
- Non-blocking I/O (handles many concurrent requests)
- NPM ecosystem (millions of packages)
- Fast development cycle

**Why Express?**
- Minimalist, flexible web framework
- Middleware pattern for request processing
- Well-documented and battle-tested
- Large community support

**Why Sequelize ORM?**
- Abstracts database operations (no raw SQL needed)
- Model-based approach (JavaScript objects → database rows)
- Built-in validation
- Migration support
- Protection against SQL injection
- Works with PostgreSQL, MySQL, SQLite

### Database: PostgreSQL

**Why PostgreSQL over MySQL/MongoDB?**
- **ACID compliance**: Critical for financial transactions (orders, payments)
- **Data integrity**: Foreign keys, constraints ensure valid data
- **Complex queries**: Supports JOINs, subqueries for reports
- **JSON support**: JSONB for flexible data (delivery address, product images)
- **Reliability**: Production-proven for e-commerce
- **Performance**: Excellent indexing and query optimization

### Authentication: JWT (JSON Web Tokens)

**Why JWT over Sessions?**
- **Stateless**: No server-side session storage needed
- **Scalable**: Works across multiple API servers
- **Flexible**: Can include user data in token (role, id)
- **Secure**: Signed with secret key, can't be tampered
- **Cross-domain**: Works with mobile apps, SPAs

**Token Strategy:**
- **Access Token**: Short-lived (15 minutes), sent with every request
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie
- When access expires, use refresh to get new access token

### Payment: Stripe

**Why Stripe?**
- **PCI compliance**: They handle card data, we don't
- **ZAR support**: Supports South African Rand currency
- **Developer-friendly**: Excellent documentation and SDKs
- **Webhooks**: Notifies us of payment events
- **Security**: Built-in fraud detection
- **Stripe Elements**: Pre-built secure card input components

---

## Development Pathway

### The Right Order to Build Things

**Phase 1: Planning & Design (Before Writing Code)**
1. Define database schema on paper
2. Sketch out API endpoints
3. Draw component hierarchy
4. Identify user flows
5. List security requirements

**Phase 2: Database Foundation**
1. Create database schema SQL
2. Set up migration system
3. Test database creation
4. Verify relationships and constraints

**Phase 3: Backend Core**
1. Initialize Node.js project
2. Set up Express server
3. Create database connection
4. Build models (Sequelize)
5. Implement authentication (register, login)

**Phase 4: Backend Features (Build in This Order)**
1. **Authentication first** (can't test other features without users)
   - User registration
   - Login/logout
   - JWT generation
   - Password hashing

2. **Products** (core business entity)
   - CRUD operations
   - Image upload
   - Search and filtering

3. **Shopping Cart** (depends on products)
   - Add/remove items
   - Update quantities
   - Cart persistence

4. **Orders** (depends on cart and products)
   - Create order from cart
   - Order history
   - Order status updates

5. **Payment** (depends on orders)
   - Stripe integration
   - Payment intent creation
   - Webhook handling

6. **Admin Features** (depends on all above)
   - Dashboard stats
   - Product management
   - Order management
   - Reports

**Phase 5: Frontend Core**
1. Initialize Vite + React project
2. Set up Tailwind CSS
3. Configure Redux store
4. Create API service layer (axios)
5. Build authentication pages (login, register)

**Phase 6: Frontend Features (Build in This Order)**
1. **Common Components** (reusable building blocks)
   - Button, Modal, Loading, Header, Footer

2. **Authentication UI**
   - Login page
   - Register page (with age verification)
   - Protected routes

3. **Product Pages**
   - Product listing
   - Product detail
   - Filters and search

4. **Shopping Cart**
   - Cart page
   - Cart item component
   - Cart summary

5. **Checkout**
   - Address form
   - Stripe payment form
   - Order confirmation

6. **User Dashboard**
   - Profile page
   - Order history
   - Address management

7. **Admin Dashboard**
   - Dashboard layout
   - Product management
   - Order management
   - User management
   - Reports

**Phase 7: Integration & Testing**
1. End-to-end user flows
2. Payment testing (Stripe test mode)
3. Admin workflows
4. Error handling
5. Edge cases

**Phase 8: Deployment**
1. Docker containerization
2. Environment configuration
3. Production database setup
4. SSL/HTTPS
5. Monitoring and logging

---

## Database Design Process

### Step 1: Identify Entities (Nouns in Requirements)

From requirements, extract main entities:
- **User**: People who use the platform (customers, admins)
- **Product**: Items being sold (wines, beers, spirits)
- **Order**: Purchase transactions
- **Cart**: Temporary shopping basket
- **Address**: Delivery locations

### Step 2: Define Attributes (What Info Does Each Entity Need?)

**User Attributes:**
```
- id (unique identifier)
- email (login credential)
- password (hashed, for authentication)
- firstName, lastName (personal info)
- dateOfBirth (age verification - REQUIRED for alcohol)
- phone (contact)
- role (customer vs admin)
- ageVerified (compliance flag)
- emailVerified (security)
- created_at, updated_at (audit trail)
```

**Product Attributes:**
```
- id
- name (product name)
- slug (URL-friendly name)
- description (marketing copy)
- category (wine, beer, spirits, cider)
- subcategory (red wine, lager, whiskey)
- brand (manufacturer)
- alcoholContent (5.0%, 13.5%, etc.)
- volumeMl (750ml, 330ml)
- price (in ZAR)
- stockQuantity (inventory)
- imageUrl (product photo)
- isActive (published/unpublished)
- featured (homepage promotion)
```

**Order Attributes:**
```
- id
- userId (who placed order)
- orderNumber (human-readable: ORD-123456)
- status (pending, processing, shipped, delivered)
- subtotal (before VAT)
- vatAmount (15% of subtotal)
- deliveryFee
- totalAmount
- paymentStatus (pending, completed, failed)
- stripePaymentIntentId (payment tracking)
- deliveryAddress (JSONB - flexible structure)
- ageVerifiedAtCheckout (compliance proof)
```

### Step 3: Define Relationships

**One-to-Many:**
- One User → Many Orders (a user can place multiple orders)
- One User → Many Addresses (a user can have multiple delivery addresses)
- One Order → Many OrderItems (an order contains multiple products)
- One User → One Cart (a user has one active cart)
- One Cart → Many CartItems

**Many-to-One:**
- Many Orders → One User
- Many OrderItems → One Product (tracks what product was ordered)

### Step 4: Normalize (Avoid Data Duplication)

**Problem:** If we store product name directly in OrderItem, and the product name changes, old orders show the new name.

**Solution:** Store product snapshot in OrderItem:
```sql
CREATE TABLE order_items (
  product_id UUID,           -- reference for admin
  product_name VARCHAR(255), -- snapshot at purchase time
  product_price DECIMAL,     -- price at purchase time
  quantity INTEGER,
  subtotal DECIMAL
);
```

### Step 5: Add Constraints (Data Integrity Rules)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,  -- must be unique, required
  password_hash VARCHAR(255) NOT NULL, -- required
  date_of_birth DATE NOT NULL,         -- required for age check
  role VARCHAR(20) DEFAULT 'customer', -- default value
  CONSTRAINT valid_role CHECK (role IN ('customer', 'admin'))
);

-- Products table
CREATE TABLE products (
  stock_quantity INTEGER DEFAULT 0,
  CONSTRAINT positive_stock CHECK (stock_quantity >= 0),
  CONSTRAINT positive_price CHECK (price > 0)
);
```

### Step 6: Add Indexes (Performance Optimization)

**Rule:** Index columns used in WHERE, JOIN, and ORDER BY clauses.

```sql
-- Frequently searched columns
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Unique constraints (automatically create indexes)
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_products_slug ON products(slug);
```

### Step 7: Implement Timestamps with Triggers

```sql
-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## Backend Development Framework

### Project Structure Philosophy

**Separation of Concerns:**
```
backend/
├── src/
│   ├── config/       # Configuration (database, stripe, jwt)
│   ├── models/       # Data layer (Sequelize models)
│   ├── controllers/  # Business logic (handle requests)
│   ├── routes/       # URL routing (map URLs to controllers)
│   ├── middleware/   # Request processing (auth, validation, errors)
│   ├── utils/        # Helper functions (email, VAT calc)
│   └── validators/   # Input validation schemas
└── server.js         # Entry point
```

**Why This Structure?**
- **Clear responsibilities**: Each folder has one job
- **Easy to find code**: "Where's the product logic?" → controllers/productController.js
- **Testable**: Each piece can be tested independently
- **Scalable**: Adding features means adding files, not modifying existing ones

### Step-by-Step Backend Development

#### 1. Initialize Project

```bash
mkdir backend && cd backend
npm init -y
npm install express sequelize pg pg-hstore bcryptjs jsonwebtoken dotenv cors helmet express-rate-limit
npm install --save-dev nodemon
```

#### 2. Create Database Connection (config/database.js)

**Thought Process:**
- Use environment variable for connection string (security)
- Enable connection pooling (performance)
- Disable logging in production (performance)

```javascript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,      // max 5 concurrent connections
    min: 0,      // scale down when idle
    acquire: 30000,  // 30s to acquire connection
    idle: 10000      // close idle connections after 10s
  }
});

export default sequelize;
```

#### 3. Create Models (Data Layer)

**Model Design Pattern:**
- Define schema (columns, types, validations)
- Define relationships (associations)
- Add instance methods (user.comparePassword())
- Add class methods (User.findByEmail())

**Example: User Model (models/User.js)**

```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true  // Sequelize validation
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash'  // maps to snake_case in DB
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'date_of_birth',
    validate: {
      isDate: true,
      is18OrOlder(value) {
        const age = Math.floor((new Date() - new Date(value)) / 31557600000);
        if (age < 18) {
          throw new Error('Must be 18 or older');
        }
      }
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,  // camelCase in JS → snake_case in DB
  hooks: {
    // Hash password before saving
    beforeCreate: async (user) => {
      if (user.passwordHash) {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
      }
    }
  }
});

// Instance method: compare password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Instance method: check age
User.prototype.isLegalAge = function() {
  const age = Math.floor((new Date() - new Date(this.dateOfBirth)) / 31557600000);
  return age >= 18;
};

export default User;
```

**Key Concepts:**
- `field: 'password_hash'` - Maps JS camelCase to DB snake_case
- `underscored: true` - Automatically converts all field names
- `hooks.beforeCreate` - Runs before INSERT
- `validate` - Sequelize runs these before saving
- Instance methods - Called on a single record (user.comparePassword())

#### 4. Create Controllers (Business Logic)

**Controller Responsibility:**
- Receive request (req)
- Validate input
- Call model methods
- Return response (res)
- Handle errors

**Example: Auth Controller (controllers/authController.js)**

```javascript
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

export const register = async (req, res, next) => {
  try {
    // 1. Extract data from request
    const { email, password, firstName, lastName, dateOfBirth, phone } = req.body;

    // 2. Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // 3. Create user (password auto-hashed by hook)
    const user = await User.create({
      email,
      passwordHash: password,  // will be hashed by beforeCreate hook
      firstName,
      lastName,
      dateOfBirth,
      phone
    });

    // 4. Check age verification
    if (!user.isLegalAge()) {
      await user.destroy();  // delete if underage
      return res.status(403).json({
        success: false,
        error: 'Must be 18 or older'
      });
    }

    // 5. Mark as age verified
    user.ageVerified = true;
    user.ageVerifiedAt = new Date();
    await user.save();

    // 6. Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      jwtConfig.secret,
      { expiresIn: jwtConfig.accessTokenExpiry }
    );

    // 7. Return success response
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    next(error);  // pass to error handler middleware
  }
};
```

**Flow Explanation:**
1. Extract data from request body
2. Check business rules (user exists?)
3. Create database record
4. Apply domain logic (age check)
5. Generate authentication token
6. Return structured response
7. Handle errors gracefully

#### 5. Create Routes (URL Mapping)

**Route Responsibility:**
- Map HTTP methods + URLs to controller functions
- Apply middleware (authentication, validation)

**Example: Auth Routes (routes/auth.js)**

```javascript
import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegistration } from '../validators/userValidator.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
```

**Middleware Chain:**
```
Request → validateRegistration → register → Response
Request → protect → getMe → Response
```

#### 6. Create Middleware (Request Processing)

**Middleware = Function that processes request before controller**

**Example: Authentication Middleware (middleware/auth.js)**

```javascript
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { jwtConfig } from '../config/jwt.js';

export const protect = async (req, res, next) => {
  try {
    // 1. Get token from header
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Check token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, jwtConfig.secret);

    // 4. Get user from token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // 5. Attach user to request
    req.user = user;

    // 6. Continue to next middleware/controller
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token is invalid or expired'
    });
  }
};
```

**Middleware Pattern:**
- Receives (req, res, next)
- Does processing
- Either responds (res.json) or calls next()

#### 7. Implement Error Handling

**Centralized Error Handler (middleware/errorHandler.js)**

```javascript
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: err.errors.map(e => e.message).join(', ')
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'Value must be unique'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};
```

**In server.js:**
```javascript
// ... all routes ...

// Error handler (must be last)
app.use(errorHandler);
```

---

## Frontend Development Framework

### React Component Philosophy

**Components = Reusable UI Building Blocks**

```
App
├── Header (navigation, cart badge)
├── Routes
│   ├── Home
│   │   ├── Hero
│   │   ├── FeaturedProducts
│   │   │   └── ProductCard (reused)
│   │   └── CategoryGrid
│   ├── Shop
│   │   ├── ProductFilter
│   │   └── ProductList
│   │       └── ProductCard (reused)
│   ├── ProductDetail
│   │   ├── ProductImages
│   │   ├── ProductInfo
│   │   └── AddToCartButton
│   ├── Cart
│   │   ├── CartItem (for each item)
│   │   └── CartSummary
│   └── Checkout
│       ├── AddressForm
│       ├── PaymentForm (Stripe)
│       └── OrderSummary
└── Footer
```

**Component Design Principles:**
1. **Single Responsibility**: Each component does ONE thing
2. **Reusability**: ProductCard used in multiple places
3. **Composition**: Build complex UIs from simple components
4. **Props Down**: Parent passes data to children via props
5. **Events Up**: Children notify parents via callbacks

### Step-by-Step Frontend Development

#### 1. Initialize Project

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @reduxjs/toolkit react-redux react-router-dom axios
npm install @stripe/stripe-js @stripe/react-stripe-js react-hot-toast react-icons
```

#### 2. Configure Redux Store (redux/store.js)

**Redux = Centralized State Management**

**Why Redux?**
- Single source of truth (one state object)
- Predictable state changes (actions → reducers)
- DevTools for debugging
- Handles async logic (API calls)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,      // user, token, isAuthenticated
    cart: cartReducer,      // items, total
    products: productReducer, // list, filters, pagination
    orders: orderReducer    // list, current order
  }
});
```

#### 3. Create Redux Slice (State + Actions)

**Example: Auth Slice (redux/slices/authSlice.js)**

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Async thunk (API call)
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      // Login pending
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Login success
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      // Login failure
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

**State Flow:**
```
User clicks login button
  ↓
dispatch(login({ email, password }))
  ↓
login.pending → isLoading = true
  ↓
API call (authService.login)
  ↓
Success: login.fulfilled → user, token, isAuthenticated
Failure: login.rejected → error
  ↓
Component re-renders with new state
```

#### 4. Create API Service Layer

**Purpose:** Centralize all API calls, handle tokens, errors

**services/api.js (Axios instance with interceptors)**

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh
api.interceptors.response.use(
  (response) => response.data.data,  // unwrap response
  async (error) => {
    const originalRequest = error.config;

    // Token expired, try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { token } = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
          withCredentials: true
        });
        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Key Concepts:**
- **Interceptors**: Middleware for axios requests/responses
- **Token injection**: Automatically adds Authorization header
- **Token refresh**: Silently renews expired tokens
- **Error handling**: Centralized logout on auth failure

#### 5. Create Service Functions

**services/authService.js**

```javascript
import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response;
  }
};

export default authService;
```

#### 6. Create Components

**Component Structure:**
```javascript
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const Login = () => {
  // Local state (form inputs)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redux state
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);

  // Side effects
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  // Event handlers
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  // Render
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Login;
```

**Component Lifecycle:**
1. Component mounts → useState initializes local state
2. useSelector subscribes to Redux state
3. User types → handleChange updates local state
4. User submits → handleSubmit dispatches action
5. Redux state changes → component re-renders
6. useEffect detects auth change → navigates

---

## Security Implementation

### 1. Password Security

**Requirements:**
- Never store plain text passwords
- Use strong hashing algorithm (bcrypt)
- Salt passwords (prevent rainbow table attacks)

**Implementation:**
```javascript
import bcrypt from 'bcryptjs';

// Hash password (12 salt rounds = 2^12 iterations)
const hash = await bcrypt.hash(password, 12);

// Compare password
const isMatch = await bcrypt.compare(candidatePassword, hash);
```

**Why bcrypt?**
- Slow by design (prevents brute force)
- Automatic salting
- Future-proof (can increase rounds as computers get faster)

### 2. JWT Security

**Token Structure:**
```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  (algorithm: HS256)
.eyJpZCI6IjEyMyIsImlhdCI6MTYxNjIzOTAyMn0   (data: user id, issued at)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c   (signature with secret)
```

**Security Measures:**
- **Secret Key**: Long, random string (64+ characters)
- **Short expiry**: Access tokens expire in 15 minutes
- **Refresh tokens**: Longer-lived, stored in HTTP-only cookies
- **Signature verification**: Detects tampering

**Implementation:**
```javascript
// Generate token
const token = jwt.sign(
  { id: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// Verify token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // decoded = { id: '123', iat: 1616239022, exp: 1616239922 }
} catch (error) {
  // Invalid or expired
}
```

### 3. Input Validation

**Never trust user input!**

**Backend validation (express-validator):**
```javascript
import { body } from 'express-validator';

export const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('firstName').trim().notEmpty(),
  body('dateOfBirth').isISO8601().custom((value) => {
    const age = Math.floor((new Date() - new Date(value)) / 31557600000);
    if (age < 18) throw new Error('Must be 18 or older');
    return true;
  })
];
```

**Frontend validation (before API call):**
```javascript
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password);
};
```

### 4. SQL Injection Prevention

**Use Sequelize (ORM) - Never concatenate SQL**

**BAD (Vulnerable):**
```javascript
const query = `SELECT * FROM users WHERE email = '${email}'`;
// If email = "' OR '1'='1" → returns all users!
```

**GOOD (Sequelize):**
```javascript
const user = await User.findOne({ where: { email } });
// Sequelize uses parameterized queries → safe
```

### 5. CORS (Cross-Origin Resource Sharing)

**Problem:** By default, browsers block API requests from different origins

**Solution:** Configure CORS middleware

```javascript
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,  // only allow this domain
  credentials: true  // allow cookies
}));
```

### 6. Rate Limiting (Prevent Brute Force)

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // max 100 requests per window
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

### 7. Helmet (Security Headers)

```javascript
import helmet from 'helmet';

app.use(helmet());  // Sets 11 security headers
```

---

## South African Compliance

### 1. Age Verification (18+ Required)

**Multi-Point Verification:**

**Point 1: Registration**
```javascript
// Validate date of birth
const age = Math.floor((new Date() - new Date(dateOfBirth)) / 31557600000);
if (age < 18) {
  throw new Error('You must be 18 or older to register');
}

// Mark as verified
user.ageVerified = true;
user.ageVerifiedAt = new Date();
```

**Point 2: Add to Cart**
```javascript
export const addToCart = async (req, res) => {
  if (!req.user.ageVerified) {
    return res.status(403).json({
      error: 'Age verification required to purchase alcohol'
    });
  }
  // ... proceed
};
```

**Point 3: Checkout**
```javascript
// Log verification
await AgeVerificationLog.create({
  userId: req.user.id,
  orderId: order.id,
  verified: req.user.ageVerified,
  ipAddress: req.ip,
  verificationMethod: 'dob_check'
});
```

### 2. VAT Calculation (15%)

**utils/vatCalculator.js**
```javascript
export const VAT_RATE = 0.15;

// Calculate VAT from subtotal
export const calculateVAT = (subtotal) => {
  return subtotal * VAT_RATE;
};

// Extract VAT from total (price includes VAT)
export const extractVATFromTotal = (total) => {
  return total * (VAT_RATE / (1 + VAT_RATE));
};

// Example: R115 total → R15 VAT, R100 subtotal
// 115 * (0.15 / 1.15) = 15
```

### 3. Delivery Restrictions

**utils/deliveryValidator.js**
```javascript
const SA_PUBLIC_HOLIDAYS_2025 = [
  '2025-01-01', // New Year's Day
  '2025-03-21', // Human Rights Day
  '2025-04-18', // Good Friday
  '2025-04-21', // Family Day
  '2025-04-27', // Freedom Day
  '2025-05-01', // Workers' Day
  '2025-06-16', // Youth Day
  '2025-08-09', // National Women's Day
  '2025-09-24', // Heritage Day
  '2025-12-16', // Day of Reconciliation
  '2025-12-25', // Christmas Day
  '2025-12-26'  // Day of Goodwill
];

export const isDeliveryAllowed = (date = new Date()) => {
  const day = date.getDay();
  const hour = date.getHours();
  const dateString = date.toISOString().split('T')[0];

  // No Sunday deliveries
  if (day === 0) {
    return { allowed: false, reason: 'No deliveries on Sundays' };
  }

  // No public holiday deliveries
  if (SA_PUBLIC_HOLIDAYS_2025.includes(dateString)) {
    return { allowed: false, reason: 'No deliveries on public holidays' };
  }

  // Only 9 AM - 6 PM
  if (hour < 9 || hour >= 18) {
    return { allowed: false, reason: 'Deliveries only between 9 AM and 6 PM' };
  }

  return { allowed: true };
};
```

### 4. POPIA Compliance (Data Protection)

**Requirements:**
- User consent for data collection
- Right to access data
- Right to delete account
- Secure storage
- Clear privacy policy

**Implementation:**
```javascript
// Privacy policy checkbox on registration
<input type="checkbox" required />
<label>I agree to the Privacy Policy and Terms of Service</label>

// Data export endpoint
export const exportUserData = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [Order, Address, Cart]
  });
  res.json({ data: user.toJSON() });
};

// Account deletion endpoint
export const deleteAccount = async (req, res) => {
  await User.destroy({ where: { id: req.user.id } });
  res.json({ message: 'Account deleted' });
};
```

---

## Best Practices & Patterns

### 1. Environment Variables (Never Commit Secrets)

**Create .env file (gitignored):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=super-secret-key-min-64-characters
STRIPE_SECRET_KEY=sk_test_...
```

**Load with dotenv:**
```javascript
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET;
```

### 2. Error Handling Pattern

**Always use try-catch in async functions:**
```javascript
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);  // pass to error handler
  }
};
```

### 3. API Response Format (Consistency)

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### 4. Database Transactions (All or Nothing)

**Example: Create order with items**
```javascript
const t = await sequelize.transaction();
try {
  const order = await Order.create(orderData, { transaction: t });
  await OrderItem.bulkCreate(items, { transaction: t });
  await t.commit();  // save changes
} catch (error) {
  await t.rollback();  // undo all changes
  throw error;
}
```

### 5. Pagination (Don't Load All Data)

```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;
const offset = (page - 1) * limit;

const { count, rows } = await Product.findAndCountAll({
  limit,
  offset
});

res.json({
  products: rows,
  pagination: {
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    totalItems: count
  }
});
```

---

## Final Thoughts

### What Makes This Project Production-Ready?

1. **Security First**: Authentication, validation, HTTPS, rate limiting
2. **Legal Compliance**: Age verification, POPIA, SA regulations
3. **Scalability**: Stateless API, database indexing, pagination
4. **Maintainability**: Clear structure, separation of concerns
5. **User Experience**: Loading states, error handling, responsive design
6. **Testing**: Unit tests, integration tests, E2E tests
7. **Documentation**: README, API docs, setup instructions
8. **Monitoring**: Logging, error tracking, analytics

### Next Steps After Building

1. **Testing**: Write comprehensive tests
2. **Performance**: Optimize database queries, add caching
3. **Monitoring**: Set up error tracking (Sentry), logging
4. **CI/CD**: Automate testing and deployment
5. **Analytics**: Track user behavior, conversion rates
6. **Marketing**: SEO, email campaigns, social media
7. **Customer Support**: Help desk, FAQ, live chat

---

**Remember:** Building software is iterative. Start simple, test often, and improve continuously.


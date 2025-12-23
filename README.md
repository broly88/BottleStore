# 🍷 Alcohol E-Commerce Platform

A complete, production-ready e-commerce platform for alcohol sales in South Africa with age verification (18+), POPIA compliance, and Stripe payment integration.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-14+-blue.svg)

## Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL with Sequelize ORM
- JWT Authentication
- Stripe Payment Integration

### Frontend
- React.js with Vite
- Tailwind CSS
- Redux Toolkit
- Axios

## ✨ Features

### Customer Features
- 🔐 **Secure Authentication** - JWT-based auth with email verification
- 🎂 **Age Verification** - 18+ verification at registration and checkout
- 🛍️ **Product Catalog** - Browse wines, beers, spirits, and ciders
- 🔍 **Advanced Search** - Filter by category, price, alcohol content
- 🛒 **Shopping Cart** - Persistent cart with real-time updates
- 💳 **Stripe Payments** - Secure payment processing in ZAR
- 📦 **Order Tracking** - View order history and status
- 👤 **User Profile** - Manage personal information and addresses
- 📱 **Responsive Design** - Mobile-first, works on all devices

### Admin Features
- 📊 **Dashboard** - Real-time statistics and insights
- 📦 **Product Management** - Full CRUD operations for products
- 🛍️ **Order Management** - Process and track orders
- 👥 **User Management** - Manage users and roles
- 📈 **Reports & Analytics** - Sales and inventory reports with CSV export

### Security & Compliance
- 🔒 **HTTPS/SSL** - Secure connections
- 🛡️ **POPIA Compliant** - South African data protection
- 🎯 **Age Verification** - Multiple verification points
- 💰 **VAT Handling** - 15% VAT calculation and display
- 🚫 **Delivery Restrictions** - No Sunday/holiday deliveries
- 📜 **Liquor License** - License number displayed

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Stripe account
- Cloudinary account (for image uploads)

## 🚀 Quick Start

### With Docker (Recommended)

1. **Clone and configure**
```bash
git clone <repository-url>
cd alcohol-ecommerce
cp .env.example .env
# Edit .env with your credentials
```

2. **Start all services**
```bash
docker-compose up -d
```

3. **Run migrations and seed data**
```bash
docker exec -it liquorshop-api sh
node ../database/migrate.js
node ../database/seed.js
exit
```

4. **Access the application**
- Frontend: http://localhost:80
- Backend API: http://localhost:5000

### Manual Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd alcohol-ecommerce
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

#### 3. Database Setup
```bash
# Create database
createdb liquorshop_db

# Run migrations
cd ../database
node migrate.js

# Seed data (optional)
node seed.js
```

#### 4. Start Backend
```bash
cd ../backend
npm run dev  # Development
# OR
npm start    # Production
```

#### 5. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with API URL and Stripe key
npm run dev
```

### Default Login Credentials

After seeding:
- **Admin:** admin@liquorshop.co.za / Admin123!@#
- **Customer:** john@example.com / Customer123!@#

## Environment Variables

See `.env.example` files in backend and frontend directories.

## Database Setup

1. Create PostgreSQL database:
```bash
createdb alcohol_shop
```

2. Run migrations:
```bash
cd backend
npm run migrate
```

3. Seed database (optional):
```bash
npm run seed
```

## Running the Application

### Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## South African Compliance

This platform complies with:
- Legal drinking age: 18+
- POPIA (Protection of Personal Information Act)
- 15% VAT on all products
- Delivery restrictions (no Sundays/public holidays, 9 AM - 6 PM only)

## License

MIT

## 📁 Project Structure

```
alcohol-ecommerce/
├── backend/                # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── middleware/    # Custom middleware
│   └── tests/            # Backend tests
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # State management
│   │   └── services/     # API services
│   └── public/          # Static assets
├── database/            # Migrations & seeds
├── docs/               # Documentation
├── docker-compose.yml  # Docker orchestration
└── README.md          # This file
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📧 Support

- **Issues:** Open an issue on GitHub
- **Email:** support@liquorshop.co.za
- **Documentation:** See `/docs` directory

## 🗺️ Roadmap

- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Loyalty program
- [ ] Mobile apps (iOS/Android)
- [ ] Multiple payment methods
- [ ] Delivery tracking
- [ ] Multi-language support

---

**Built with ❤️ for the South African market**

*Remember: Please drink responsibly. You must be 18 or older to purchase alcohol.*

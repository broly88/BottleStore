import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import sequelize, { testConnection, syncDatabase } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.js';
import addressRoutes from './routes/addresses.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

app.post('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/addresses', addressRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error('Failed to connect to database. Server not started.');
      process.exit(1);
    }

    if (process.env.NODE_ENV === 'development') {
      await syncDatabase({ alter: true });
    }

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   🍷  Alcohol E-Commerce Platform      ║
║                                        ║
║   Server running on port ${PORT}         ║
║   Environment: ${process.env.NODE_ENV?.padEnd(10) || 'development'.padEnd(10)}            ║
║   API: http://localhost:${PORT}/api       ║
║                                        ║
║   🔒 POPIA Compliant                   ║
║   🎂 Age Verification: 18+             ║
║   💳 Payment: Stripe (ZAR)             ║
║                                        ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing server gracefully...');
  await sequelize.close();
  process.exit(0);
});

startServer();

export default app;

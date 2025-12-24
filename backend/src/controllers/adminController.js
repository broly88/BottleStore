import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import { User, Product, Order, OrderItem } from '../models/index.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    const activeProducts = await Product.count({ where: { isActive: true } });
    const lowStockProducts = await Product.count({
      where: {
        stockQuantity: {
          [Op.lte]: sequelize.col('low_stock_threshold'),
          [Op.gt]: 0,
        },
      },
    });
    const outOfStockProducts = await Product.count({
      where: { stockQuantity: 0 },
    });

    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const processingOrders = await Order.count({ where: { status: 'processing' } });
    const completedOrders = await Order.count({ where: { status: 'delivered' } });

    const totalRevenue = await Order.sum('totalAmount', {
      where: { paymentStatus: 'completed' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = await Order.sum('totalAmount', {
      where: {
        paymentStatus: 'completed',
        createdAt: { [Op.gte]: today },
      },
    });

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyRevenue = await Order.sum('totalAmount', {
      where: {
        paymentStatus: 'completed',
        createdAt: { [Op.gte]: thisMonth },
      },
    });

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          completed: completedOrders,
        },
        revenue: {
          total: parseFloat(totalRevenue || 0).toFixed(2),
          today: parseFloat(todayRevenue || 0).toFixed(2),
          thisMonth: parseFloat(monthlyRevenue || 0).toFixed(2),
        },
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const where = { paymentStatus: 'completed' };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const orders = await Order.findAll({
      where,
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue'],
        [sequelize.fn('SUM', sequelize.col('vat_amount')), 'totalVAT'],
      ],
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'DESC']],
      raw: true,
    });

    const topProducts = await OrderItem.findAll({
      where: {
        createdAt: where.createdAt,
      },
      attributes: [
        'productName',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalRevenue'],
      ],
      group: ['productName'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: 10,
      raw: true,
    });

    res.json({
      success: true,
      data: {
        salesByDate: orders,
        topProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getInventoryReport = async (req, res, next) => {
  try {
    const { category, lowStockOnly, outOfStockOnly } = req.query;

    const where = {};
    if (category) where.category = category;

    if (lowStockOnly === 'true') {
      where.stockQuantity = {
        [Op.lte]: sequelize.col('low_stock_threshold'),
        [Op.gt]: 0,
      };
    }

    if (outOfStockOnly === 'true') {
      where.stockQuantity = 0;
    }

    const products = await Product.findAll({
      where,
      attributes: [
        'id',
        'name',
        'category',
        'stockQuantity',
        'lowStockThreshold',
        'price',
        'isActive',
      ],
      order: [['stockQuantity', 'ASC']],
    });

    const totalValue = products.reduce((sum, product) => {
      return sum + (parseFloat(product.price) * product.stockQuantity);
    }, 0);

    const summary = {
      totalProducts: products.length,
      totalStockValue: parseFloat(totalValue.toFixed(2)),
      lowStockCount: products.filter(p =>
        p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0
      ).length,
      outOfStockCount: products.filter(p => p.stockQuantity === 0).length,
    };

    res.json({
      success: true,
      data: {
        summary,
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, ageVerified, emailVerified } = req.query;

    const where = {};
    if (role) where.role = role;
    if (ageVerified !== undefined) where.ageVerified = ageVerified === 'true';
    if (emailVerified !== undefined) where.emailVerified = emailVerified === 'true';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['passwordHash', 'emailVerificationToken', 'resetPasswordToken'] },
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be customer or admin',
      });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['passwordHash', 'emailVerificationToken', 'resetPasswordToken'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot change your own role',
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardStats,
  getSalesReport,
  getInventoryReport,
  getAllUsers,
  updateUserRole,
};

import { Op } from 'sequelize';
import { Product } from '../models/index.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      minAlcohol,
      maxAlcohol,
      search,
      featured,
      isActive = 'true',
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = req.query;

    const where = {};

    if (isActive) {
      where.isActive = isActive === 'true';
    }

    if (category) {
      where.category = category;
    }

    if (subcategory) {
      where.subcategory = subcategory;
    }

    if (brand) {
      where.brand = brand;
    }

    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (minAlcohol || maxAlcohol) {
      where.alcoholContent = {};
      if (minAlcohol) where.alcoholContent[Op.gte] = parseFloat(minAlcohol);
      if (maxAlcohol) where.alcoholContent[Op.lte] = parseFloat(maxAlcohol);
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Map camelCase to snake_case for ordering
    const sortByMap = {
      'createdAt': 'created_at',
      'updatedAt': 'updated_at',
    };
    const orderColumn = sortByMap[sortBy] || sortBy;

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[orderColumn, sortOrder]],
    });

    res.json({
      success: true,
      data: {
        products,
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

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ where: { slug } });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    await product.update(updates);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.findAll({
      where: {
        featured: true,
        isActive: true,
      },
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
      where: { isActive: true },
    });

    const categoryList = categories.map(c => c.category);

    res.json({
      success: true,
      data: {
        categories: categoryList,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getCategories,
};

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import slugify from 'slugify';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['wine', 'beer', 'spirits', 'cider', 'other']],
    },
  },
  subcategory: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  alcoholContent: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    field: 'alcohol_content',
    validate: {
      min: 0,
      max: 100,
    },
  },
  volumeMl: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'volume_ml',
    validate: {
      min: 0,
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  vatIncluded: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'vat_included',
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'stock_quantity',
    validate: {
      min: 0,
    },
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    field: 'low_stock_threshold',
    validate: {
      min: 0,
    },
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'image_url',
  },
  images: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeValidate: (product) => {
      if (product.name && !product.slug) {
        product.slug = slugify(product.name, { lower: true, strict: true });
      }
    },
  },
});

Product.prototype.isInStock = function() {
  return this.stockQuantity > 0;
};

Product.prototype.isLowStock = function() {
  return this.stockQuantity <= this.lowStockThreshold && this.stockQuantity > 0;
};

Product.prototype.getPriceWithVAT = function() {
  if (this.vatIncluded) {
    return parseFloat(this.price);
  }
  return parseFloat(this.price) * 1.15;
};

Product.prototype.getVATAmount = function() {
  const priceWithVAT = this.getPriceWithVAT();
  return priceWithVAT - (priceWithVAT / 1.15);
};

export default Product;

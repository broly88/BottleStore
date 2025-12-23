import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  orderNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'order_number',
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'processing', 'shipped', 'delivered', 'cancelled']],
    },
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  vatAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'vat_amount',
    validate: {
      min: 0,
    },
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'delivery_fee',
    validate: {
      min: 0,
    },
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount',
    validate: {
      min: 0,
    },
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'payment_method',
  },
  paymentStatus: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending',
    field: 'payment_status',
    validate: {
      isIn: [['pending', 'completed', 'failed', 'refunded']],
    },
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'stripe_payment_intent_id',
  },
  deliveryAddress: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'delivery_address',
  },
  deliveryInstructions: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'delivery_instructions',
  },
  deliveryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'delivery_date',
  },
  ageVerifiedAtCheckout: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'age_verified_at_checkout',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'orders',
  timestamps: true,
  hooks: {
    beforeCreate: async (order) => {
      if (!order.orderNumber) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        order.orderNumber = `ORD-${timestamp}-${random}`;
      }
    },
  },
});

Order.prototype.canBeCancelled = function() {
  return ['pending', 'processing'].includes(this.status);
};

Order.prototype.isPaid = function() {
  return this.paymentStatus === 'completed';
};

export default Order;

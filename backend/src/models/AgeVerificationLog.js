import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AgeVerificationLog = sequelize.define('AgeVerificationLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'order_id',
    references: {
      model: 'orders',
      key: 'id',
    },
  },
  verificationMethod: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'verification_method',
    validate: {
      isIn: [['dob_check', 'id_verification']],
    },
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address',
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'user_agent',
  },
}, {
  tableName: 'age_verification_logs',
  timestamps: true,
  underscored: true,
  updatedAt: false,
});

export default AgeVerificationLog;

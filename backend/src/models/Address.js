import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Address = sequelize.define('Address', {
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
    onDelete: 'CASCADE',
  },
  addressType: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'address_type',
    validate: {
      isIn: [['home', 'work', 'other']],
    },
  },
  streetAddress: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'street_address',
  },
  suburb: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  province: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [[
        'Eastern Cape',
        'Free State',
        'Gauteng',
        'KwaZulu-Natal',
        'Limpopo',
        'Mpumalanga',
        'Northern Cape',
        'North West',
        'Western Cape'
      ]],
    },
  },
  postalCode: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'postal_code',
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_default',
  },
}, {
  tableName: 'addresses',
  timestamps: true,
  underscored: true,
});

Address.prototype.getFullAddress = function() {
  return `${this.streetAddress}, ${this.suburb ? this.suburb + ', ' : ''}${this.city}, ${this.province} ${this.postalCode}`;
};

export default Address;

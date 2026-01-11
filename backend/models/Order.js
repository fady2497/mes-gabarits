// models/Order.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderNumber: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    customerEmail: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'processing', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING(50)
    },
    paymentId: {
      type: DataTypes.STRING(100)
    },
    downloadsLeft: {
      type: DataTypes.INTEGER,
      defaultValue: 3
    },
    downloadExpiry: {
      type: DataTypes.DATE
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('shippingAddress');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('shippingAddress', JSON.stringify(value));
      }
    },
    client_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    client_phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  },
  {
    tableName: 'orders',
    timestamps: true
  }
);
// ... après la définition du modèle Order

Order.associate = (models) => {
  Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
};

module.exports = Order;

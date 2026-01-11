const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PromoCode = sequelize.define(
  'PromoCode',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    type: { type: DataTypes.ENUM('percent', 'fixed'), allowNull: false },
    value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    minSubtotal: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    expiresAt: { type: DataTypes.DATE, allowNull: true },
    maxUses: { type: DataTypes.INTEGER, defaultValue: 0 },
    uses: { type: DataTypes.INTEGER, defaultValue: 0 }
  },
  { tableName: 'promo_codes', timestamps: true }
);

module.exports = PromoCode;

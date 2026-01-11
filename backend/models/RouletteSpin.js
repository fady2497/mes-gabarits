const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const RouletteSpin = sequelize.define(
  'RouletteSpin',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    label: { type: DataTypes.STRING(100), allowNull: false },
    type: { type: DataTypes.STRING(50), allowNull: false },
    value: { type: DataTypes.FLOAT, allowNull: true },
    gift: { type: DataTypes.INTEGER, allowNull: true },
    expiresAt: { type: DataTypes.DATE, allowNull: true },
    used: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  {
    tableName: 'roulette_spins',
    timestamps: true
  }
);

RouletteSpin.associate = (models) => {
  // Relation simple si besoin (non strictement nécessaire pour cette feature)
};

module.exports = RouletteSpin;


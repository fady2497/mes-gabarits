const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Template = sequelize.define(
  'Template',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shortDescription: {
      type: DataTypes.STRING(500)
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2)
    },
    category: {
      type: DataTypes.ENUM('robes', 'pantalons', 'chemises', 'vestes', 'accessoires'),
      allowNull: false
    },
    difficulty: {
      type: DataTypes.ENUM('débutant', 'intermédiaire', 'expert'),
      defaultValue: 'débutant'
    },
    images: {
      type: DataTypes.TEXT, // Stocker JSON en texte ou utiliser table séparée
      get() {
        const rawValue = this.getDataValue('images');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('images', JSON.stringify(value));
      }
    },
    pdfFile: {
      type: DataTypes.STRING(500)
    },
    aiFile: {
      type: DataTypes.STRING(500)
    },
    instructionsFile: {
      type: DataTypes.STRING(500)
    },
    tags: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('tags');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('tags', JSON.stringify(value));
      }
    },
    sizes: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('sizes');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('sizes', JSON.stringify(value));
      }
    },
    included: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('included');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('included', JSON.stringify(value));
      }
    },
    salesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'templates',
    timestamps: true,
    indexes: [
      {
        name: 'idx_category_price',
        fields: ['category', 'price']
      },
      {
        name: 'idx_sales_count',
        fields: ['salesCount']
      },
      {
        name: 'idx_difficulty',
        fields: ['difficulty']
      }
    ]
  }
);
// ... après la définition du modèle Template

Template.associate = (models) => {
  Template.hasMany(models.OrderItem, { foreignKey: 'templateId', as: 'orderItems' });
  // Vous pourriez ajouter d'autres associations plus tard
  // Template.hasMany(models.Review, { foreignKey: 'templateId', as: 'reviews' });
};

module.exports = Template;

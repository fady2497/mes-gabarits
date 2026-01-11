// config/database.js - Configuration MySQL
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuration MySQL avec Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'gabarits_shop',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log, // Affiche les requêtes SQL dans la console
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true
    }
  }
);

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    console.log('🔗 Connexion à MySQL...');
    await sequelize.authenticate();
    console.log('✅ MySQL connecté avec succès!');
    console.log(`📁 Base de données: ${process.env.DB_NAME}`);
    console.log(`🖥️  Serveur: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message);
    console.error('💡 Vérifiez que:');
    console.error('   - MySQL est installé et démarré');
    console.error('   - Les identifiants dans .env sont corrects');
    console.error('   - La base de données existe');
    return false;
  }
};

module.exports = { sequelize, testConnection };
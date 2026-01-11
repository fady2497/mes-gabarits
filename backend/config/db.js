// backend/config/db.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Instance Sequelize avec SQLite (fichier local)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false // Désactiver les logs SQL pour plus de clarté
});

const connectDB = async () => {
  try {
    console.log('🔗 Connexion à la base de données SQLite...');
    await sequelize.authenticate();
    console.log('✅ Base de données connectée avec succès !');

    // Charger les modèles pour créer les tables
    const db = require('../models');
    
    // Créer les tables automatiquement
    await sequelize.sync();
    console.log('📦 Tables synchronisées !');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données :', error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB
};

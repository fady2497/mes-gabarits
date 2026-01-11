#!/usr/bin/env node
// quick-test-mysql.js - Test rapide de la connexion MySQL
require('dotenv').config();
const { Sequelize } = require('sequelize');

async function testMySQL() {
  console.log('🔍 Test de connexion MySQL...\n');
  
  console.log('Configuration:');
  console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`  Port: ${process.env.DB_PORT || 3306}`);
  console.log(`  Database: ${process.env.DB_NAME || 'gabarits_shop'}`);
  console.log(`  User: ${process.env.DB_USER || 'root'}`);
  console.log(`  Password: ${process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-3) : 'NON DÉFINI'}\n`);
  
  const sequelize = new Sequelize(
    process.env.DB_NAME || 'gabarits_shop',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false
    }
  );

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion MySQL réussie!');
    console.log('🎉 Tout est prêt pour utiliser MySQL!\n');
    
    // Test de création d'une table simple
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id INT AUTO_INCREMENT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Droits de création de tables: OK');
    
    // Supprimer la table de test
    await sequelize.query('DROP TABLE IF EXISTS test_connection');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:\n');
    console.error(`   ${error.message}\n`);
    console.error('💡 Vérifiez que:');
    console.error('   1. MySQL est démarré (vérifiez dans les services Windows)');
    console.error('   2. La base de données "gabarits_shop" existe');
    console.error('   3. Le mot de passe dans .env est correct');
    console.error('   4. L\'utilisateur a les droits d\'accès\n');
    process.exit(1);
  }
}

testMySQL();

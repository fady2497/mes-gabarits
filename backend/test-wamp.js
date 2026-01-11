// test-wamp.js - Test spécifique pour WAMP
const mysql = require('mysql2/promise');

async function testWAMP() {
  console.log('🔍 Test de connexion MySQL WAMP...\n');

  const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',  // WAMP par défaut = pas de mot de passe
    database: 'gabarits_shop'
  };

  console.log('Configuration:');
  console.log('  Host:', config.host);
  console.log('  Port:', config.port);
  console.log('  Database:', config.database);
  console.log('  User:', config.user);
  console.log('  Password:', config.password === '' ? '(vide)' : config.password);
  console.log('');

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connexion MySQL reussie!');
    
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('✅ Test requete OK, resultat:', rows[0].result);
    
    await connection.end();
    console.log('\n🎉 MySQL fonctionne parfaitement avec WAMP!');
    console.log('📝 Votre configuration .env est correcte!');
    process.exit(0);
  } catch (error) {
    console.log('\n❌ Code erreur:', error.code);
    console.log('Message:', error.message);
    console.log('\n💡 Solutions:');
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('  1. Verifiez que WAMP est demarre (icone verte)');
      console.log('  2. Essayez de definir un mot de passe:');
      console.log('     - Clic droit WAMP > MySQL > MySQL Console');
      console.log('     - Tapez: ALTER USER \'root\'@\'localhost\' IDENTIFIED BY \'root\';');
      console.log('     - Puis dans .env: DB_PASSWORD=root');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('  - MySQL n\'est pas demarre');
      console.log('  - Verifiez que WAMP est lance (icone verte)');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('  - La base "gabarits_shop" n\'existe pas');
      console.log('  - Creez-la via phpMyAdmin ou MySQL Console');
    }
    process.exit(1);
  }
}

testWAMP();

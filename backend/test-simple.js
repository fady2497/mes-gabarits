// test-simple.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
  console.log('Test de connexion MySQL...\n');
  console.log('Configuration:');
  console.log('  Host:', process.env.DB_HOST);
  console.log('  Port:', process.env.DB_PORT);
  console.log('  Database:', process.env.DB_NAME);
  console.log('  User:', process.env.DB_USER);
  console.log('  Password:', process.env.DB_PASSWORD ? '***' : 'NON DEFINI');
  console.log('');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Connexion MySQL reussie!');
    
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('✅ Test requete OK, resultat:', rows[0].result);
    
    await connection.end();
    console.log('\n🎉 Tout fonctionne parfaitement!');
    process.exit(0);
  } catch (error) {
    console.log('\n❌ ERREUR:', error.code);
    console.log('Message:', error.message);
    console.log('\nSolutions possibles:');
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('  - Verifiez le nom d\'utilisateur et le mot de passe');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('  - MySQL n\'est pas demarre');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('  - La base de donnees n\'existe pas');
    }
    process.exit(1);
  }
}

test();

// scripts/init-database.js
const { sequelize } = require('../config/database');
const db = require('../models');

async function initDatabase() {
  try {
    console.log('🚀 Initialisation de la base de données...\n');

    // Test de connexion
    console.log('1️⃣ Test de connexion MySQL...');
    await sequelize.authenticate();
    console.log('   ✅ Connexion établie\n');

    // Créer les tables
    console.log('2️⃣ Création des tables...');
    await sequelize.sync({ force: false }); // force: true supprime et recrée les tables
    console.log('   ✅ Tables créées\n');

    // Insérer des données de test
    console.log('3️⃣ Insertion de données de test...');
    
    // Créer un utilisateur de test
    const user = await db.User.findOrCreate({
      where: { email: 'test@example.com' },
      defaults: {
        name: 'Utilisateur Test',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      }
    });
    console.log('   ✅ Utilisateur créé:', user[0].email);

    // Créer quelques commandes de test
    const order1 = await db.Order.findOrCreate({
      where: { orderNumber: 'CMD-001' },
      defaults: {
        orderNumber: 'CMD-001',
        userId: user[0].id,
        customerEmail: 'jean.dupont@example.com',
        totalAmount: 49.99,
        status: 'pending'
      }
    });
    console.log('   ✅ Commande 1 créée:', order1[0].orderNumber);

    const order2 = await db.Order.findOrCreate({
      where: { orderNumber: 'CMD-002' },
      defaults: {
        orderNumber: 'CMD-002',
        userId: user[0].id,
        customerEmail: 'marie.martin@example.com',
        totalAmount: 89.50,
        status: 'completed'
      }
    });
    console.log('   ✅ Commande 2 créée:', order2[0].orderNumber);

    console.log('\n🎉 Base de données initialisée avec succès!');
    console.log('📊 Vous pouvez maintenant utiliser votre application.');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'initialisation:', error.message);
    console.error('\n💡 Assurez-vous que:');
    console.error('   - MySQL est démarré');
    console.error('   - La base de données "gabarits_shop" existe');
    console.error('   - Les identifiants dans .env sont corrects');
    process.exit(1);
  }
}

initDatabase();

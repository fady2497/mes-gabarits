// auto-setup-mysql.js - Configuration automatique complète
const mysql = require('mysql2/promise');

async function autoSetup() {
  console.log('🚀 Configuration automatique de MySQL pour WAMP...\n');

  // Étape 1: Connexion sans base de données
  console.log('📡 Connexion à MySQL...');
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''  // WAMP par défaut
    });

    console.log('✅ Connecté à MySQL!\n');

    // Étape 2: Créer la base de données
    console.log('🗄️  Création de la base de données "gabarits_shop"...');
    try {
      await connection.query('DROP DATABASE IF EXISTS gabarits_shop');
      await connection.query('CREATE DATABASE gabarits_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
      console.log('✅ Base de données créée!\n');
    } catch (err) {
      if (err.code === 'ER_DB_CREATE_EXISTS') {
        console.log('ℹ️  La base existe déjà, on continue...\n');
      } else {
        throw err;
      }
    }

    // Étape 3: Sélectionner la base
    await connection.query('USE gabarits_shop');

    // Étape 4: Créer les tables
    console.log('📊 Création des tables...');
    
    // Table users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('customer', 'admin') DEFAULT 'customer',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('  ✅ Table "users" créée');

    // Table orders
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderNumber VARCHAR(50) UNIQUE NOT NULL,
        userId INT NOT NULL,
        customerEmail VARCHAR(255) NOT NULL,
        totalAmount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'paid', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
        paymentMethod VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('  ✅ Table "orders" créée');

    // Table order_items
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId INT NOT NULL,
        productName VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        size VARCHAR(10),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('  ✅ Table "order_items" créée\n');

    // Étape 5: Insérer des données de test
    console.log('📝 Insertion de données de test...');
    
    // Utilisateur de test
    await connection.query(`
      INSERT IGNORE INTO users (id, name, email, password, role) 
      VALUES (1, 'Utilisateur Test', 'test@example.com', 'password', 'customer')
    `);
    console.log('  ✅ Utilisateur de test créé');

    // Commandes de test
    await connection.query(`
      INSERT IGNORE INTO orders (id, orderNumber, userId, customerEmail, totalAmount, status) 
      VALUES 
        (1, 'CMD-001', 1, 'jean.dupont@example.com', 49.99, 'pending'),
        (2, 'CMD-002', 1, 'marie.martin@example.com', 89.50, 'completed')
    `);
    console.log('  ✅ Commandes de test créées');

    await connection.query(`
      INSERT IGNORE INTO order_items (orderId, productName, quantity, price, size) 
      VALUES 
        (1, 'Gabarit A-001', 2, 24.99, 'M'),
        (2, 'Gabarit B-002', 3, 29.83, 'L')
    `);
    console.log('  ✅ Articles de test créés\n');

    await connection.end();

    console.log('🎉 CONFIGURATION TERMINÉE AVEC SUCCÈS!\n');
    console.log('✅ Base de données: gabarits_shop');
    console.log('✅ Tables créées: users, orders, order_items');
    console.log('✅ Données de test ajoutées');
    console.log('\n📝 Votre fichier .env est correct:');
    console.log('   DB_HOST=localhost');
    console.log('   DB_PORT=3306');
    console.log('   DB_NAME=gabarits_shop');
    console.log('   DB_USER=root');
    console.log('   DB_PASSWORD=\n');
    console.log('🚀 Vous pouvez maintenant redémarrer votre serveur!\n');

  } catch (error) {
    console.error('\n❌ ERREUR:', error.code);
    console.error('Message:', error.message);
    console.error('\n💡 Solutions:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('  - WAMP n\'est pas démarré');
      console.error('  - Lancez WAMP et assurez-vous que l\'icône est VERTE');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('  - Le mot de passe root n\'est pas vide');
      console.error('  - Essayez de modifier DB_PASSWORD dans .env');
    } else {
      console.error('  - Vérifiez que MySQL fonctionne dans WAMP');
    }
    process.exit(1);
  }
}

autoSetup();

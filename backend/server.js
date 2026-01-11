// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const { connectDB } = require('./config/db'); // ⬅️ changé

// Charger les variables d'environnement depuis backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

// Connexion à la base de données
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/templates', require('./routes/templates'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/promo', require('./routes/promo'));
app.use('/api/roulette', require('./routes/roulette'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/stock', require('./routes/stock'));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API pour vente de gabarits en ligne' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route non trouvée' });
});

function startServer() {
  const PORT = parseInt(process.env.PORT || '5002', 10);
  const server = app.listen(PORT, () => {
    console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} occupé. Arrêt (veuillez fermer les instances en double).`);
      process.exit(1);
    } else {
      console.error('❌ Erreur serveur:', err);
      process.exit(1);
    }
  });
}

startServer();

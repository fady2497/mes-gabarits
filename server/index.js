// backend/index.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration email (avec valeurs par défaut sécurisées)
const createTransporter = () => {
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASS;

  if (!mailUser || !mailPass) {
    console.log('⚠️  Configuration email non complète - mode simulation activé');
    return {
      sendMail: async (options) => {
        console.log('📧 Email simulé:', options);
        return { messageId: 'simulated-' + Date.now() };
      },
      verify: async () => {
        console.log('✅ Vérification email simulée');
        return true;
      }
    };
  }

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: mailUser,
      pass: mailPass
    }
  });
};

const transporter = createTransporter();

const whatsappRouter = require('./whatsapp');

// Stockage en mémoire (temporaire)
let orders = [];
let orderCounter = 1;
const STOCK_PATH = path.join(__dirname, 'data', 'stock.json');
function readStockSafe() {
  try {
    const raw = fs.readFileSync(STOCK_PATH, 'utf8');
    const json = JSON.parse(raw);
    return json || {};
  } catch (e) {
    console.warn('⚠️ Stock non disponible, retour vide:', e.message);
    return {};
  }
}

// =========== ROUTES ===========

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Gabarits.fr Backend',
    status: 'ACTIVE',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      root: 'GET /',
      health: 'GET /api/health',
      orders_list: 'GET /api/orders',
      orders_create: 'POST /api/orders',
      test_email: 'GET /api/test-email',
      stats: 'GET /api/stats'
    }
  });
});

// Route santé
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    status: '✅ OK',
    service: 'Gabarits.fr API',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    stats: {
      totalOrders: orders.length,
      memory: process.memoryUsage()
    }
  });
});

// Stock sécurisé (lecture seule)
app.get('/api/stock', (req, res) => {
  try {
    const stock = readStockSafe();
    res.json({ ok: true, data: stock, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'stock_read_error', message: error.message });
  }
});

// Route pour récupérer les commandes
app.get('/api/orders', (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '50', 10);
    const sortedOrders = orders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);

    res.json({
      ok: true,
      data: sortedOrders,
      count: sortedOrders.length,
      total: orders.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur GET /api/orders:', error);
    res.status(500).json({
      ok: false,
      error: 'server_error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Route pour créer une commande
app.post('/api/orders', async (req, res) => {
  try {
    const { client, cart, totals, meta } = req.body || {};

    console.log('📦 Nouvelle commande reçue:', {
      client: client?.name,
      items: cart?.length
    });

    // Validation des données
    if (!client || !client.name || !client.phone) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_client',
        message: 'Nom et téléphone du client requis',
        timestamp: new Date().toISOString()
      });
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'empty_cart',
        message: 'Le panier ne peut pas être vide',
        timestamp: new Date().toISOString()
      });
    }

    // Calculs
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const pricePerUnit = totalItems >= 20 ? 85 : totalItems >= 10 ? 90 : 100;
    const subtotal = totalItems * pricePerUnit;

    // Construction du message
    const lines = cart.map(
      (item) =>
        `- ${item.id || 'N/A'} | ${item.name || 'Produit'} | Taille ${item.size || '-'} | Qté ${item.quantity || 1} | ${(item.quantity || 1) * pricePerUnit}€`
    );

    const header = [
      `Client: ${client.name}`,
      `Téléphone: ${client.phone}`,
      client.email ? `Email: ${client.email}` : null,
      client.notes ? `Notes: ${client.notes}` : null
    ].filter(Boolean);

    const body = [
      'NOUVELLE COMMANDE GABARITS.FR',
      '===============================',
      '',
      ...header,
      '',
      'DÉTAIL DE LA COMMANDE:',
      ...lines,
      '',
      `Sous-total: ${subtotal}€`,
      `Articles: ${totalItems}`,
      `Prix unitaire: ${pricePerUnit}€`,
      '',
      `Date: ${new Date().toLocaleString('fr-FR')}`,
      `Référence: ${meta?.ref || `CMD-${Date.now()}`}`,
      '',
      '---',
      'Cet email a été généré automatiquement par le système de commande Gabarits.fr'
    ]
      .filter(Boolean)
      .join('\r\n');

    const ref = meta?.ref || `CMD-${Date.now().toString(36).toUpperCase()}`;
    const newOrder = {
      id: orderCounter++,
      ref,
      client_name: client.name,
      client_phone: client.phone,
      client_email: client.email || null,
      client_notes: client.notes || null,
      subtotal,
      price_per_unit: pricePerUnit,
      total_items: totalItems,
      items_json: JSON.stringify(cart),
      created_at: new Date().toISOString()
    };

    // Sauvegarde en mémoire
    orders.push(newOrder);
    console.log(`✅ Commande ${ref} enregistrée (${orders.length} total)`);

    // Envoi des emails (si configuré)
    try {
      const emailPromises = [];

      // Email au commerçant
      if (process.env.MERCHANT_EMAIL) {
        emailPromises.push(
          transporter.sendMail({
            from: process.env.MAIL_FROM || process.env.MAIL_USER || 'noreply@gabarits.fr',
            to: process.env.MERCHANT_EMAIL,
            subject: `[Gabarits.fr] Nouvelle commande ${ref}`,
            text: body
          })
        );
        console.log(`📧 Email envoyé au commerçant: ${process.env.MERCHANT_EMAIL}`);
      }

      // Email de confirmation au client
      if (client.email) {
        const confirmationBody = [
          `Bonjour ${client.name},`,
          '',
          'Merci pour votre commande sur Gabarits.fr !',
          '',
          'RÉSUMÉ DE VOTRE COMMANDE:',
          ...lines,
          '',
          `Montant total: ${subtotal}€`,
          `Nombre d'articles: ${totalItems}`,
          '',
          `Référence: ${ref}`,
          `Date: ${new Date().toLocaleString('fr-FR')}`,
          '',
          'Nous traiterons votre commande dans les plus brefs délais.',
          'Vous serez contacté(e) sous 24h pour la finalisation.',
          '',
          'Cordialement,',
          "L'équipe Gabarits.fr",
          '📞 01 23 45 67 89',
          '📧 contact@gabarits.fr'
        ]
          .filter(Boolean)
          .join('\r\n');

        emailPromises.push(
          transporter.sendMail({
            from: process.env.MAIL_FROM || process.env.MAIL_USER || 'noreply@gabarits.fr',
            to: client.email,
            subject: `[Gabarits.fr] Confirmation de commande ${ref}`,
            text: confirmationBody
          })
        );
        console.log(`📧 Email de confirmation envoyé à: ${client.email}`);
      }

      if (emailPromises.length > 0) {
        await Promise.all(emailPromises);
        console.log('✅ Tous les emails envoyés avec succès');
      } else {
        console.log("ℹ️  Aucun email configuré pour l'envoi");
      }
    } catch (emailError) {
      console.error("❌ Erreur lors de l'envoi des emails:", emailError);
      // On continue même si l'email échoue
    }

    // Réponse au client
    res.json({
      ok: true,
      message: 'Commande créée avec succès',
      order: {
        ref,
        subtotal,
        totalItems,
        pricePerUnit
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur POST /api/orders:', error);
    res.status(500).json({
      ok: false,
      error: 'server_error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur',
      timestamp: new Date().toISOString()
    });
  }
});

// Route de test email
app.get('/api/test-email', async (req, res) => {
  try {
    await transporter.verify();

    const config = {
      host: process.env.MAIL_HOST || 'non configuré',
      port: process.env.MAIL_PORT || 'non configuré',
      secure: process.env.MAIL_SECURE || 'non configuré',
      from: process.env.MAIL_FROM || 'non configuré',
      user: process.env.MAIL_USER ? 'configuré' : 'non configuré',
      merchant: process.env.MERCHANT_EMAIL ? 'configuré' : 'non configuré'
    };

    res.json({
      ok: true,
      message: 'Configuration email vérifiée avec succès',
      config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur test email:', error);
    res.status(500).json({
      ok: false,
      error: 'email_config_error',
      message: error.message,
      config: {
        host: process.env.MAIL_HOST || 'non configuré',
        port: process.env.MAIL_PORT || 'non configuré',
        user: process.env.MAIL_USER ? 'configuré' : 'non configuré'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Route statistiques
app.get('/api/stats', (req, res) => {
  res.json({
    ok: true,
    stats: {
      totalOrders: orders.length,
      lastOrder: orders[0] || null,
      serverUptime: process.uptime(),
      memory: process.memoryUsage()
    },
    timestamp: new Date().toISOString()
  });
});

app.use('/api/whatsapp', whatsappRouter);

// Route pour réinitialiser (développement uniquement)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/reset', (req, res) => {
    orders = [];
    orderCounter = 1;
    res.json({
      ok: true,
      message: 'Données réinitialisées',
      timestamp: new Date().toISOString()
    });
  });
}

// Gestion des erreurs 404
app.use('/api/*', (req, res) => {
  res.status(404).json({
    ok: false,
    error: 'not_found',
    message: `Route ${req.originalUrl} non trouvée`,
    timestamp: new Date().toISOString()
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur globale:', err);
  res.status(500).json({
    ok: false,
    error: 'internal_error',
    message: 'Erreur interne du serveur',
    timestamp: new Date().toISOString()
  });
});

// =========== DÉMARRAGE (avec fallback de port) ===========
function startServer(basePort = parseInt(process.env.PORT || '5000', 10), attempts = 0) {
  const PORT = basePort + attempts;
  const server = app.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(60));
    console.log('   🚀 SERVEUR BACKEND GABARITS.FR DÉMARRÉ');
    console.log('='.repeat(60));
    console.log(`   📍 URL: http://localhost:${PORT}`);
    console.log(`   🏥 Santé: http://localhost:${PORT}/api/health`);
    console.log(`   📦 Commandes: POST http://localhost:${PORT}/api/orders`);
    console.log(`   📋 Liste: GET http://localhost:${PORT}/api/orders`);
    console.log(`   📧 Test email: GET http://localhost:${PORT}/api/test-email`);
    console.log('='.repeat(60));
    console.log(`   📊 Commandes en mémoire: ${orders.length}`);
    console.log(`   🔧 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(60));
    console.log('   📝 En attente de requêtes...');
    console.log('');
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attempts < 10) {
      console.error(`⚠️  Port ${PORT} occupé, tentative sur ${PORT + 1}...`);
      startServer(basePort, attempts + 1);
    } else {
      console.error('❌ Erreur serveur:', err);
      process.exit(1);
    }
  });

  process.on('SIGTERM', () => {
    console.log('🛑 Fermeture du serveur...');
    server.close(() => {
      console.log('✅ Serveur fermé proprement');
      process.exit(0);
    });
  });
}

startServer();

// Gestion propre de l'arrêt
// SIGTERM géré dans startServer

process.on('uncaughtException', (err) => {
  console.error('❌ Exception non capturée:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse non gérée:', reason);
});

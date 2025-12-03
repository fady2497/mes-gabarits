const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  secure: process.env.MAIL_SECURE === 'true',
  auth:
    process.env.MAIL_USER && process.env.MAIL_PASS
      ? {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      : undefined
});

app.post('/api/orders', async (req, res) => {
  try {
    const { client, cart, totals, meta } = req.body || {};

    if (!client || !client.name || !client.phone) {
      return res.status(400).json({ ok: false, error: 'invalid_client' });
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ ok: false, error: 'empty_cart' });
    }

    const lines = cart.map(
      (item) =>
        `- ${item.id} | ${item.name} | Taille ${item.size || '-'} | Qté ${item.quantity} | ${item.quantity * (item.price || totals?.pricePerUnit || 0)}€`
    );

    const header = [
      `Client: ${client.name} | Téléphone: ${client.phone}`,
      client.email ? `Email: ${client.email}` : null,
      client.notes ? `Notes: ${client.notes}` : null
    ].filter(Boolean);

    const subtotal =
      totals?.subtotal ?? cart.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0);
    const totalLine = `Total: ${subtotal}€`;

    const body = [
      'Nouvelle commande reçue:',
      '',
      ...header,
      '',
      ...lines,
      '',
      totalLine,
      '',
      `Date: ${new Date().toISOString()}`,
      meta && meta.ref ? `Ref: ${meta.ref}` : null
    ]
      .filter(Boolean)
      .join('\r\n');

    // Envoyer l'email au commerçant
    if (process.env.MERCHANT_EMAIL) {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: process.env.MERCHANT_EMAIL,
        subject: 'Commande de gabarits',
        text: body
      });
    }

    // Envoyer une copie au client si email fourni
    if (client.email && process.env.MAIL_USER) {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: client.email,
        subject: 'Confirmation de votre commande - Gabarits.fr',
        text: `Bonjour ${client.name},\n\nMerci pour votre commande !\n\n${body}\n\nNous vous contacterons rapidement pour finaliser votre commande.\n\nCordialement,\nL'équipe Gabarits.fr`
      });
    }

    return res.json({ ok: true, message: 'Commande envoyée avec succès' });
  } catch (e) {
    console.error("Erreur lors de l'envoi de la commande:", e);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
});

// Route de santé pour vérifier que l'API fonctionne
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Gabarits.fr API',
    timestamp: new Date().toISOString()
  });
});

// Route de test pour vérifier la configuration email
app.get('/api/test-email', async (req, res) => {
  try {
    await transporter.verify();
    res.json({
      ok: true,
      message: 'Configuration email vérifiée avec succès',
      config: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE,
        user: process.env.MAIL_USER ? 'configuré' : 'non configuré'
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'email_config_error',
      message: error.message
    });
  }
});

const port = parseInt(process.env.PORT || '5000', 10);
app.listen(port, () => {
  console.log(`🚀 Serveur API démarré sur le port ${port}`);
  console.log(`📧 Configuration email: ${process.env.MAIL_HOST}:${process.env.MAIL_PORT}`);
  console.log(`📦 API de commandes disponible sur http://localhost:${port}/api/orders`);
  console.log(`🏥 Vérification santé: http://localhost:${port}/api/health`);
});

const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const db = require('../models');

// Route GET pour récupérer toutes les commandes
router.get('/', async (req, res) => {
  try {
    // Récupérer toutes les commandes depuis MySQL avec les relations
    const orders = await db.Order.findAll({
      include: [
        {
          model: db.OrderItem,
          as: 'items'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transformer les données pour le frontend
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      ref: order.orderNumber,
      customer: order.customerEmail,
      client_name: order.client_name || 'Non renseigné',
      client_phone: order.client_phone || 'Non renseigné',
      total: parseFloat(order.totalAmount),
      status: order.status,
      date: order.createdAt,
      items: order.items,
      shippingAddress: order.shippingAddress
    }));

    res.json({
      success: true,
      ok: true,
      data: formattedOrders
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({
      success: false,
      ok: false,
      error: error.message
    });
  }
});

// Route GET pour récupérer une commande spécifique
router.get('/:id', async (req, res) => {
  try {
    const order = await db.Order.findByPk(req.params.id, {
      include: [
        {
          model: db.OrderItem,
          as: 'items'
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        ok: false,
        error: 'Commande non trouvée'
      });
    }

    res.json({
      success: true,
      ok: true,
      data: {
        id: order.id,
        ref: order.orderNumber,
        customer: order.customerEmail,
        total: parseFloat(order.totalAmount),
        status: order.status,
        date: order.createdAt,
        items: order.items
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({
      success: false,
      ok: false,
      error: error.message
    });
  }
});

// Route POST pour créer une nouvelle commande
router.post('/', requireAuth, async (req, res) => {
  try {
    const { client, cart, totals, meta, shipping } = req.body;

    // Créer la commande
    const shippingAddr =
      shipping ||
      (client
        ? {
            address: client.address || '',
            city: client.city || '',
            postal: client.postal || '',
            country: client.country || ''
          }
        : null);

    const order = await db.Order.create({
      orderNumber: meta?.ref || `CMD-${Date.now()}`,
      // userId optionnel
      customerEmail: client?.email || 'client@example.com',
      userId: req.userId,
      client_name: client?.name || null,
      client_phone: client?.phone || null,
      shippingAddress: shippingAddr,
      totalAmount: totals?.final_total ?? totals?.subtotal ?? 0,
      status: 'pending'
    });

    // Créer les items de commande
    if (cart && cart.length > 0) {
      const orderItems = cart.map((item) => ({
        orderId: order.id,
        // templateId optionnel
        productName: item.name || item.id,
        quantity: item.quantity || 1,
        price: item.basePrice || 0,
        size: item.size
      }));

      await db.OrderItem.bulkCreate(orderItems);
    }

    // Incrémenter l'utilisation du code promo si fourni
    try {
      if (totals?.promo_code) {
        const promo = await db.PromoCode.findOne({
          where: { code: String(totals.promo_code).toUpperCase() }
        });
        if (promo) {
          promo.uses = (promo.uses || 0) + 1;
          await promo.save();
        }
      }
    } catch (e) {
      console.warn('promo increment error', e.message);
    }

    res.status(201).json({
      success: true,
      ok: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({
      success: false,
      ok: false,
      error: error.message
    });
  }
});

module.exports = router;

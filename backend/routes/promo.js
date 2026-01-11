const express = require('express');
const router = express.Router();
const db = require('../models');
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'dev-secret';

// Validate promo code
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body || {};
    const upper = String(code || '').trim().toUpperCase();
    const base = Number(subtotal || 0);
    if (!upper) return res.status(400).json({ ok: false, error: 'missing_code' });

    // Seed default codes lazily
    const defaults = [
      { code: 'WELCOME10', type: 'percent', value: 10, minSubtotal: 0, maxUses: 0 },
      { code: 'NOEL5', type: 'fixed', value: 5, minSubtotal: 0, maxUses: 0 },
      { code: 'GAB10', type: 'fixed', value: 10, minSubtotal: 0, maxUses: 0 }
    ];
    for (const d of defaults) {
      const exists = await db.PromoCode.findOne({ where: { code: d.code } });
      if (!exists) await db.PromoCode.create({ ...d, active: true });
    }

    const promo = await db.PromoCode.findOne({ where: { code: upper, active: true } });
    if (!promo) return res.json({ ok: false, error: 'invalid' });
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return res.json({ ok: false, error: 'expired' });
    }
    if (promo.maxUses && promo.uses >= promo.maxUses) {
      return res.json({ ok: false, error: 'limit_reached' });
    }
    if (base < Number(promo.minSubtotal || 0)) {
      return res.json({ ok: false, error: 'min_subtotal' });
    }

    let discount = promo.type === 'percent' ? Math.round(base * Number(promo.value) / 100) : Number(promo.value);
    discount = Math.min(discount, base);
    return res.json({ ok: true, code: promo.code, discount, label: promo.type === 'percent' ? `-${promo.value}%` : `-${promo.value}€` });
  } catch (e) {
    console.error('promo validate error', e);
    res.status(500).json({ ok: false, error: 'server_error' });
  }
});

// Admin create/update promo code
router.post('/create', async (req, res) => {
  try {
    const secret = req.headers['x-admin-secret'];
    if (secret !== ADMIN_SECRET) return res.status(403).json({ ok: false, error: 'forbidden' });
    const { code, type, value, minSubtotal, expiresAt, maxUses, active } = req.body || {};
    if (!code || !type || !value) return res.status(400).json({ ok: false, error: 'missing_fields' });
    const payload = {
      code: String(code).toUpperCase(),
      type,
      value,
      minSubtotal: minSubtotal ?? 0,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      maxUses: maxUses ?? 0,
      active: active ?? true
    };
    const [promo, created] = await db.PromoCode.findOrCreate({ where: { code: payload.code }, defaults: payload });
    if (!created) await promo.update(payload);
    res.json({ ok: true, data: promo });
  } catch (e) {
    console.error('promo create error', e);
    res.status(500).json({ ok: false, error: 'server_error' });
  }
});

module.exports = router;

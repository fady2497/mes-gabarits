const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Chargement des segments depuis le fichier JSON
const segmentsPath = path.join(__dirname, '../data/roulette-segments.json');
let SEGMENTS = [];
try {
  SEGMENTS = JSON.parse(fs.readFileSync(segmentsPath, 'utf-8'));
} catch (e) {
  console.error('roulette segments load error', e);
  SEGMENTS = [];
}

// Memory store des spins par panier (expire après 2h max) — fallback non connecté
const spins = new Map();
const TTL_MS = 2 * 60 * 60 * 1000;
const { verifyToken } = require('../utils/jwt');
const RouletteSpin = require('../models/RouletteSpin');

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function pickSegment() {
  const totalProb = SEGMENTS.reduce((sum, s) => sum + (s.prob || 0), 0);
  const r = Math.random() * totalProb;
  let acc = 0;
  for (const seg of SEGMENTS) {
    acc += seg.prob || 0;
    if (r <= acc) return seg;
  }
  return SEGMENTS[SEGMENTS.length - 1];
}

// POST /api/roulette/spin { cartId }
router.post('/spin', async (req, res) => {
  try {
    // Si connecté: limiter à 1 tirage par jour par utilisateur, avec expiration du gain ≤ 24h
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    const payload = token ? verifyToken(token) : null;

    if (payload && payload.uid) {
      const uid = payload.uid;
      // Vérifier s'il existe un tirage aujourd'hui
      const today = startOfToday();
      const existing = await RouletteSpin.findOne({
        where: { userId: uid },
        order: [['createdAt', 'DESC']]
      });

      if (existing && new Date(existing.createdAt) >= today) {
        // Déjà utilisé aujourd'hui
        return res.json({
          ok: false,
          used: true,
          prize: {
            label: existing.label,
            type: existing.type,
            value: existing.value,
            gift: existing.gift
          }
        });
      }

      // Nouveau tirage
      const segment = pickSegment();
      const expiresAt = segment.type !== 'none' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;
      await RouletteSpin.create({
        userId: uid,
        label: segment.label,
        type: segment.type,
        value: segment.value,
        gift: segment.gift || null,
        expiresAt,
        used: false
      });

      return res.json({ ok: true, prize: segment });
    }

    // Non connecté: fallback cartId avec TTL 2h
    const { cartId } = req.body || {};
    if (!cartId) return res.status(400).json({ ok: false, error: 'missing_cartId' });

    const entry = spins.get(cartId);
    if (entry && Date.now() - entry.ts < TTL_MS) {
      return res.json({ ok: false, used: true, prize: entry.segment });
    }

    const segment = pickSegment();
    spins.set(cartId, { segment, ts: Date.now() });

    return res.json({ ok: true, prize: segment });
  } catch (e) {
    console.error('roulette spin error', e);
    res.status(500).json({ ok: false, error: 'server_error' });
  }
});

// GET /api/roulette/segments
router.get('/segments', (req, res) => {
  try {
    const sanitized = SEGMENTS.map(({ prob, ...rest }) => rest);
    res.json({ ok: true, segments: sanitized });
  } catch (e) {
    console.error('segments error', e);
    res.status(500).json({ ok: false, error: 'server_error' });
  }
});

module.exports = router;

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const STOCK_PATH = path.join(__dirname, '..', 'data', 'stock.json');
const HISTORY_PATH = path.join(__dirname, '..', 'data', 'stock-history.json');
const ADMIN_TOKEN = process.env.STOCK_TOKEN || 'DEV_STOCK_TOKEN';
const { getPool } = require('../utils/mssql');

router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    if (pool) {
      const result = await pool
        .request()
        .query(
          'SELECT id, [current] AS current, [target] AS target, updated_at FROM dbo.stock ORDER BY id'
        );
      const map = {};
      for (const row of result.recordset) {
        map[row.id] = { current: row.current, target: row.target };
      }
      return res.json({ ok: true, data: map, timestamp: new Date().toISOString(), source: 'sql' });
    }
    const raw = fs.readFileSync(STOCK_PATH, 'utf8');
    const json = JSON.parse(raw);
    res.json({ ok: true, data: json, timestamp: new Date().toISOString(), source: 'file' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'stock_read_error', message: error.message });
  }
});

// Mise à jour du stock (protégé par token)
router.post('/', async (req, res) => {
  try {
    const token = req.headers['x-admin-token'];
    if (!token || token !== ADMIN_TOKEN) {
      return res.status(401).json({ ok: false, error: 'unauthorized', message: 'Invalid token' });
    }
    const pool = await getPool();
    const payload = req.body || {};
    if (pool) {
      const sql = require('mssql');
      const upsertOne = async (id, current, target) => {
        const request = pool.request();
        request.input('id', sql.NVarChar(10), String(id).toUpperCase());
        request.input('current', sql.Int, Number(current) || 0);
        request.input('target', sql.Int, Number(target) || 0);
        await request.query('EXEC dbo.usp_Stock_Upsert @id, @current, @target');
      };
      if (payload.id) await upsertOne(payload.id, payload.current, payload.target);
      if (payload.updates && typeof payload.updates === 'object') {
        for (const [idKey, val] of Object.entries(payload.updates)) {
          await upsertOne(idKey, val.current, val.target);
        }
      }
      const result = await pool
        .request()
        .query('SELECT id, [current] AS current, [target] AS target FROM dbo.stock');
      const map = {};
      for (const row of result.recordset)
        map[row.id] = { current: row.current, target: row.target };
      return res.json({ ok: true, data: map, timestamp: new Date().toISOString(), source: 'sql' });
    }
    // Fallback: file
    const raw = fs.readFileSync(STOCK_PATH, 'utf8');
    const before = JSON.parse(raw);
    const json = JSON.parse(raw);
    if (payload.id) {
      const id = String(payload.id).toUpperCase();
      json[id] = {
        current: typeof payload.current === 'number' ? payload.current : (json[id]?.current ?? 0),
        target: typeof payload.target === 'number' ? payload.target : (json[id]?.target ?? 0)
      };
    }
    if (payload.updates && typeof payload.updates === 'object') {
      for (const [idKey, val] of Object.entries(payload.updates)) {
        const id = String(idKey).toUpperCase();
        const prev = json[id] || {};
        json[id] = {
          current: typeof val.current === 'number' ? val.current : (prev.current ?? 0),
          target: typeof val.target === 'number' ? val.target : (prev.target ?? 0)
        };
      }
    }
    fs.writeFileSync(STOCK_PATH, JSON.stringify(json, null, 2), 'utf8');
    let hist = [];
    try {
      const hraw = fs.readFileSync(HISTORY_PATH, 'utf8');
      hist = JSON.parse(hraw) || [];
    } catch (_) {
      hist = [];
    }
    const now = new Date().toISOString();
    const entries = [];
    if (payload.id) {
      const id = String(payload.id).toUpperCase();
      entries.push({ id, before: before[id] || null, after: json[id] || null, ts: now });
    }
    if (payload.updates && typeof payload.updates === 'object') {
      for (const idKey of Object.keys(payload.updates)) {
        const id = String(idKey).toUpperCase();
        entries.push({ id, before: before[id] || null, after: json[id] || null, ts: now });
      }
    }
    hist = [...entries, ...hist].slice(0, 1000);
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(hist, null, 2), 'utf8');
    res.json({ ok: true, data: json, timestamp: now, source: 'file' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'stock_write_error', message: error.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(1000, parseInt(String(req.query.limit || '200'), 10)));
    const pool = await getPool();
    if (pool) {
      const sql = `SELECT TOP (${limit}) id, before_current, before_target, after_current, after_target, ts FROM dbo.stock_history ORDER BY ts DESC`;
      const result = await pool.request().query(sql);
      return res.json({
        ok: true,
        data: result.recordset,
        count: result.recordset.length,
        total: result.recordset.length,
        source: 'sql'
      });
    }
    const hraw = fs.readFileSync(HISTORY_PATH, 'utf8');
    const hist = JSON.parse(hraw) || [];
    res.json({
      ok: true,
      data: hist.slice(0, limit),
      count: Math.min(hist.length, limit),
      total: hist.length,
      source: 'file'
    });
  } catch (_) {
    res.json({ ok: true, data: [], count: 0, total: 0 });
  }
});

module.exports = router;

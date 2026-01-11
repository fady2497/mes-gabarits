const express = require('express');
const { getPool } = require('../utils/mssql');

const router = express.Router();

router.get('/stock', async (req, res) => {
  try {
    const pool = await getPool();
    if (pool) {
      const result = await pool
        .request()
        .query(
          'SELECT id, [current] AS current, [target] AS target, deficit, updated_at, status FROM dbo.vw_stock_status ORDER BY id'
        );
      return res.json({
        ok: true,
        data: result.recordset,
        source: 'sql',
        timestamp: new Date().toISOString()
      });
    }
    return res.json({ ok: true, data: [], source: 'file', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'stats_stock_error', message: error.message });
  }
});

router.get('/sales-by-day', async (req, res) => {
  try {
    const pool = await getPool();
    if (pool) {
      const result = await pool
        .request()
        .query('SELECT jour, nb_commandes, total_eur FROM dbo.vw_sales_by_day ORDER BY jour DESC');
      return res.json({
        ok: true,
        data: result.recordset,
        source: 'sql',
        timestamp: new Date().toISOString()
      });
    }
    return res.json({ ok: true, data: [], source: 'file', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'stats_sales_error', message: error.message });
  }
});

router.get('/top-templates', async (req, res) => {
  try {
    const pool = await getPool();
    if (pool) {
      const result = await pool
        .request()
        .query('SELECT templateId, template_name, qty_sold, revenue_eur FROM dbo.vw_top_templates');
      return res.json({
        ok: true,
        data: result.recordset,
        source: 'sql',
        timestamp: new Date().toISOString()
      });
    }
    return res.json({ ok: true, data: [], source: 'file', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'stats_top_templates_error', message: error.message });
  }
});

router.get('/orders-status', async (req, res) => {
  try {
    const pool = await getPool();
    if (pool) {
      const result = await pool
        .request()
        .query('SELECT status, nb FROM dbo.vw_orders_status_counts');
      return res.json({
        ok: true,
        data: result.recordset,
        source: 'sql',
        timestamp: new Date().toISOString()
      });
    }
    return res.json({ ok: true, data: [], source: 'file', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'stats_orders_status_error', message: error.message });
  }
});

module.exports = router;

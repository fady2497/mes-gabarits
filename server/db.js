const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'orders.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref TEXT,
      client_name TEXT,
      client_phone TEXT,
      client_notes TEXT,
      subtotal REAL,
      price_per_unit REAL,
      total_items INTEGER,
      items_json TEXT,
      created_at TEXT
    )`
  );
});

function insertOrder({ ref, client, cart, totals }) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      `INSERT INTO orders (ref, client_name, client_phone, client_notes, subtotal, price_per_unit, total_items, items_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    stmt.run(
      ref,
      client.name,
      client.phone,
      client.notes || null,
      totals.subtotal,
      totals.pricePerUnit,
      totals.totalItems,
      JSON.stringify(cart),
      new Date().toISOString(),
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

function listOrders(limit = 50) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, ref, client_name, client_phone, subtotal, total_items, created_at FROM orders ORDER BY id DESC LIMIT ?`,
      [limit],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

module.exports = { insertOrder, listOrders };


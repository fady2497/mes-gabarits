const { sendMail } = require('../utils/mailer');
const { insertOrder, listOrders } = require('../db');

function buildOrderBody(client, cart, totals, meta) {
  const lines = cart.map(
    (item) =>
      `- ${item.id} | ${item.name} | Taille ${item.size || '-'} | Qté ${item.quantity} | ${item.quantity * (totals?.pricePerUnit || 0)}€`
  );
  const header = [
    `Client: ${client.name} | Téléphone: ${client.phone}`,
    client.notes ? `Notes: ${client.notes}` : null
  ].filter(Boolean);
  const totalLine = `Total: ${totals?.subtotal ?? 0}€`;
  return [
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
}

async function createOrder(req, res) {
  try {
    const { client, cart, totals, meta } = req.body || {};
    if (!client || !client.name || !client.phone)
      return res.status(400).json({ ok: false, error: 'invalid_client' });
    if (!Array.isArray(cart) || cart.length === 0)
      return res.status(400).json({ ok: false, error: 'empty_cart' });

    const body = buildOrderBody(client, cart, totals, meta);
    if (process.env.MERCHANT_EMAIL) {
      await sendMail(process.env.MERCHANT_EMAIL, 'Commande de gabarits', body);
    }
    await insertOrder({ ref: meta?.ref || `CMD-${Date.now()}`, client, cart, totals });
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}

async function getOrders(req, res) {
  try {
    const rows = await listOrders(parseInt(req.query.limit || '50', 10));
    res.json({ ok: true, data: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'server_error' });
  }
}

module.exports = { createOrder, getOrders };

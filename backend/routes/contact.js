const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};
    if (!message || (!email && !phone)) {
      return res.status(400).json({ ok: false, error: 'invalid_contact' });
    }
    console.log('CONTACT_MESSAGE', {
      name: name || null,
      email: email || null,
      phone: phone || null,
      message
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'server_error' });
  }
});

module.exports = router;

